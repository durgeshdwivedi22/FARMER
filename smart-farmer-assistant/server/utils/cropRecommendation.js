// AI-based Crop Recommendation System
// Rule-based intelligent crop suggestions based on soil, season, and location

const cropDatabase = {
  kharif: {
    clay: {
      crops: ['धान (Rice)', 'गन्ना (Sugarcane)', 'मकई (Corn)'],
      reasons: ['Clay soil retains moisture well, suitable for rice', 'Good for water-intensive crops'],
      profitEstimate: [25000, 35000, 22000]
    },
    loamy: {
      crops: ['गेहूँ (Wheat)', 'धान (Rice)', 'कपास (Cotton)'],
      reasons: ['Loamy soil is ideal for most crops', 'Excellent water retention and drainage'],
      profitEstimate: [30000, 28000, 32000]
    },
    sandy: {
      crops: ['मूंगफली (Peanut)', 'तिल (Sesame)', 'रागी (Millet)'],
      reasons: ['Sandy soil needs drought-resistant crops', 'Good drainage but needs lower water crops'],
      profitEstimate: [20000, 18000, 16000]
    },
    black: {
      crops: ['कपास (Cotton)', 'गन्ना (Sugarcane)', 'मिर्च (Chilli)'],
      reasons: ['Black soil is excellent for cotton', 'Rich in nutrients, good for cash crops'],
      profitEstimate: [35000, 38000, 28000]
    },
    red: {
      crops: ['मूंगफली (Peanuts)', 'तिल (Sesame)', 'ज्वार (Sorghum)'],
      reasons: ['Red soil needs well-draining crops', 'Good for pulses and oilseeds'],
      profitEstimate: [21000, 19000, 17000]
    }
  },
  rabi: {
    clay: {
      crops: ['गेहूँ (Wheat)', 'सरसों (Mustard)', 'चना (Chickpea)'],
      reasons: ['Winter crops thrive in clay soil', 'Good moisture retention for winter'],
      profitEstimate: [28000, 25000, 24000]
    },
    loamy: {
      crops: ['गेहूँ (Wheat)', 'मसूर (Lentil)', 'सरसों (Mustard)'],
      reasons: ['Loamy soil is ideal for winter crops', 'Perfect drainage and fertility'],
      profitEstimate: [32000, 27000, 26000]
    },
    sandy: {
      crops: ['मटर (Peas)', 'जई (Barley)', 'सरसों (Mustard)'],
      reasons: ['Light crops suitable for sandy soil', 'Needs irrigation management'],
      profitEstimate: [22000, 20000, 23000]
    },
    black: {
      crops: ['गेहूँ (Wheat)', 'चना (Chickpea)', 'मसूर (Lentil)'],
      reasons: ['Black soil excellent for winter crops', 'High nutrient content'],
      profitEstimate: [34000, 29000, 28000]
    },
    red: {
      crops: ['मसूर (Lentil)', 'सरसों (Mustard)', 'मटर (Peas)'],
      reasons: ['Red soil needs careful crop selection', 'Good for pulses'],
      profitEstimate: [25000, 24000, 23000]
    }
  },
  zaid: {
    clay: {
      crops: ['खीरा (Cucumber)', 'तरबूज (Watermelon)', 'भिंडी (Okra)'],
      reasons: ['Summer vegetables thrive in moisture', 'Clay retains water well'],
      profitEstimate: [35000, 38000, 30000]
    },
    loamy: {
      crops: ['खीरा (Cucumber)', 'तरबूज (Watermelon)', 'तोरई (Bottle Gourd)'],
      reasons: ['Perfect for summer vegetable cultivation', 'Ideal water-nutrient balance'],
      profitEstimate: [38000, 40000, 35000]
    },
    sandy: {
      crops: ['तरबूज (Watermelon)', 'खरबूजा (Melon)', 'भिंडी (Okra)'],
      reasons: ['Drought-resistant summer crops', 'Good for well-irrigated fields'],
      profitEstimate: [32000, 35000, 28000]
    },
    black: {
      crops: ['खीरा (Cucumber)', 'तरबूज (Watermelon)', 'बैंगन (Brinjal)'],
      reasons: ['Rich soil supports vegetable growth', 'Excellent yields'],
      profitEstimate: [40000, 42000, 36000]
    },
    red: {
      crops: ['तरबूज (Watermelon)', 'खरबूजा (Melon)', 'लौकी (Bottle Gourd)'],
      reasons: ['Summer vegetables suitable for red soil', 'Needs good irrigation'],
      profitEstimate: [34000, 36000, 31000]
    }
  }
};

const getRecommendations = (soilType, season, landSize) => {
  try {
    const data = cropDatabase[season]?.[soilType];
    
    if (!data) {
      return {
        success: false,
        message: 'Invalid soil type or season provided'
      };
    }

    const recommendations = data.crops.map((crop, index) => ({
      rank: index + 1,
      cropName: crop,
      reason: data.reasons[index],
      expectedProfit: data.profitEstimate[index],
      expectedProfitTotal: Math.round(data.profitEstimate[index] * (landSize / 1)), // Per hectare calculation
      soilSuitability: 'High',
      waterRequirement: ['High', 'Medium', 'Low'][index],
      estimatedYield: `${20 + index * 5} क्विंटल/हेक्टेयर`,
      tips: {
        hindi: getTipsInHindi(crop, season, soilType),
        english: getTipsInEnglish(crop, season, soilType)
      }
    }));

    return {
      success: true,
      season,
      soilType,
      landSize,
      recommendations,
      generalAdvice: getGeneralAdvice(season, soilType)
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error generating recommendations',
      error: error.message
    };
  }
};

const getTipsInHindi = (crop, season, soilType) => {
  const tips = {
    'धान (Rice)': 'बीज दर 40 किग्रा/हेक्टेयर रखें। समय पर रोपाई करें। नीचे की सड़ाई से बचाव करें।',
    'गेहूँ (Wheat)': 'अक्टूबर-नवंबर में बुवाई करें। 120 किग्रा नाइट्रोजन प्रति हेक्टेयर दें। सिंचाई समय पर करें।',
    'कपास (Cotton)': 'बीज उपचार अवश्य करें। कीट नियंत्रण के लिए सावधान रहें। समय पर निराई करें।',
    'मूंगफली (Peanut)': 'अच्छी जल निकासी वाली मिट्टी चुनें। 40 किग्रा नाइट्रोजन और 60 किग्रा फॉस्फोरस दें।',
    'सरसों (Mustard)': 'अक्टूबर में बुवाई करें। 40 किग्रा नाइट्रोजन प्रति हेक्टेयर दें। पानी की बचत करें।',
    'चना (Chickpea)': 'नवंबर में बुवाई करें। सड़ाई से बचाव करें। पानी की व्यवस्था ठीक रखें।',
    'खीरा (Cucumber)': 'गर्मियों में बुवाई करें। 30 टन गोबर की खाद प्रति हेक्टेयर दें। नियमित सिंचाई करें।',
    'तरबूज (Watermelon)': 'फरवरी-मार्च में बुवाई करें। अच्छी जल निकासी जरूरी है। रस्सी से सहारा दें।'
  };
  return tips[crop] || 'समय पर खाद और पानी दें।';
};

const getTipsInEnglish = (crop, season, soilType) => {
  const tips = {
    'धान (Rice)': 'Maintain seed rate of 40 kg/ha. Transplant on time. Protect from root rot. Use certified seeds.',
    'गेहूँ (Wheat)': 'Sow in October-November. Apply 120 kg nitrogen/ha. Irrigate timely. Manage pest attacks.',
    'कपास (Cotton)': 'Treat seeds before sowing. Monitor pest attacks closely. Weed regularly. Use IPM practices.',
    'मूंगफली (Peanut)': 'Choose well-drained soil. Apply 40 kg N and 60 kg P per ha. Water carefully.',
    'सरसों (Mustard)': 'Sow in October. Apply 40 kg N per ha. Save water. Monitor for diseases.',
    'चना (Chickpea)': 'Sow in November. Protect from root rot. Maintain proper irrigation. Avoid waterlogging.',
    'खीरा (Cucumber)': 'Sow in summer. Apply 30 tons cow dung/ha. Water regularly. Support with sticks.',
    'तरबूज (Watermelon)': 'Sow in Feb-March. Ensure good drainage. Stake plants. Water moderately.'
  };
  return tips[crop] || 'Apply fertilizer and water on time. Monitor plant health.';
};

const getGeneralAdvice = (season, soilType) => {
  const adviceMap = {
    kharif: {
      hindi: 'खरीफ में अच्छी वर्षा का उपयोग करें। खरपतवार नियंत्रण करें। धान के पत्तियों को रोग से बचाएं।',
      english: 'Utilize good monsoon rains. Control weeds properly. Monitor for leaf diseases. Ensure timely harvesting.'
    },
    rabi: {
      hindi: 'रबी मौसम में सर्दी का सही उपयोग करें। सिंचाई की व्यवस्था ठीक रखें। समय पर बीज बोएं।',
      english: 'Utilize cool season conditions. Manage irrigation carefully. Sow on time. Harvesting before rain.'
    },
    zaid: {
      hindi: 'गर्मी में पानी की व्यवस्था सबसे महत्वपूर्ण है। ड्रिप सिंचाई का उपयोग करें। छाया वाली जगह चुनें।',
      english: 'Water management is crucial in summer. Use drip irrigation. Choose partial shade areas. Harvest regularly.'
    }
  };

  return adviceMap[season] || {
    hindi: 'मिट्टी की जांच करें। समय पर खाद दें। पानी की बचत करें।',
    english: 'Check soil health. Apply fertilizer on schedule. Save water.'
  };
};

module.exports = {
  getRecommendations,
  cropDatabase
};
