import React, { useState, useEffect } from 'react';
import { PageContainer, PageTitle, GridLayout } from '../components/Layout';
import { Card, LargeButton, InputField, SelectField, LoadingSpinner, Alert } from '../components/ui';
import { cropAPI } from '../services/api';
import { useTranslation } from '../utils/translation';

const Crops = ({ farmer, language }) => {
  const [crops, setCrops] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation(language);

  const [formData, setFormData] = useState({
    name: '',
    season: '',
    soilType: '',
    area: farmer?.landSize || '',
    expectedYield: '',
    sowingDate: new Date().toISOString().split('T')[0]
  });

  const [recommendationParams, setRecommendationParams] = useState({
    soilType: '',
    season: '',
    landSize: farmer?.landSize || ''
  });

  useEffect(() => {
    fetchCrops();
  }, []);

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const response = await cropAPI.getAll();
      setCrops(response.data || []);
    } catch (err) {
      setError('फसलें लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendations = async () => {
    if (!recommendationParams.soilType || !recommendationParams.season) {
      setError('मिट्टी का प्रकार और मौसम चुनें');
      return;
    }

    try {
      setLoading(true);
      const response = await cropAPI.getRecommendations(
        recommendationParams.soilType,
        recommendationParams.season,
        recommendationParams.landSize
      );
      setRecommendations(response.data);
      setShowRecommendations(true);
    } catch (err) {
      setError('सिफारिशें लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.season || !formData.soilType) {
      setError('सभी आवश्यक फील्ड भरें');
      return;
    }

    try {
      const response = await cropAPI.create({
        ...formData,
        area: parseFloat(formData.area),
        expectedYield: formData.expectedYield ? parseFloat(formData.expectedYield) : undefined,
        sowingDate: new Date(formData.sowingDate)
      });

      if (response.success) {
        setSuccess('✓ फसल जोड़ी गई!');
        setFormData({
          name: '',
          season: '',
          soilType: '',
          area: farmer?.landSize || '',
          expectedYield: '',
          sowingDate: new Date().toISOString().split('T')[0]
        });
        setTimeout(() => {
          setShowForm(false);
          fetchCrops();
          setSuccess('');
        }, 1000);
      }
    } catch (err) {
      setError('फसल जोड़ने में त्रुटि');
    }
  };

  if (loading) return <LoadingSpinner message="फसलें लोड हो रहीं हैं..." />;

  const seasons = [
    { value: 'kharif', label: 'खरीफ (गर्मी)' },
    { value: 'rabi', label: 'रबी (सर्दी)' },
    { value: 'zaid', label: 'जायद (बसंत)' }
  ];

  const soilTypes = [
    { value: 'clay', label: 'दोमट (Clay)' },
    { value: 'loamy', label: 'दोमट दोमट (Loamy)' },
    { value: 'sandy', label: 'बलुई (Sandy)' },
    { value: 'black', label: 'काली (Black)' },
    { value: 'red', label: 'लाल (Red)' }
  ];

  return (
    <PageContainer>
      <PageTitle 
        icon="🌾" 
        title="फसल प्रबंधन" 
        subtitle="अपनी फसलों को ट्रैक करें और सिफारिशें लें"
      />

      {success && <Alert type="success" message={success} />}
      {error && <Alert type="error" message={error} />}

      {/* Main Buttons */}
      {!showForm && !showRecommendations && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <LargeButton variant="primary" size="lg" onClick={() => setShowForm(true)}>
            ➕ फसल जोड़ें
          </LargeButton>
          <LargeButton variant="secondary" size="lg" onClick={() => setShowRecommendations(true)}>
            💡 सिफारिशें लें
          </LargeButton>
        </div>
      )}

      {/* Recommendations Section */}
      {showRecommendations && (
        <Card className="mb-8" title="फसल की सिफारिशें">
          {!recommendations ? (
            <div className="space-y-4">
              <SelectField
                label="मिट्टी का प्रकार"
                value={recommendationParams.soilType}
                onChange={(e) => setRecommendationParams({ ...recommendationParams, soilType: e.target.value })}
                options={soilTypes}
                required
              />

              <SelectField
                label="मौसम"
                value={recommendationParams.season}
                onChange={(e) => setRecommendationParams({ ...recommendationParams, season: e.target.value })}
                options={seasons}
                required
              />

              <InputField
                label="ज़मीन का आकार (एकड़)"
                type="number"
                value={recommendationParams.landSize}
                onChange={(e) => setRecommendationParams({ ...recommendationParams, landSize: e.target.value })}
              />

              <div className="flex gap-4">
                <LargeButton variant="success" onClick={handleRecommendations}>
                  सिफारिशें देखें
                </LargeButton>
                <LargeButton variant="secondary" onClick={() => setShowRecommendations(false)}>
                  रद्द करें
                </LargeButton>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold mb-4">📊 आपके लिए सर्वश्रेष्ठ फसलें</h3>
              <div className="space-y-4">
                {recommendations.recommendations?.map((crop, idx) => (
                  <Card key={idx} className="bg-green-50">
                    <div>
                      <p className="text-lg font-bold">#{crop.rank} {crop.cropName}</p>
                      <p className="text-gray-700 mt-2">{crop.reason}</p>
                      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                        <div>
                          <p className="text-gray-600">अपेक्षित पैदावार</p>
                          <p className="font-bold">{crop.estimatedYield}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">अनुमानित लाभ</p>
                          <p className="font-bold">₹{crop.expectedProfit.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                        <p className="font-semibold mb-1">💡 सुझाव:</p>
                        <p>{crop.tips[language === 'hindi' ? 'hindi' : 'english']}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <LargeButton 
                variant="secondary" 
                className="mt-4"
                onClick={() => {
                  setRecommendations(null);
                  setShowRecommendations(false);
                }}
              >
                वापस जाएं
              </LargeButton>
            </div>
          )}
        </Card>
      )}

      {/* Add Crop Form */}
      {showForm && (
        <Card className="mb-8" title="नई फसल जोड़ें">
          <form onSubmit={handleAddCrop} className="space-y-4">
            <InputField
              label="फसल का नाम"
              placeholder="जैसे: गेहूं, चावल, कपास"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <SelectField
              label="मौसम"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              options={seasons}
              required
            />

            <SelectField
              label="मिट्टी का प्रकार"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              options={soilTypes}
              required
            />

            <InputField
              label="क्षेत्र (एकड़)"
              type="number"
              placeholder="एकड़ में"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
            />

            <InputField
              label="अपेक्षित पैदावार (क्विंटल)"
              type="number"
              placeholder="क्विंटल में"
              value={formData.expectedYield}
              onChange={(e) => setFormData({ ...formData, expectedYield: e.target.value })}
            />

            <InputField
              label="बीज बोने की तारीख"
              type="date"
              value={formData.sowingDate}
              onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
              required
            />

            <div className="flex gap-4">
              <LargeButton type="submit" variant="success">
                फासल जोड़ें
              </LargeButton>
              <LargeButton type="button" variant="secondary" onClick={() => setShowForm(false)}>
                रद्द करें
              </LargeButton>
            </div>
          </form>
        </Card>
      )}

      {/* Crops List */}
      {!showForm && !showRecommendations && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📋 मेरी फसलें</h2>
          {crops.length > 0 ? (
            <GridLayout cols={2}>
              {crops.map(crop => (
                <Card key={crop._id} className="bg-gradient-to-br from-green-50 to-yellow-50">
                  <p className="text-2xl font-bold text-green-700">{crop.name}</p>
                  <div className="mt-4 space-y-2 text-gray-700">
                    <p><strong>मौसम:</strong> {crop.season}</p>
                    <p><strong>मिट्टी:</strong> {crop.soilType}</p>
                    <p><strong>क्षेत्र:</strong> {crop.area} एकड़</p>
                    <p><strong>स्थिति:</strong> {crop.status}</p>
                    <p className="text-sm text-gray-500">
                      बोई गई: {new Date(crop.sowingDate).toLocaleDateString('hi-IN')}
                    </p>
                  </div>
                </Card>
              ))}
            </GridLayout>
          ) : (
            <Card>
              <p className="text-center text-gray-600 text-lg">कोई फसल नहीं</p>
            </Card>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default Crops;
