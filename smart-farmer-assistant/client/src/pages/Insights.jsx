import React, { useState, useEffect } from 'react';
import { PageContainer, PageTitle } from '../components/Layout';
import { Card, LoadingSpinner, Alert } from '../components/ui';
import { insightsAPI } from '../services/api';
import { useTranslation } from '../utils/translation';

const Insights = ({ language }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation(language);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await insightsAPI.getAll();
      setInsights(response.data);
    } catch (err) {
      setError('सुझाव लोड करने में त्रुटि');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="सुझाव तैयार हो रहे हैं..." />;

  return (
    <PageContainer>
      <PageTitle 
        icon="💡" 
        title="स्मार्ट सुझाव" 
        subtitle="आपकी कृषि के लिए व्यक्तिगत सिफारिशें"
      />

      {error && <Alert type="error" message={error} />}

      {insights && (
        <>
          {/* Summary Cards */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 आपका आर्थिक सारांश</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="text-center bg-blue-50 border-l-4 border-blue-600">
                <p className="text-gray-600">कुल निवेश</p>
                <p className="text-3xl font-bold text-blue-700">
                  ₹{insights.summary?.totalInvestment?.toLocaleString('en-IN') || 0}
                </p>
              </Card>
              <Card className="text-center bg-green-50 border-l-4 border-green-600">
                <p className="text-gray-600">शुद्ध लाभ</p>
                <p className="text-3xl font-bold text-green-700">
                  ₹{insights.summary?.netProfit?.toLocaleString('en-IN') || 0}
                </p>
              </Card>
              <Card className="text-center bg-yellow-50 border-l-4 border-yellow-600">
                <p className="text-gray-600">लाभ अनुपात (ROI)</p>
                <p className="text-3xl font-bold text-yellow-700">
                  {insights.summary?.roi || 0}%
                </p>
              </Card>
            </div>
          </div>

          {/* Farm Health Score */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏥 आपके खेत की सेहत</h2>
            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-800 mb-3">
                    खेत की सेहत स्कोर
                  </p>
                  <div className="w-full bg-gray-300 rounded-full h-8">
                    <div
                      style={{
                        width: `${insights.summary?.farmHealth || 0}%`
                      }}
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-8 rounded-full flex items-center justify-center text-white font-bold"
                    >
                      {insights.summary?.farmHealth || 0}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {insights.summary?.farmHealth > 75
                      ? '✓ बहुत अच्छा! आप सही रास्ते पर हैं'
                      : insights.summary?.farmHealth > 50
                      ? '👍 अच्छा! थोड़ी सुधार की गुंजाइश है'
                      : '⚠️ कुछ सुधार की आवश्यकता है'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Individual Insights */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              📌 आपके लिए सुझाव ({insights.insights?.length || 0})
            </h2>

            <div className="space-y-4">
              {insights.insights && insights.insights.length > 0 ? (
                insights.insights.map((insight, idx) => (
                  <Card
                    key={idx}
                    className={`
                      ${insight.type === 'positive' ? 'bg-green-50 border-green-600' :
                        insight.type === 'warning' ? 'bg-yellow-50 border-yellow-600' :
                        insight.type === 'error' ? 'bg-red-50 border-red-600' :
                        'bg-blue-50 border-blue-600'} 
                      border-l-4
                    `}
                  >
                    <div className="flex items-start">
                      <span className="text-4xl mr-4">{insight.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-lg">{insight.title}</p>
                          <span className={`
                            px-3 py-1 rounded-full text-sm font-bold
                            ${insight.priority === 'high' ? 'bg-red-200 text-red-800' :
                              insight.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-gray-200 text-gray-800'}
                          `}>
                            {insight.priority === 'high' ? 'तुरंत' :
                             insight.priority === 'medium' ? 'महत्वपूर्ण' :
                             'सूचना'}
                          </span>
                        </div>
                        <p className="text-gray-700 mt-2">{insight.message}</p>
                        {insight.englishMessage && (
                          <p className="text-sm text-gray-500 mt-1 italic">
                            {insight.englishMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card>
                  <p className="text-center text-gray-600 text-lg">
                    कोई विशेष सुझाव नहीं। आप बहुत अच्छे हैं!
                  </p>
                </Card>
              )}
            </div>
          </div>

          {/* Action Items */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">✓ कार्य सूची</h2>
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="space-y-3">
                {insights.insights?.some(i => i.action === 'review_expenses') && (
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📋</span>
                    <span>अपने सभी खर्चों की विस्तार से जांच करें</span>
                  </div>
                )}
                {insights.insights?.some(i => i.action === 'optimize_costs') && (
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎯</span>
                    <span>अनावश्यक खर्चों को कम करने की कोशिश करें</span>
                  </div>
                )}
                {insights.insights?.some(i => i.action === 'test_soil') && (
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔬</span>
                    <span>अपनी मिट्टी का परीक्षण करवाएं</span>
                  </div>
                )}
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🌾</span>
                  <span>अगली फसल के लिए सिफारिशें लें</span>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-3">📊</span>
                  <span>नियमित रूप से अपने डेटा को अपडेट रखें</span>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default Insights;
