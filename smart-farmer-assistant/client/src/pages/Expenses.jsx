import React, { useState, useEffect } from 'react';
import { PageContainer, PageTitle, GridLayout } from '../components/Layout';
import { Card, LargeButton, InputField, SelectField, TransactionItem, LoadingSpinner, Alert } from '../components/ui';
import { expenseAPI } from '../services/api';
import { VoiceInputHandler, parseExpenseFromVoice } from '../utils/voiceInput';
import { useTranslation } from '../utils/translation';

const Expenses = ({ language }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [voice, setVoice] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation(language);

  const [formData, setFormData] = useState({
    type: 'investment',
    amount: '',
    category: 'other',
    description: '',
    date: new Date().toISOString().split('T')[0],
    voiceNote: ''
  });

  useEffect(() => {
    fetchExpenses();
    if (VoiceInputHandler.prototype.isSupported?.()) {
      setVoice(new VoiceInputHandler(language === 'hindi' ? 'hi-IN' : 'en-US'));
    }
  }, [language]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseAPI.getAll();
      setExpenses(response.data || []);
    } catch (err) {
      setError('खर्च लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!voice || !voice.isSupported()) {
      setError('आपकी ब्राउज़र आवाज़ को सपोर्ट नहीं करती');
      return;
    }

    setIsListening(true);
    voice.setLanguage(language === 'hindi' ? 'hi-IN' : 'en-US');
    
    voice.start((transcript) => {
      setIsListening(false);
      const parsedData = parseExpenseFromVoice(transcript);
      
      setFormData(prev => ({
        ...prev,
        amount: parsedData.amount || prev.amount,
        type: parsedData.type,
        category: parsedData.category,
        description: transcript,
        voiceNote: transcript
      }));
      
      setSuccess(`🎤 समझ गया: ${transcript}`);
      setTimeout(() => setSuccess(''), 3000);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.amount || !formData.description) {
      setError('राशि और विवरण आवश्यक हैं');
      return;
    }

    try {
      const response = await expenseAPI.create({
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date)
      });

      if (response.success) {
        setSuccess('✓ खर्च जोड़ा गया!');
        setFormData({
          type: 'investment',
          amount: '',
          category: 'other',
          description: '',
          date: new Date().toISOString().split('T')[0],
          voiceNote: ''
        });
        setTimeout(() => {
          setShowForm(false);
          fetchExpenses();
          setSuccess('');
        }, 1000);
      }
    } catch (err) {
      setError('खर्च जोड़ने में त्रुटि');
    }
  };

  if (loading) return <LoadingSpinner message="खर्च लोड हो रहे हैं..." />;

  const categories = [
    { value: 'seeds', label: 'बीज' },
    { value: 'fertilizer', label: 'खाद' },
    { value: 'pesticide', label: 'कीटनाशक' },
    { value: 'labor', label: 'मजदूरी' },
    { value: 'equipment', label: 'यंत्र' },
    { value: 'irrigation', label: 'सिंचाई' },
    { value: 'harvest', label: 'कटाई' },
    { value: 'other', label: 'अन्य' }
  ];

  const types = [
    { value: 'investment', label: 'निवेश' },
    { value: 'profit', label: 'लाभ' },
    { value: 'loss', label: 'नुकसान' }
  ];

  return (
    <PageContainer>
      <PageTitle icon="💰" title="खर्च ट्रैकर" subtitle="अपने सभी खर्चों को ट्रैक करें" />

      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} />}

      {/* Add Expense Button */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <LargeButton
            variant="primary"
            size="lg"
            onClick={() => setShowForm(true)}
          >
            ➕ खर्च जोड़ें
          </LargeButton>
          <LargeButton
            variant="secondary"
            size="lg"
            onClick={handleVoiceInput}
            disabled={isListening}
          >
            {isListening ? '🎤 सुन रहे हैं...' : '🎤 आवाज़ से जोड़ें'}
          </LargeButton>
        </div>
      )}

      {/* Add Expense Form */}
      {showForm && (
        <Card className="mb-8" title="नया खर्च जोड़ें">
          <form onSubmit={handleSubmit} className="space-y-4">
            <SelectField
              label="प्रकार"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={types}
              required
            />

            <InputField
              label="राशि (₹)"
              type="number"
              placeholder="राशि दर्ज करें"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />

            <SelectField
              label="श्रेणी"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categories}
              required
            />

            <InputField
              label="विवरण"
              placeholder="क्या खरीदा या कमाया?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />

            <InputField
              label="तारीख"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <div className="flex gap-4">
              <LargeButton type="submit" variant="success">
                सहेजें
              </LargeButton>
              <LargeButton
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                रद्द करें
              </LargeButton>
            </div>
          </form>
        </Card>
      )}

      {/* Expenses List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 सभी खर्चे</h2>
        {expenses.length > 0 ? (
          <div className="space-y-2">
            {expenses.map(expense => (
              <TransactionItem
                key={expense._id}
                name={expense.description}
                amount={expense.amount}
                date={new Date(expense.date).toLocaleDateString('hi-IN')}
                type={expense.type}
                category={expense.category}
              />
            ))}
          </div>
        ) : (
          <Card>
            <p className="text-center text-gray-600 text-lg">कोई खर्च नहीं</p>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default Expenses;
