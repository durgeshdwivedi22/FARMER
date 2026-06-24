const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get weather data from OpenWeather API or mock data
router.get('/', async (req, res) => {
  try {
    const { location = 'Delhi' } = req.query;
    
    // Try to use OpenWeatherMap API if key is available
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (API_KEY && API_KEY !== 'YOUR_API_KEY') {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
        const response = await axios.get(url);
        const weather = response.data;

        const advice = generateFarmingAdvice(weather);

        return res.json({
          success: true,
          source: 'openweather',
          data: {
            location: weather.name,
            temperature: weather.main.temp,
            humidity: weather.main.humidity,
            description: weather.weather[0].description,
            windSpeed: weather.wind.speed,
            rainChance: weather.clouds?.all || 0,
            pressure: weather.main.pressure,
            advice
          }
        });
      } catch (apiError) {
        console.log('OpenWeather API failed, using mock data:', apiError.message);
      }
    }

    // Return mock data
    const mockData = getMockWeatherData(location);
    res.json({
      success: true,
      source: 'mock',
      data: mockData
    });

  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'मौसम डेटा प्राप्त नहीं कर सके (Unable to fetch weather)',
      data: getMockWeatherData('Unknown')
    });
  }
});

// Get detailed insights for specific location
router.get('/insights/:location', async (req, res) => {
  try {
    const { location } = req.params;
    const weatherData = getMockWeatherData(location);
    
    const insights = {
      location: weatherData.location,
      temperature: weatherData.temperature,
      farmingAdvice: weatherData.advice,
      cropSuitability: getCropSuitabilityForWeather(weatherData),
      waterRequirement: calculateWaterRequirement(weatherData),
      pestRiskLevel: calculatePestRisk(weatherData)
    };

    res.json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error('Weather insights error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'सर्वर त्रुटि (Server error)' 
    });
  }
});

// Mock weather data for testing
function getMockWeatherData(location) {
  const temp = 20 + Math.random() * 15; // 20-35°C
  const humidity = 40 + Math.random() * 50; // 40-90%
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];

  const weatherData = {
    location: location,
    temperature: Math.round(temp * 10) / 10,
    humidity: Math.round(humidity),
    description: condition.toLowerCase(),
    windSpeed: Math.round(Math.random() * 20 * 10) / 10,
    rainChance: Math.floor(Math.random() * 100),
    pressure: 1013,
    lastUpdated: new Date().toISOString()
  };

  weatherData.advice = generateFarmingAdvice({
    main: { temp: weatherData.temperature, humidity: weatherData.humidity, pressure: weatherData.pressure },
    weather: [{ description: weatherData.description }],
    wind: { speed: weatherData.windSpeed }
  });

  return weatherData;
}

// Generate farming advice based on weather
function generateFarmingAdvice(weather) {
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const description = (weather.weather[0]?.description || '').toLowerCase();

  const advice = {
    irrigation: '',
    pesticide: '',
    harvesting: '',
    sowing: '',
    fertilizer: '',
    generalTips: []
  };

  // Temperature-based advice
  if (temp > 35) {
    advice.irrigation = 'तापमान बहुत अधिक है, शाम को सिंचाई करें (High temp - water in evening)';
    advice.pesticide = 'गर्मी में कीटनाशक छिड़कने का अच्छा समय है (Good for pesticide spray)';
    advice.generalTips.push('अतिरिक्त छाया प्रदान करें (Provide shade)');
  } else if (temp < 10) {
    advice.irrigation = 'ठंड में कम सिंचाई करें (Reduce watering in cold)';
    advice.sowing = 'ठंड में नई फसल बोने से बचें (Avoid new sowing)';
    advice.generalTips.push('पौधों को ठंड से बचाएं (Protect from frost)');
  } else if (temp >= 20 && temp <= 30) {
    advice.irrigation = 'आदर्श तापमान, नियमित सिंचाई करें (Ideal - regular watering)';
    advice.sowing = 'बीज बोने का अच्छा समय (Good for sowing)';
    advice.pesticide = 'कीटनाशक छिड़कने का अच्छा दिन है (Good for pesticide)';
  } else {
    advice.irrigation = 'मौसम के अनुसार सिंचाई करें (Water as needed)';
  }

  // Humidity-based advice
  if (humidity > 80) {
    advice.pesticide = 'उच्च नमी में फंगी रोग की संभावना है (Risk of fungal disease)';
    advice.fertilizer = 'उच्च नमी में उर्वरक कम दें (Reduce fertilizer)';
    advice.generalTips.push('पत्तियों पर कवक नियंत्रण करें (Manage fungal issues)');
  } else if (humidity < 30) {
    advice.irrigation = 'कम नमी के कारण अधिक सिंचाई करें (Low humidity - more water)';
    advice.generalTips.push('अधिक पानी दें (Increase irrigation)');
  }

  // Weather condition advice
  if (description.includes('rain') || description.includes('बारिश')) {
    advice.irrigation = 'बारिश के कारण सिंचाई की आवश्यकता नहीं (No need to water)';
    advice.fertilizer = 'बारिश से पहले कोई काम न करें (Wait for rain to subside)';
    advice.generalTips.push('जल निकासी की व्यवस्था करें (Ensure drainage)');
  } else if (description.includes('sunny') || description.includes('धूप')) {
    advice.harvesting = 'धूप वाले दिन में फसल काटें (Good for harvesting)';
    advice.sowing = 'धूप वाले दिन में बीज बोएं (Good for sowing)';
    advice.fertilizer = 'उर्वरक लगाने का अच्छा समय (Good for fertilizing)';
  } else if (description.includes('cloud') || description.includes('बादल')) {
    advice.pesticide = 'बादलों के दिन कीटनाशक छिड़कें (Good for pesticide)';
  }

  return advice;
}

// Calculate water requirement based on weather
function calculateWaterRequirement(weatherData) {
  const temp = weatherData.temperature;
  const humidity = weatherData.humidity;
  
  let requirement = 'मध्यम (Medium)';
  let amount = '25-30';

  if (temp > 35 || humidity < 40) {
    requirement = 'अधिक (High)';
    amount = '40-50';
  } else if (temp < 15 && humidity > 70) {
    requirement = 'कम (Low)';
    amount = '10-15';
  }

  return {
    level: requirement,
    estimatedMM: amount,
    advice: `${amount}mm पानी दें (Water requirement)`
  };
}

// Get pest risk level
function calculatePestRisk(weatherData) {
  const temp = weatherData.temperature;
  const humidity = weatherData.humidity;

  let risk = 'कम (Low)';
  if ((temp > 20 && temp < 30) && (humidity > 60)) {
    risk = 'अधिक (High)';
  } else if ((temp > 30 || temp < 15) || (humidity < 40 || humidity > 85)) {
    risk = 'मध्यम (Medium)';
  }

  return {
    level: risk,
    recommendation: risk === 'अधिक (High)' ? 'कीटनाशक छिड़कने की सलाह दी जाती है' : 'निरीक्षण जारी रखें'
  };
}

// Get crop suitability for current weather
function getCropSuitabilityForWeather(weatherData) {
  const temp = weatherData.temperature;
  
  const suitableCrops = [];
  
  if (temp > 25) {
    suitableCrops.push('गर्मी सहन करने वाली फसलें');
  }
  if (temp < 20) {
    suitableCrops.push('ठंड सहन करने वाली फसलें');
  }
  if (weatherData.humidity > 70) {
    suitableCrops.push('नमी को सहन करने वाली फसलें');
  }

  return {
    suitable: suitableCrops.length > 0 ? suitableCrops : ['सभी फसलें उपयुक्त हैं'],
    temperature: `${Math.round(temp)}°C`,
    humidity: `${weatherData.humidity}%`
  };
}

module.exports = router;
