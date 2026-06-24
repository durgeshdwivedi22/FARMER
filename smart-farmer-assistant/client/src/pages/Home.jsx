import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../utils/translation'

const Home = () => {
  const { t } = useTranslation('hindi')

  const features = [
    {
      icon: '💰',
      title: 'खर्चा ट्रैकिंग',
      description: 'अपने खर्चे, मुनाफे और नुकसान को आसानी से ट्रैक करें',
      gradient: 'from-blue-400 to-blue-600',
      delay: 'animation-delay-100'
    },
    {
      icon: '🌱',
      title: 'फसल सलाह',
      description: 'AI द्वारा सर्वोत्तम फसलों की सिफारिशें प्राप्त करें',
      gradient: 'from-green-400 to-green-600',
      delay: 'animation-delay-200'
    },
    {
      icon: '🎤',
      title: 'आवाज़ सहायक',
      description: 'हिंदी में बोलकर डेटा दर्ज करें',
      gradient: 'from-purple-400 to-purple-600',
      delay: 'animation-delay-300'
    },
    {
      icon: '☀️',
      title: 'मौसम जानकारी',
      description: 'रियल-टाइम मौसम अपडेट और खेती सलाह',
      gradient: 'from-yellow-400 to-orange-500',
      delay: 'animation-delay-400'
    },
    {
      icon: '📊',
      title: 'स्मार्ट इनसाइट्स',
      description: 'अपनी खेती को बेहतर बनाने की सलाह',
      gradient: 'from-pink-400 to-red-500',
      delay: 'animation-delay-500'
    },
    {
      icon: '📱',
      title: 'मोबाइल फ्रेंडली',
      description: 'किसी भी फोन पर आसानी से उपयोग करें',
      gradient: 'from-indigo-400 to-indigo-600',
      delay: 'animation-delay-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmer-green via-farmer-green to-farmer-light relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-farmer-yellow opacity-20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-farmer-blue opacity-20 rounded-full animate-float animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-farmer-purple opacity-10 rounded-full animate-float animation-delay-400"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="text-center text-white mb-16 animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce-gentle">🌾</div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-farmer-light">
            {t('welcome')}
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
            स्मार्ट किसान सहायक - खेती को आसान बनाएं
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="farmer-button bg-white text-farmer-green hover:bg-gray-100 shadow-farmer-lg transform hover:scale-105 transition-all duration-300 group"
            >
              <i className="fas fa-sign-in-alt mr-2 group-hover:translate-x-1 transition-transform"></i>
              {t('login')}
            </Link>
            <Link
              to="/weather"
              className="farmer-button bg-transparent border-2 border-white text-white hover:bg-white hover:text-farmer-green transition-all duration-300"
            >
              <i className="fas fa-cloud-sun mr-2"></i>
              मौसम देखें
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`farmer-card text-center bg-white/95 backdrop-blur-farmer shadow-farmer-lg transform hover:scale-105 transition-all duration-300 hover:shadow-farmer-lg animate-slide-up ${feature.delay}`}
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-4xl shadow-lg transform hover:rotate-6 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Demo Section */}
        <div className="text-center mb-16">
          <div className="bg-white/95 backdrop-blur-farmer rounded-3xl p-8 md:p-12 max-w-4xl mx-auto shadow-farmer-lg border border-white/20 animate-fade-in animation-delay-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-farmer-green to-farmer-blue bg-clip-text text-transparent">
              डेमो देखें
            </h2>
            <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
              आज ही स्मार्ट किसान सहायक का उपयोग करके अपनी खेती को बेहतर बनाएं
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="farmer-button bg-gradient-to-r from-farmer-green to-farmer-blue text-white hover:from-farmer-dark hover:to-farmer-blue shadow-farmer-lg transform hover:scale-105 transition-all duration-300"
              >
                <i className="fas fa-play mr-2"></i>
                शुरू करें
              </Link>
              <Link
                to="/weather"
                className="farmer-button bg-gradient-to-r from-farmer-yellow to-farmer-orange text-white hover:from-farmer-orange hover:to-farmer-red shadow-farmer-lg transform hover:scale-105 transition-all duration-300"
              >
                <i className="fas fa-cloud-sun mr-2"></i>
                मौसम देखें
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="text-center text-white animate-slide-up animation-delay-800">
            <div className="text-4xl font-bold mb-2">10,000+</div>
            <p className="text-lg opacity-90">किसान उपयोगकर्ता</p>
          </div>
          <div className="text-center text-white animate-slide-up animation-delay-900">
            <div className="text-4xl font-bold mb-2">95%</div>
            <p className="text-lg opacity-90">संतुष्टि दर</p>
          </div>
          <div className="text-center text-white animate-slide-up animation-delay-1000">
            <div className="text-4xl font-bold mb-2">24/7</div>
            <p className="text-lg opacity-90">सहायता उपलब्ध</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/80 text-lg animate-fade-in animation-delay-1100">
          <p>🌾 स्मार्ट किसान सहायक - भारतीय किसानों के लिए</p>
          <p className="mt-2">Made with ❤️ for Indian Farmers</p>
        </div>
      </div>
    </div>
  )
}

export default Home
