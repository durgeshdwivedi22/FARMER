import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../utils/translation'

const BottomNav = () => {
  const location = useLocation()
  const { t } = useTranslation('hindi')

  const navItems = [
    {
      path: '/dashboard',
      icon: 'fas fa-home',
      label: t('dashboard')
    },
    {
      path: '/expenses',
      icon: 'fas fa-wallet',
      label: t('expenses')
    },
    {
      path: '/voice',
      icon: 'fas fa-microphone',
      label: t('voice')
    },
    {
      path: '/crops',
      icon: 'fas fa-seedling',
      label: t('crops')
    },
    {
      path: '/weather',
      icon: 'fas fa-cloud-sun',
      label: t('weather')
    }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'text-farmer-green bg-farmer-green bg-opacity-10'
                  : 'text-gray-600 hover:text-farmer-green'
              }`}
            >
              <i className={`${item.icon} text-xl mb-1`}></i>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default BottomNav
