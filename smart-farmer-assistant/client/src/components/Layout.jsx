import React, { useState } from 'react';
import { useTranslation } from '../utils/translation';

export const Header = ({ farmer, language, onLanguageChange, onLogout }) => {
  const { t } = useTranslation(language);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center">
            <span className="text-3xl mr-3">🌾</span>
            <div>
              <h1 className="text-2xl font-bold">Smart Farmer</h1>
              <p className="text-sm text-green-100">स्मार्ट किसान सहायक</p>
            </div>
          </div>

          {/* Farmer Name */}
          {farmer && (
            <div className="text-right mr-4">
              <p className="text-sm">नमस्ते!</p>
              <p className="text-lg font-semibold">{farmer.name}</p>
            </div>
          )}

          {/* Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="relative w-12 h-12 rounded-full bg-green-800 hover:bg-green-900 flex items-center justify-center"
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute top-16 right-4 bg-white text-gray-800 rounded-lg shadow-xl w-56">
              <button
                onClick={() => {
                  onLanguageChange(language === 'hindi' ? 'english' : 'hindi');
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b"
              >
                {language === 'hindi' ? '🇬🇧 English' : '🇮🇳 हिंदी'}
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-red-600 font-bold"
              >
                लॉगआउट (Logout)
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export const BottomNav = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: '📊' },
    { id: 'expenses', label: 'खर्च', icon: '💰' },
    { id: 'crops', label: 'फसलें', icon: '🌾' },
    { id: 'voice', label: '🎤 आवाज़', icon: '🎤' },
    { id: 'weather', label: 'मौसम', icon: '🌤️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-600 shadow-2xl md:hidden">
      <div className="flex justify-around">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              flex-1
              py-3
              px-2
              text-center
              transition-all
              ${currentPage === item.id
                ? 'bg-green-50 border-t-4 border-green-600'
                : 'border-t-4 border-transparent'
              }
            `}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-xs font-semibold">{item.label}</div>
          </button>
        ))}
      </div>
    </nav>
  );
};

export const Sidebar = ({ currentPage, onNavigate, language }) => {
  const navItems = [
    { id: 'dashboard', label: 'डैशबोर्ड', icon: '📊' },
    { id: 'expenses', label: 'खर्च', icon: '💰' },
    { id: 'crops', label: 'फसलें', icon: '🌾' },
    { id: 'voice', label: 'आवाज़ सहायक', icon: '🎤' },
    { id: 'insights', label: 'सुझाव', icon: '💡' },
    { id: 'weather', label: 'मौसम', icon: '🌤️' },
    { id: 'profile', label: 'प्रोफाइल', icon: '👤' },
  ];

  return (
    <aside className="hidden md:block w-64 bg-gradient-to-b from-green-600 to-green-700 text-white min-h-screen fixed left-0 top-16 shadow-lg">
      <nav className="p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`
              w-full
              text-left
              px-4
              py-3
              rounded-lg
              font-bold
              text-lg
              transition-all
              ${currentPage === item.id
                ? 'bg-green-800 shadow-lg'
                : 'hover:bg-green-500'
              }
            `}
          >
            <span className="text-2xl mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`
      max-w-7xl
      mx-auto
      px-4
      py-6
      pb-24
      md:pb-6
      md:ml-64
      ${className}
    `}>
      {children}
    </div>
  );
};

export const PageTitle = ({ icon = '', title, subtitle = '' }) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">
        {icon && <span className="mr-3">{icon}</span>}
        {title}
      </h1>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
};

export const GridLayout = ({ children, cols = 3 }) => {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colsClass[cols]} gap-6`}>
      {children}
    </div>
  );
};

export default {
  Header,
  Sidebar,
  BottomNav,
  PageContainer,
  PageTitle,
  GridLayout
};
