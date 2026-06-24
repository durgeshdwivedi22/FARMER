import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import { useTranslation } from './utils/translation'

// Components
import Header from './components/Header'
import BottomNav from './components/BottomNav'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Crops from './pages/Crops'
import Weather from './pages/Weather'
import VoiceAssistant from './pages/VoiceAssistant'

function App() {
  const [farmer, setFarmer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState('hindi')
  const { t, changeLanguage } = useTranslation(language)

  useEffect(() => {
    // Check for stored farmer data
    const storedFarmer = localStorage.getItem('farmer')
    const storedToken = localStorage.getItem('token')
    
    if (storedFarmer && storedToken) {
      setFarmer(JSON.parse(storedFarmer))
    }
    
    setLoading(false)
  }, [])

  const handleLogin = (farmerData, token) => {
    setFarmer(farmerData)
    localStorage.setItem('farmer', JSON.stringify(farmerData))
    localStorage.setItem('token', token)
  }

  const handleLogout = () => {
    setFarmer(null)
    localStorage.removeItem('farmer')
    localStorage.removeItem('token')
  }

  const toggleLanguage = () => {
    const newLang = language === 'hindi' ? 'english' : 'hindi'
    setLanguage(newLang)
    changeLanguage(newLang)
    localStorage.setItem('language', newLang)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-farmer-green to-farmer-light">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {farmer && <Header farmer={farmer} onLogout={handleLogout} language={language} toggleLanguage={toggleLanguage} />}
        
        <main className={`pb-20 ${farmer ? 'pt-20' : ''}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} language={language} />} />
            <Route path="/dashboard" element={farmer ? <Dashboard farmer={farmer} /> : <Navigate to="/login" />} />
            <Route path="/expenses" element={farmer ? <Expenses farmer={farmer} /> : <Navigate to="/login" />} />
            <Route path="/crops" element={farmer ? <Crops farmer={farmer} /> : <Navigate to="/login" />} />
            <Route path="/weather" element={<Weather farmer={farmer} />} />
            <Route path="/voice" element={farmer ? <VoiceAssistant farmer={farmer} /> : <Navigate to="/login" />} />
          </Routes>
        </main>

        {farmer && <BottomNav />}
      </div>
    </BrowserRouter>
  )
}

export default App
