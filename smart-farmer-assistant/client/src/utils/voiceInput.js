// Voice Input Utility using Web Speech API
// Supports Hindi and English speech recognition

export class VoiceInputHandler {
  constructor(language = 'hi-IN') {
    this.language = language;
    this.recognition = null;
    this.isListening = false;
    this.transcript = '';
    this.interimTranscript = '';
    this.initRecognition();
  }

  initRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.language = this.language;

    this.recognition.onstart = () => {
      this.isListening = true;
      this.transcript = '';
      this.interimTranscript = '';
    };

    this.recognition.onresult = (event) => {
      this.interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.transcript += transcript + ' ';
        } else {
          this.interimTranscript += transcript;
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };
  }

  start(callback) {
    if (!this.recognition) {
      console.error('Speech Recognition not available');
      return;
    }

    this.transcript = '';
    this.interimTranscript = '';
    
    this.recognition.onend = () => {
      this.isListening = false;
      if (callback) {
        callback(this.transcript.trim());
      }
    };

    this.recognition.start();
  }

  stop() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  setLanguage(language) {
    this.language = language;
    if (this.recognition) {
      this.recognition.language = language;
    }
  }

  getTranscript() {
    return this.transcript.trim();
  }

  getInterimTranscript() {
    return this.interimTranscript;
  }

  isSupported() {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }
}

// Parse voice input to extract expense data
export const parseExpenseFromVoice = (voiceText) => {
  const patterns = {
    // Pattern: "Maine 5000 kharcha kiya seeds pe" or "मैंने 5000 खर्च किया बीज पर"
    amount: /(\d+)/,
    investmentTypes: ['investment', 'निवेश', 'kharcha', 'खर्च', 'investment'],
    profitTypes: ['profit', 'labh', 'लाभ', 'munnafa', 'मुनाफा'],
    lossTypes: ['loss', 'nuksan', 'नुकसान', 'ghat', 'घाटा'],
    
    categories: {
      seeds: ['seed', 'beej', 'बीज', 'bij'],
      fertilizer: ['fertilizer', 'khad', 'खाद', 'urvarak', 'उर्वरक'],
      pesticide: ['pesticide', 'kitnashak', 'कीटनाशक', 'spray', 'स्प्रे'],
      labor: ['labor', 'majduri', 'मजदूरी', 'worker', 'कामगार'],
      equipment: ['equipment', 'yantra', 'यंत्र', 'machine', 'मशीन'],
      irrigation: ['irrigation', 'sinchai', 'सिंचाई', 'pani', 'पानी', 'water'],
      harvest: ['harvest', 'katai', 'कटाई', 'cutting'],
      other: ['other', 'aur', 'और', 'etc', 'vagerah', 'वगैरह']
    }
  };

  const result = {
    amount: null,
    type: 'investment',
    category: 'other',
    description: voiceText
  };

  // Extract amount
  const amountMatch = voiceText.match(patterns.amount);
  if (amountMatch) {
    result.amount = parseInt(amountMatch[1]);
  }

  // Extract type
  const lowerText = voiceText.toLowerCase();
  if (patterns.profitTypes.some(p => lowerText.includes(p))) {
    result.type = 'profit';
  } else if (patterns.lossTypes.some(p => lowerText.includes(p))) {
    result.type = 'loss';
  }

  // Extract category
  for (const [category, keywords] of Object.entries(patterns.categories)) {
    if (keywords.some(k => lowerText.includes(k.toLowerCase()))) {
      result.category = category;
      break;
    }
  }

  return result;
};

// Text to Speech for feedback
export const speakFeedback = (text, language = 'hi-IN') => {
  if (!window.SpeechSynthesis) {
    console.warn('Text to Speech not supported');
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.language = language;
  utterance.rate = 0.9;

  window.speechSynthesis.speak(utterance);
};

// Get Hindi greeting based on time
export const getTimeBasedGreeting = (language = 'hindi') => {
  const hour = new Date().getHours();

  const greetings = {
    morning: {
      hindi: 'सुप्रभात! आपके खेत की देखभाल करने का समय है।',
      english: 'Good Morning! Time to take care of your farm.'
    },
    afternoon: {
      hindi: 'दोपहर का समय है। अपने खर्चों की जांच कर लें।',
      english: 'Good Afternoon! Check your expenses.'
    },
    evening: {
      hindi: 'शाम का समय है। आज की रिपोर्ट देखें।',
      english: 'Good Evening! Check today\'s report.'
    },
    night: {
      hindi: 'रात को आराम करें। कल के लिए तैयार रहें।',
      english: 'Good Night! Rest well and prepare for tomorrow.'
    }
  };

  let timeOfDay = 'night';
  if (hour >= 5 && hour < 12) timeOfDay = 'morning';
  else if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
  else if (hour >= 17 && hour < 21) timeOfDay = 'evening';

  const lang = language === 'hindi' ? 'hindi' : 'english';
  return greetings[timeOfDay][lang];
};

export default {
  VoiceInputHandler,
  parseExpenseFromVoice,
  speakFeedback,
  getTimeBasedGreeting
};
