import React from 'react'

const PageTitle = ({ icon, title, subtitle, className = '' }) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex items-center space-x-4 mb-2">
        {icon && <span className="text-4xl">{icon}</span>}
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
      </div>
      {subtitle && (
        <p className="text-lg text-gray-600 ml-12">{subtitle}</p>
      )}
    </div>
  )
}

export default PageTitle
