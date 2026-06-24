import React, { useState, useEffect } from 'react'
import { PageContainer, PageTitle, GridLayout } from '../components/Layout'
import { Card, InfoCard, TransactionItem, LoadingSpinner } from '../components/ui'
import { useTranslation } from '../utils/translation'

const Dashboard = ({ farmer, language }) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [recentExpenses, setRecentExpenses] = useState([])
  const [insights, setInsights] = useState([])
  const { t } = useTranslation(language)

  useEffect(() => {
    // Mock data for demonstration
    setTimeout(() => {
      setData({
        financial: {
          totalInvestment: 45000,
          totalProfit: 68000,
          totalLoss: 12000,
          netProfit: 56000,
          roi: 124
        },
        statistics: {
          totalExpenses: 23,
          totalCrops: 5,
          activeCrops: 2
        }
      })

      setRecentExpenses([
        {
          _id: '1',
          description: 'गेहूँ के बीज खरीदे',
          amount: 5000,
          date: new Date('2024-03-15'),
          type: 'investment',
          category: 'seeds'
        },
        {
          _id: '2',
          description: 'गेहूँ की फसल बेची',
          amount: 12000,
          date: new Date('2024-03-10'),
          type: 'profit',
          category: 'harvest'
        },
        {
          _id: '3',
          description: 'खाद खरीदा',
          amount: 3500,
          date: new Date('2024-03-08'),
          type: 'investment',
          category: 'fertilizer'
        }
      ])

      setInsights([
        {
          type: 'positive',
          icon: '📈',
          title: 'अच्छा प्रदर्शन',
          message: 'इस महीने आपका मुनाफा 25% बढ़ गया है। गेहूँ की फसल अच्छी है।'
        },
        {
          type: 'warning',
          icon: '⚠️',
          title: 'खर्चा ध्यान',
          message: 'खाद पर खर्चा बढ़ रहा है। कम लागत वाला विकल्प देखें।'
        },
        {
          type: 'positive',
          icon: '🌱',
          title: 'फसल सलाह',
          message: 'अगले महीने मूंगफली बोने के लिए अच्छा समय है।'
        }
      ])

      setLoading(false)
    }, 1000)
  }, [])

  if (loading) return <LoadingSpinner message="डैशबोर्ड लोड हो रहा है..." />

  return (
    <PageContainer>
      <PageTitle
        icon="📊"
        title={`स्वागत है, ${farmer?.name || 'किसान'}!`}
        subtitle={`${farmer?.village || 'गांव'}, ${farmer?.state || 'राज्य'}`}
      />

      {/* Financial Summary */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💰</span>
          आर्थिक सारांश
        </h2>
        <GridLayout cols={2}>
          <InfoCard
            icon="📉"
            title="कुल निवेश"
            value={`₹${data?.financial.totalInvestment.toLocaleString('en-IN') || 0}`}
            subtitle="सभी खर्च"
            color="blue"
            className="transform hover:scale-105 transition-transform"
          />
          <InfoCard
            icon="📈"
            title="कुल लाभ"
            value={`₹${data?.financial.totalProfit.toLocaleString('en-IN') || 0}`}
            subtitle="आय"
            color="green"
            className="transform hover:scale-105 transition-transform"
          />
          <InfoCard
            icon="⚠️"
            title="कुल नुकसान"
            value={`₹${data?.financial.totalLoss.toLocaleString('en-IN') || 0}`}
            subtitle="घाटा"
            color="red"
            className="transform hover:scale-105 transition-transform"
          />
          <InfoCard
            icon="💎"
            title="शुद्ध लाभ"
            value={`₹${data?.financial.netProfit.toLocaleString('en-IN') || 0}`}
            subtitle={`ROI: ${data?.financial.roi || 0}%`}
            color={data?.financial.netProfit >= 0 ? 'green' : 'red'}
            className="transform hover:scale-105 transition-transform"
          />
        </GridLayout>
      </div>

      {/* Statistics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">📈</span>
          आंकड़े
        </h2>
        <GridLayout cols={3}>
          <InfoCard
            icon="📋"
            title="कुल लेनदेन"
            value={data?.statistics.totalExpenses || 0}
            subtitle="खर्चों की संख्या"
            color="blue"
            className="transform hover:scale-105 transition-transform"
          />
          <InfoCard
            icon="🌾"
            title="सभी फसलें"
            value={data?.statistics.totalCrops || 0}
            subtitle="पिछली फसलें"
            color="green"
            className="transform hover:scale-105 transition-transform"
          />
          <InfoCard
            icon="🌱"
            title="सक्रिय फसलें"
            value={data?.statistics.activeCrops || 0}
            subtitle="वर्तमान में बोई हुई"
            color="yellow"
            className="transform hover:scale-105 transition-transform"
          />
        </GridLayout>
      </div>

      {/* Smart Insights */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">💡</span>
          स्मार्ट सुझाव
        </h2>
        <div className="space-y-3">
          {insights.slice(0, 3).map((insight, idx) => (
            <Card
              key={idx}
              className={`
                transform hover:scale-102 transition-all duration-300 shadow-farmer
                ${insight.type === 'positive' ? 'border-green-600 bg-gradient-to-r from-green-50 to-emerald-50' : 
                  insight.type === 'warning' ? 'border-yellow-600 bg-gradient-to-r from-yellow-50 to-amber-50' : 
                  insight.type === 'error' ? 'border-red-600 bg-gradient-to-r from-red-50 to-pink-50' : 
                  'border-blue-600 bg-gradient-to-r from-blue-50 to-indigo-50'}
              `}
            >
              <div className="flex items-start">
                <span className="text-3xl mr-4 animate-pulse-slow">{insight.icon}</span>
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-800">{insight.title}</p>
                  <p className="text-gray-700 mt-1">{insight.message}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🕐</span>
          हाल के लेनदेन
        </h2>
        {recentExpenses.length > 0 ? (
          <div className="space-y-2">
            {recentExpenses.map(expense => (
              <TransactionItem
                key={expense._id}
                name={expense.description}
                amount={expense.amount}
                date={new Date(expense.date).toLocaleDateString('hi-IN')}
                type={expense.type}
                category={expense.category}
                className="transform hover:scale-102 transition-all duration-300"
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-600 text-lg">कोई लेनदेन नहीं</p>
            <p className="text-gray-500 text-sm mt-2">अपना पहला खर्चा जोड़ने के लिए खर्चा ट्रैकर पर जाएं</p>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🚀</span>
          त्वरित कार्य
        </h2>
        <GridLayout cols={2}>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">🎤</div>
              <h3 className="font-bold text-lg">आवाज़ से खर्चा जोड़ें</h3>
              <p className="text-sm opacity-90 mt-1">हिंदी में बोलकर डेटा दर्ज करें</p>
            </div>
          </Card>
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="text-center">
              <div className="text-3xl mb-2">🌾</div>
              <h3 className="font-bold text-lg">नई फसल जोड़ें</h3>
              <p className="text-sm opacity-90 mt-1">फसल सलाह प्राप्त करें</p>
            </div>
          </Card>
        </GridLayout>
      </div>

      {/* Today's Tips */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🌾</span>
          आजकी सलाह
        </h2>
        <Card className="bg-gradient-to-r from-green-50 via-yellow-50 to-orange-50 border-l-4 border-farmer-green">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <p className="text-lg font-semibold text-gray-800">नियमित रूप से अपने खर्चों को ट्रैक करते रहें</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <p className="text-lg font-semibold text-gray-800">फसल की सिफारिशें लेने के लिए फसल सेक्शन देखें</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <p className="text-lg font-semibold text-gray-800">मौसम की जानकारी के लिए मौसम सेक्शन चेक करें</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-2xl">✓</span>
              <p className="text-lg font-semibold text-gray-800">आवाज़ से तेज़ी से खर्च जोड़ने के लिए माइक बटन दबाएं</p>
            </div>
          </div>
        </Card>
      </div>
    </PageContainer>
  )
}

export default Dashboard
