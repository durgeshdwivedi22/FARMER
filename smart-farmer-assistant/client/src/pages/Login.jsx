import React, { useState } from 'react'
import { LargeButton, InputField, Card, Alert, LoadingSpinner } from '../components/ui'
import { farmerAPI } from '../services/api'
import { useTranslation } from '../utils/translation'

const Login = ({ onLogin, language }) => {
  const [step, setStep] = useState('mobile') // mobile or otp
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    district: '',
    state: '',
    landSize: '',
    preferredLanguage: 'hindi'
  })
  const { t } = useTranslation('hindi')

  const handleMobileSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate mobile
      if (!/^[0-9]{10}$/.test(mobile)) {
        setError('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें')
        setLoading(false)
        return
      }

      const response = await farmerAPI.login(mobile)
      
      if (response.success) {
        setSuccess('OTP भेजा गया! आपके मोबाइल पर देखें।')
        setTimeout(() => {
          setStep('otp')
          setSuccess('')
        }, 1500)
      } else {
        setError(response.message || 'कोई समस्या आई')
      }
    } catch (err) {
      setError(err.message || 'किसान नहीं मिला। पहले रजिस्टर करें।')
      setIsNewUser(true)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name || !mobile || !formData.village || !formData.district || !formData.state) {
        setError('सभी फील्ड भरें')
        setLoading(false)
        return
      }

      const response = await farmerAPI.register({
        mobile,
        ...formData
      })

      if (response.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('farmer', JSON.stringify(response.data.farmer))
        setSuccess('पंजीकरण सफल!')
        setTimeout(() => onLogin(response.data.farmer, response.data.token), 1000)
      }
    } catch (err) {
      setError(err.message || 'पंजीकरण में त्रुटि')
    } finally {
      setLoading(false)
    }
  }

  const handleOTPVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (otp.length !== 6) {
        setError('6 अंकों का OTP दर्ज करें')
        setLoading(false)
        return
      }

      const response = await farmerAPI.verifyOTP(mobile, otp)

      if (response.success) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('farmer', JSON.stringify(response.data.farmer))
        setSuccess('लॉगिन सफल!')
        setTimeout(() => onLogin(response.data.farmer, response.data.token), 1000)
      }
    } catch (err) {
      setError('OTP गलत है। फिर से दोहाएं।')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner message="कृपया प्रतीक्षा करें..." />

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmer-green via-farmer-green to-farmer-light flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-farmer-yellow opacity-20 rounded-full animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-farmer-blue opacity-20 rounded-full animate-float animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-farmer-purple opacity-10 rounded-full animate-float animation-delay-400"></div>
      </div>

      <Card className="w-full max-w-md shadow-farmer-lg bg-white/95 backdrop-blur-farmer border border-white/20 animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-gentle">🌾</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Smart Farmer</h2>
          <p className="text-gray-600">स्मार्ट किसान सहायक</p>
        </div>

        {error && <Alert type="error" message={error} />}
        {success && <Alert type="success" message={success} />}

        {isNewUser ? (
          // Registration Form
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-farmer-green">नया किसान पंजीकरण</h3>
              <p className="text-gray-600 text-sm mt-1">अपनी जानकारी दर्ज करें</p>
            </div>

            <InputField
              label="पूरा नाम"
              placeholder="आपका नाम दर्ज करें"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="bg-white/50"
            />
            <InputField
              label="गांव का नाम"
              placeholder="आपका गांव"
              value={formData.village}
              onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              required
              className="bg-white/50"
            />
            <InputField
              label="जिला"
              placeholder="जिला"
              value={formData.district}
              onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              required
              className="bg-white/50"
            />
            <InputField
              label="राज्य"
              placeholder="राज्य"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
              className="bg-white/50"
            />
            <InputField
              label="ज़मीन का आकार (एकड़)"
              type="number"
              placeholder="एकड़ में"
              value={formData.landSize}
              onChange={(e) => setFormData({ ...formData, landSize: e.target.value })}
              required
              className="bg-white/50"
            />

            <LargeButton type="submit" className="w-full bg-gradient-to-r from-farmer-green to-farmer-blue hover:from-farmer-dark hover:to-farmer-blue">
              <i className="fas fa-user-plus mr-2"></i>
              पंजीकरण करें
            </LargeButton>
            <button
              type="button"
              onClick={() => {
                setIsNewUser(false)
                setError('')
              }}
              className="w-full text-farmer-green font-semibold text-lg hover:text-farmer-dark transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              वापस जाएं
            </button>
          </form>
        ) : step === 'mobile' ? (
          // Mobile Entry
          <form onSubmit={handleMobileSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-farmer-green">लॉगिन करें</h3>
              <p className="text-gray-600 text-sm mt-1">मोबाइल नंबर दर्ज करें</p>
            </div>

            <InputField
              label="मोबाइल नंबर"
              type="tel"
              placeholder="10 अंक दर्ज करें"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              required
              className="bg-white/50"
            />

            <LargeButton type="submit" className="w-full bg-gradient-to-r from-farmer-green to-farmer-blue hover:from-farmer-dark hover:to-farmer-blue">
              <i className="fas fa-arrow-right mr-2"></i>
              आगे बढ़ें
            </LargeButton>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">डेमो के लिए:</p>
              <div className="bg-farmer-yellow/20 border border-farmer-yellow/50 rounded-lg p-3">
                <p className="font-bold text-farmer-yellow">📱 9876543210</p>
                <p className="text-xs text-gray-600 mt-1">OTP: 123456</p>
              </div>
            </div>
          </form>
        ) : (
          // OTP Verification
          <form onSubmit={handleOTPVerify} className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-farmer-green/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <i className="fas fa-lock text-2xl text-farmer-green"></i>
              </div>
              <h3 className="text-xl font-semibold text-farmer-green">OTP सत्यापित करें</h3>
              <p className="text-gray-600 text-sm mt-1">
                <strong>{mobile}</strong> पर भेजा गया OTP दर्ज करें
              </p>
            </div>

            <InputField
              label="OTP"
              type="text"
              placeholder="6 अंकों का कोड"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength="6"
              required
              className="bg-white/50 text-center text-2xl font-bold"
            />

            <LargeButton type="submit" className="w-full bg-gradient-to-r from-farmer-green to-farmer-blue hover:from-farmer-dark hover:to-farmer-blue">
              <i className="fas fa-check mr-2"></i>
              सत्यापित करें
            </LargeButton>

            <button
              type="button"
              onClick={() => setStep('mobile')}
              className="w-full text-farmer-green font-semibold text-lg hover:text-farmer-dark transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              नंबर बदलें
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">डेमो OTP: <strong className="text-farmer-green">123456</strong></p>
            </div>
          </form>
        )}

        {/* Footer Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500 space-y-1">
            <p>🔒 100% सुरक्षित और निजी</p>
            <p>📞 24/7 सहायता उपलब्ध</p>
            <p>🌾 भारतीय किसानों के लिए बनाया गया</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Login
