import React from 'react'
import { useTranslation } from '../utils/translation'

const Header = ({ farmer, onLogout, language, toggleLanguage }) => {
  const { t } = useTranslation(language)

  return (
    <header className="fixed top-0 left-0 right-0 bg-farmer-green text-white shadow-lg z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🌾</div>
            <div>
              <h1 className="text-xl font-bold">{t('dashboard')}</h1>
              <p className="text-sm opacity-90">{t('welcome')}</p>
            </div>
          </div>

          {/* Right side - Language and Profile */}
          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-2 rounded-lg transition-all"
            >
              <span className="text-lg">
                {language === 'hindi' ? '🇮🇳' : '🇬🇧'}
              </span>
            </button>

            {/* Farmer Info */}
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="font-semibold">{farmer?.name || 'किसान'}</p>
                <p className="text-xs opacity-75">{farmer?.mobile || 'मोबाइल'}</p>
              </div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <i className="fas fa-user"></i>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              {t('logout')}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
