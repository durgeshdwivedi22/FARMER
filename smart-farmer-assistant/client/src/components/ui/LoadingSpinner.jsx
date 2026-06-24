import React from 'react'

const LoadingSpinner = ({ message = 'लोड हो रहा है...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmer-green to-farmer-light flex items-center justify-center">
      <div className="text-center">
        <div className={`loading-spinner ${sizeClasses[size]} mx-auto mb-4`}></div>
        <p className="text-xl text-white font-medium">{message}</p>
      </div>
    </div>
  )
}

export default LoadingSpinner
