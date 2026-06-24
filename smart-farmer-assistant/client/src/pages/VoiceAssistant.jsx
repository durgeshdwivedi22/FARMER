import React, { useState, useContext } from 'react';
import { PageContainer, PageTitle } from '../components/Layout';
import { Card, LargeButton, Alert, LoadingSpinner } from '../components/ui';
import { VoiceInputHandler, parseExpenseFromVoice, speakFeedback } from '../utils/voiceInput';
import { expenseAPI } from '../services/api';

const VoiceAssistant = ({ language }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    const handler = new VoiceInputHandler(language === 'hindi' ? 'hi-IN' : 'en-US');
    if (handler.isSupported()) {
      setRecognition(handler);
    } else {
      setError('आपकी ब्राउज़र आवाज़ इनपुट को सपोर्ट नहीं करती');
    }
  }, [language]);

  const startListening = () => {
    setError('');
    setSuccess('');
    setTranscript('');
    setParsedData(null);

    if (!recognition) {
      setError('आवाज़ इनपुट उपलब्ध नहीं है');
      return;
    }

    setIsListening(true);
    recognition.setLanguage(language === 'hindi' ? 'hi-IN' : 'en-US');

    recognition.start((finalTranscript) => {
      setIsListening(false);
      setTranscript(finalTranscript);

      // Parse the voice input
      const parsed = parseExpenseFromVoice(finalTranscript);
      setParsedData(parsed);

      // Speak feedback
      const feedbackText = language === 'hindi'
        ? `समझ गया। ₹${parsed.amount} का खर्च ${parsed.type} के रूप में।`
        : `Understood. ₹${parsed.amount} as ${parsed.type}.`;
      
      speakFeedback(feedbackText, language === 'hindi' ? 'hi-IN' : 'en-US');
    });
  };

  const confirmAndSaveExpense = async () => {
    if (!parsedData || !parsedData.amount) {
      setError('कृपया पहले अपनी आवाज़ रिकॉर्ड करें');
      return;
    }

    setLoading(true);
    try {
      const response = await expenseAPI.create({
        type: parsedData.type,
        amount: parsedData.amount,
        category: parsedData.category,
        description: transcript,
        date: new Date(),
        voiceNote: transcript
      });

      if (response.success) {
        setSuccess('✓ खर्च सफलतापूर्वक जोड़ा गया!');
        
        // Speak confirmation
        const confirmText = language === 'hindi'
          ? 'खर्च सफल रूप से सहेज दिया गया'
          : 'Expense saved successfully';
        speakFeedback(confirmText, language === 'hindi' ? 'hi-IN' : 'en-US');

        // Reset
        setTimeout(() => {
          setTranscript('');
          setParsedData(null);
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      setError('खर्च सहेजने में त्रुटि। कृपया दोबारा कोशिश करें।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageTitle 
        icon="🎤" 
        title="आवाज़ सहायक" 
        subtitle="अपनी खेती के बारे में बोलें, हम सुनेंगे"
      />

      {error && <Alert type="error" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Voice Input Card */}
      <Card className="mb-8 text-center bg-gradient-to-br from-purple-50 to-pink-50">
        <p className="text-6xl mb-6">🎤</p>
        
        <LargeButton
          onClick={startListening}
          disabled={isListening || loading}
          variant={isListening ? 'danger' : 'primary'}
          size="xl"
          className="mb-6"
        >
          {isListening ? '🔴 सुन रहे हैं...' : '🎤 बोलना शुरू करें'}
        </LargeButton>

        <p className="text-lg text-gray-700 mb-4">
          आप कह सकते हैं:<br/>
          <span className="font-semibold">
            "मैंने 5000 खर्च किए खाद पर"<br/>
            या<br/>
            "2000 का लाभ हुआ"
          </span>
        </p>
      </Card>

      {/* Transcript Display */}
      {transcript && (
        <Card className="mb-8" title="आपकी आवाज़">
          <p className="text-xl text-gray-800 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            "{transcript}"
          </p>
        </Card>
      )}

      {/* Parsed Data Display */}
      {parsedData && (
        <Card className="mb-8 bg-green-50 border-l-4 border-green-600" title="✓ पार्स किया गया डेटा">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">राशि</p>
                <p className="text-3xl font-bold text-green-700">₹{parsedData.amount}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">प्रकार</p>
                <p className="text-2xl font-bold">
                  {parsedData.type === 'profit' ? '📈 लाभ' :
                   parsedData.type === 'loss' ? '📉 नुकसान' :
                   '💰 निवेश'}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600 text-sm">श्रेणी</p>
                <p className="text-lg font-bold">
                  {parsedData.category === 'seeds' ? '🌱 बीज' :
                   parsedData.category === 'fertilizer' ? '🥕 खाद' :
                   parsedData.category === 'pesticide' ? '🐛 कीटनाशक' :
                   parsedData.category === 'labor' ? '👷 मजदूरी' :
                   parsedData.category === 'equipment' ? '⚙️ यंत्र' :
                   parsedData.category === 'irrigation' ? '💧 सिंचाई' :
                   parsedData.category === 'harvest' ? '🌾 कटाई' :
                   '📋 अन्य'}
                </p>
              </div>
            </div>

            <Alert 
              type="info" 
              message="डेटा सही है? नीचे सहेजें बटन दबाएं"
            />

            <div className="flex gap-4">
              <LargeButton
                onClick={confirmAndSaveExpense}
                disabled={loading}
                variant="success"
              >
                {loading ? 'सहेज रहे हैं...' : '✓ सहेजें'}
              </LargeButton>
              <LargeButton
                onClick={() => {
                  setTranscript('');
                  setParsedData(null);
                }}
                variant="secondary"
              >
                ✗ फिर से कोशिश करें
              </LargeButton>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="bg-blue-50 border-l-4 border-blue-600" title="💡 कैसे इस्तेमाल करें">
        <div className="space-y-3 text-lg">
          <p>1️⃣ <strong>बोलना शुरू करें</strong> बटन दबाएं</p>
          <p>2️⃣ <strong>स्पष्ट आवाज़ में</strong> अपना खर्च बताएं</p>
          <p>3️⃣ हम <strong>स्वचालित रूप से डेटा निकाल</strong> देंगे</p>
          <p>4️⃣ अगर सही है तो <strong>सहेजें</strong> बटन दबाएं</p>
          <p>5️⃣ नहीं तो <strong>फिर से कोशिश करें</strong></p>
        </div>
      </Card>
    </PageContainer>
  );
};

export default VoiceAssistant;
