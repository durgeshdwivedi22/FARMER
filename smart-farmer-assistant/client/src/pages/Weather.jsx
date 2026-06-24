import React, { useState, useEffect } from 'react';
import { PageContainer, PageTitle } from '../components/Layout';
import { Card, InputField, LargeButton, LoadingSpinner } from '../components/ui';
import { weatherAPI } from '../services/api';

const Weather = ({ farmer, language }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(farmer?.district || 'Delhi');

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const fetchWeather = async (loc) => {
    try {
      setLoading(true);
      const response = await weatherAPI.get(loc);
      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      fetchWeather(location);
    }
  };

  if (loading) return <LoadingSpinner message="मौसम की जानकारी लोड हो रही है..." />;

  return (
    <PageContainer>
      <PageTitle icon="🌤️" title="मौसम" subtitle="आपके क्षेत्र के लिए मौसम पूर्वानुमान" />

      {/* Location Input */}
      <Card className="mb-8" title="स्थान बदलें">
        <form onSubmit={handleLocationSubmit} className="flex gap-3">
          <InputField
            placeholder="जिला या शहर का नाम दर्ज करें"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mb-0"
          />
          <LargeButton type="submit" variant="primary" className="h-auto py-3">
            खोजें
          </LargeButton>
        </form>
      </Card>

      {weather && (
        <>
          {/* Current Weather */}
          <Card className="mb-8 bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-center mb-6">
              <p className="text-4xl mb-4">
                {weather.description?.toLowerCase().includes('sunny') ? '☀️' :
                 weather.description?.toLowerCase().includes('cloud') ? '☁️' :
                 weather.description?.toLowerCase().includes('rain') ? '🌧️' : '🌤️'}
              </p>
              <p className="text-2xl font-bold text-gray-800">{weather.location}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="text-center border-l-4 border-blue-600">
                <p className="text-gray-600">तापमान</p>
                <p className="text-3xl font-bold text-blue-600">{Math.round(weather.temperature)}°C</p>
              </Card>
              <Card className="text-center border-l-4 border-cyan-600">
                <p className="text-gray-600">नमी</p>
                <p className="text-3xl font-bold text-cyan-600">{weather.humidity}%</p>
              </Card>
              <Card className="text-center border-l-4 border-green-600">
                <p className="text-gray-600">हवा की गति</p>
                <p className="text-3xl font-bold text-green-600">{weather.windSpeed} m/s</p>
              </Card>
              <Card className="text-center border-l-4 border-yellow-600">
                <p className="text-gray-600">स्थिति</p>
                <p className="text-lg font-bold text-yellow-600 capitalize">{weather.description}</p>
              </Card>
            </div>

            {/* Weather Condition */}
            <div className="p-4 bg-white rounded-lg border-l-4 border-purple-600">
              <p className="text-lg font-bold text-gray-800 mb-3">📋 मौसम की स्थिति:</p>
              <p className="text-gray-700">{weather.description}</p>
            </div>
          </Card>

          {/* Farming Advice */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 कृषि सुझाव</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weather.advice && Object.entries(weather.advice).map(([key, value]) => {
                if (typeof value !== 'string') return null;
                
                const icons = {
                  irrigation: '💧',
                  pesticide: '🐛',
                  harvesting: '🌾',
                  sowing: '🌱',
                  fertilizer: '🥕',
                  generalTips: '📋'
                };

                return (
                  <Card key={key} className="bg-green-50 border-l-4 border-green-600">
                    <p className="font-bold text-lg mb-2">
                      <span className="text-2xl mr-2">{icons[key] || '💡'}</span>
                      {key === 'irrigation' && 'सिंचाई'}
                      {key === 'pesticide' && 'कीटनाशक'}
                      {key === 'harvesting' && 'कटाई'}
                      {key === 'sowing' && 'बीज बोना'}
                      {key === 'fertilizer' && 'खाद'}
                    </p>
                    <p className="text-gray-700 text-lg">{value}</p>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Water Requirement Alert */}
          <Card className="mt-8 bg-blue-50 border-l-4 border-blue-600">
            <p className="font-bold text-lg mb-2">💧 पानी की आवश्यकता</p>
            <div className="space-y-2">
              <p className="text-gray-700">
                {weather.humidity > 75 ?
                  '🟢 आज पानी की कम आवश्यकता है' :
                  weather.humidity < 40 ?
                  '🔴 आज अधिक पानी की आवश्यकता है' :
                  '🟡 आज सामान्य पानी की आवश्यकता है'}
              </p>
            </div>
          </Card>
        </>
      )}
    </PageContainer>
  );
};

export default Weather;
