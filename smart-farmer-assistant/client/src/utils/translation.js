// Translation utility for Hindi/English support
const translations = {
  hindi: {
    // Navigation
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    expenses: 'खर्चे',
    crops: 'फसलें',
    weather: 'मौसम',
    voice: 'आवाज़',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    
    // Common
    name: 'नाम',
    mobile: 'मोबाइल',
    village: 'गांव',
    district: 'जिला',
    state: 'राज्य',
    landSize: 'ज़मीन का आकार (एकड़)',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    add: 'जोड़ें',
    edit: 'एडिट करें',
    delete: 'हटाएं',
    amount: 'राशि',
    description: 'विवरण',
    date: 'तारीख',
    category: 'श्रेणी',
    
    // Expense types
    investment: 'निवेश',
    profit: 'मुनाफा',
    loss: 'नुकसान',
    
    // Categories
    seeds: 'बीज',
    fertilizer: 'खाद',
    pesticide: 'कीटनाशक',
    labor: 'मजदूरी',
    equipment: 'उपकरण',
    irrigation: 'सिंचाई',
    harvest: 'फसल कटाई',
    other: 'अन्य',
    
    // Messages
    welcome: 'स्मार्ट किसान सहायक में आपका स्वागत है',
    loginSuccess: 'लॉगिन सफल!',
    registrationSuccess: 'पंजीकरण सफल!',
    expenseAdded: 'खर्चा जोड़ा गया',
    cropAdded: 'फसल जोड़ी गई',
    error: 'त्रुटि',
    success: 'सफलता',
    
    // Weather
    temperature: 'तापमान',
    humidity: 'नमी',
    windSpeed: 'हवा की गति',
    advice: 'सलाह',
    irrigation: 'सिंचाई',
    pesticide: 'कीटनाशक',
    harvesting: 'फसल कटाई',
    sowing: 'बुवाई',
    
    // Voice
    startRecording: 'रिकॉर्डिंग शुरू करें',
    stopRecording: 'रिकॉर्डिंग रोकें',
    listening: 'सुन रहे हैं...',
    speakNow: 'अब बोलें',
    
    // Dashboard
    totalInvestment: 'कुल निवेश',
    totalProfit: 'कुल मुनाफा',
    totalLoss: 'कुल नुकसान',
    netProfit: 'नेट मुनाफा',
    todaySuggestions: 'आज की सलाहें',
    
    // Crops
    season: 'सीजन',
    soilType: 'मिट्टी का प्रकार',
    area: 'क्षेत्रफल',
    expectedYield: 'अपेक्षित उपज',
    actualYield: 'वास्तविक उपज',
    status: 'स्थिति',
    
    // Seasons
    kharif: 'खरीफ',
    rabi: 'रबी',
    zaid: 'ज़ैद',
    
    // Soil types
    clay: 'चिकनी मिट्टी',
    loamy: 'दोमट मिट्टी',
    sandy: 'रेती मिट्टी',
    black: 'काली मिट्टी',
    red: 'लाल मिट्टी',
    
    // Crop status
    planned: 'योजनाबद्ध',
    sown: 'बोई गई',
    growing: 'उग रही है',
    ready: 'तैयार',
    harvested: 'कट गई'
  },
  
  english: {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    crops: 'Crops',
    weather: 'Weather',
    voice: 'Voice',
    login: 'Login',
    logout: 'Logout',
    
    // Common
    name: 'Name',
    mobile: 'Mobile',
    village: 'Village',
    district: 'District',
    state: 'State',
    landSize: 'Land Size (Acres)',
    save: 'Save',
    cancel: 'Cancel',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    amount: 'Amount',
    description: 'Description',
    date: 'Date',
    category: 'Category',
    
    // Expense types
    investment: 'Investment',
    profit: 'Profit',
    loss: 'Loss',
    
    // Categories
    seeds: 'Seeds',
    fertilizer: 'Fertilizer',
    pesticide: 'Pesticide',
    labor: 'Labor',
    equipment: 'Equipment',
    irrigation: 'Irrigation',
    harvest: 'Harvest',
    other: 'Other',
    
    // Messages
    welcome: 'Welcome to Smart Farmer Assistant',
    loginSuccess: 'Login Successful!',
    registrationSuccess: 'Registration Successful!',
    expenseAdded: 'Expense Added',
    cropAdded: 'Crop Added',
    error: 'Error',
    success: 'Success',
    
    // Weather
    temperature: 'Temperature',
    humidity: 'Humidity',
    windSpeed: 'Wind Speed',
    advice: 'Advice',
    irrigation: 'Irrigation',
    pesticide: 'Pesticide',
    harvesting: 'Harvesting',
    sowing: 'Sowing',
    
    // Voice
    startRecording: 'Start Recording',
    stopRecording: 'Stop Recording',
    listening: 'Listening...',
    speakNow: 'Speak Now',
    
    // Dashboard
    totalInvestment: 'Total Investment',
    totalProfit: 'Total Profit',
    totalLoss: 'Total Loss',
    netProfit: 'Net Profit',
    todaySuggestions: 'Today\'s Suggestions',
    
    // Crops
    season: 'Season',
    soilType: 'Soil Type',
    area: 'Area',
    expectedYield: 'Expected Yield',
    actualYield: 'Actual Yield',
    status: 'Status',
    
    // Seasons
    kharif: 'Kharif',
    rabi: 'Rabi',
    zaid: 'Zaid',
    
    // Soil types
    clay: 'Clay Soil',
    loamy: 'Loamy Soil',
    sandy: 'Sandy Soil',
    black: 'Black Soil',
    red: 'Red Soil',
    
    // Crop status
    planned: 'Planned',
    sown: 'Sown',
    growing: 'Growing',
    ready: 'Ready',
    harvested: 'Harvested'
  }
}

export const useTranslation = (language = 'hindi') => {
  const t = (key) => {
    return translations[language]?.[key] || key
  }
  
  const changeLanguage = (newLang) => {
    // Language change logic
    localStorage.setItem('preferredLanguage', newLang)
  }
  
  return { t, changeLanguage }
}
