// Smart Insights System - Generates farming advice based on farmer data

const generateInsights = (expenses, crops) => {
  const insights = [];

  // Calculate financial metrics
  const investments = expenses.filter(e => e.type === 'investment');
  const profits = expenses.filter(e => e.type === 'profit');
  const losses = expenses.filter(e => e.type === 'loss');

  const totalInvestment = investments.reduce((sum, e) => sum + e.amount, 0);
  const totalProfit = profits.reduce((sum, e) => sum + e.amount, 0);
  const totalLoss = losses.reduce((sum, e) => sum + e.amount, 0);

  // 1. Profit/Loss Analysis
  const netProfit = totalProfit - totalLoss;
  const roi = totalInvestment > 0 ? ((netProfit / totalInvestment) * 100).toFixed(2) : 0;

  if (roi > 50) {
    insights.push({
      type: 'positive',
      priority: 'high',
      title: 'बहुत अच्छा लाभ (Excellent Profit)',
      message: `आपका लाभ मार्जिन ${roi}% है। यह बहुत अच्छी स्थिति है! इसी तरह जारी रखें।`,
      englishMessage: `Your profit margin is ${roi}%. This is excellent! Keep it up.`,
      icon: '📈',
      action: 'continue_current_practice'
    });
  } else if (roi > 20) {
    insights.push({
      type: 'positive',
      priority: 'medium',
      title: 'अच्छा लाभ (Good Profit)',
      message: `आपका लाभ ${roi}% है। बढ़ाने के लिए खाद की दक्षता देखें।`,
      englishMessage: `Your profit is ${roi}%. Consider optimizing fertilizer costs to increase profit.`,
      icon: '👍',
      action: 'optimize_costs'
    });
  } else if (roi < 0) {
    insights.push({
      type: 'warning',
      priority: 'high',
      title: 'नुकसान की स्थिति (Loss Alert)',
      message: `आप इस समय नुकसान कर रहे हैं। खर्चों की विस्तृत जांच करें।`,
      englishMessage: `You are facing losses. Review your expenses carefully and reduce unnecessary costs.`,
      icon: '⚠️',
      action: 'review_expenses'
    });
  }

  // 2. Category-wise Expense Analysis
  const categoryAnalysis = analyzeExpensesByCategory(expenses);
  categoryAnalysis.forEach(category => {
    if (category.percentage > 40) {
      insights.push({
        type: 'warning',
        priority: 'medium',
        title: `बहुत अधिक ${category.name} खर्च (High ${category.name} Cost)`,
        message: `${category.name} पर आपका खर्च ${category.percentage}% है। इसे कम करने की कोशिश करें।`,
        englishMessage: `Your ${category.name} expenses are ${category.percentage}%. Consider reducing these costs.`,
        icon: '💰',
        action: 'reduce_category_cost',
        category: category.category
      });
    }
  });

  // 3. Crop Performance
  if (crops && crops.length > 0) {
    const lastCrop = crops[crops.length - 1];
    
    if (lastCrop.actualProfit > lastCrop.expectedProfit * 0.9) {
      insights.push({
        type: 'positive',
        priority: 'medium',
        title: `${lastCrop.name} में अच्छा प्रदर्शन (Good ${lastCrop.name} Performance)`,
        message: `आपकी ${lastCrop.name} की फसल अपेक्षा से अच्छी है। यही तरीका आगे भी अपनाएं।`,
        englishMessage: `Your ${lastCrop.name} crop performed well. Continue with this approach.`,
        icon: '🌾',
        action: 'repeat_crop_strategy'
      });
    }
  }

  // 4. Seasonal Recommendations
  const currentMonth = new Date().getMonth();
  const seasonalAdvice = getSeasonalAdvice(currentMonth);
  insights.push({
    type: 'info',
    priority: 'medium',
    title: seasonalAdvice.title,
    message: seasonalAdvice.message,
    englishMessage: seasonalAdvice.englishMessage,
    icon: '📅',
    action: 'follow_seasonal_advice'
  });

  // 5. Fertilizer Efficiency (Random but useful)
  if (totalInvestment > 0) {
    const fertilizerExpense = expenses.filter(e => e.category === 'fertilizer').reduce((sum, e) => sum + e.amount, 0);
    const fertilizerRatio = (fertilizerExpense / totalInvestment) * 100;
    
    if (fertilizerRatio > 20) {
      insights.push({
        type: 'suggestion',
        priority: 'low',
        title: 'खाद की दक्षता (Fertilizer Efficiency)',
        message: 'आपका खाद का खर्च अधिक है। मिट्टी परीक्षण कराएं या गोबर की खाद अधिक उपयोग करें।',
        englishMessage: 'Consider soil testing or using more organic manure to reduce fertilizer costs.',
        icon: '🧪',
        action: 'test_soil'
      });
    }
  }

  return {
    success: true,
    totalInsights: insights.length,
    insights: insights.sort((a, b) => {
      const priorityMap = { high: 1, medium: 2, low: 3 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    }),
    summary: {
      totalInvestment,
      totalProfit,
      totalLoss,
      netProfit,
      roi: parseFloat(roi),
      farmHealth: calculateFarmHealth(roi, categoryAnalysis)
    }
  };
};

const analyzeExpensesByCategory = (expenses) => {
  const categories = {};
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  expenses.forEach(expense => {
    if (!categories[expense.category]) {
      categories[expense.category] = 0;
    }
    categories[expense.category] += expense.amount;
  });

  return Object.entries(categories).map(([category, amount]) => ({
    category,
    name: getCategoryName(category),
    amount,
    percentage: ((amount / totalAmount) * 100).toFixed(2)
  }));
};

const getCategoryName = (category) => {
  const names = {
    'seeds': 'बीज (Seeds)',
    'fertilizer': 'खाद (Fertilizer)',
    'pesticide': 'कीटनाशक (Pesticide)',
    'labor': 'मजदूरी (Labor)',
    'equipment': 'यंत्र (Equipment)',
    'irrigation': 'सिंचाई (Irrigation)',
    'harvest': 'कटाई (Harvest)',
    'other': 'अन्य (Other)'
  };
  return names[category] || category;
};

const getSeasonalAdvice = (month) => {
  // Month: 0 = January, 11 = December
  const adviceMap = {
    'rabi': {
      months: [9, 10, 11, 12, 1, 2], // Sep-Feb
      title: 'रबी सीजन की तैयारी (Rabi Season)',
      message: 'रबी फसलों की बुवाई का समय है। गेहूं, सरसों, और दाल की बुवाई करें।',
      englishMessage: 'It is time for Rabi crop sowing. Plant wheat, mustard, and pulses.'
    },
    'kharif': {
      months: [5, 6, 7, 8], // Jun-Sep
      title: 'खरीफ सीजन (Kharif Season)',
      message: 'खरीफ का मौसम चल रहा है। धान और मक्का की फसल का ध्यान रखें।',
      englishMessage: 'Kharif season is ongoing. Monitor your rice and corn crops carefully.'
    },
    'zaid': {
      months: [3, 4], // Mar-Apr
      title: 'गर्मी की फसल (Summer Crops)',
      message: 'गर्मी में सब्जियां बोएं। खीरा, तरबूज, और भिंडी के लिए अच्छा समय है।',
      englishMessage: 'Good time for summer vegetables. Plant cucumber, watermelon, and okra.'
    }
  };

  let selectedAdvice = adviceMap['kharif']; // Default
  
  if (adviceMap['rabi'].months.includes(month)) {
    selectedAdvice = adviceMap['rabi'];
  } else if (adviceMap['zaid'].months.includes(month)) {
    selectedAdvice = adviceMap['zaid'];
  }

  return {
    title: selectedAdvice.title,
    message: selectedAdvice.message,
    englishMessage: selectedAdvice.englishMessage
  };
};

const calculateFarmHealth = (roi, categoryAnalysis) => {
  let score = 50; // Base score

  // Add based on ROI
  if (roi > 30) score += 30;
  else if (roi > 10) score += 20;
  else if (roi > 0) score += 10;

  // Check for balanced expenses
  const hasHighExpense = categoryAnalysis.some(c => c.percentage > 40);
  if (!hasHighExpense) score += 10;

  // Cap at 100
  return Math.min(score, 100);
};

module.exports = {
  generateInsights,
  analyzeExpensesByCategory,
  getSeasonalAdvice,
  calculateFarmHealth
};
