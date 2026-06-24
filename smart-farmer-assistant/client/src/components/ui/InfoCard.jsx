import React from 'react'

const InfoCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color = 'blue',
  className = '',
  onClick 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    red: 'bg-red-50 border-red-200 text-red-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  }

  return (
    <div 
      className={`farmer-card ${colorClasses[color]} cursor-pointer hover:shadow-xl transition-all ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-75 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-sm opacity-75 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-50 ml-4">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default InfoCard
