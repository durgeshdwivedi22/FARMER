import React from 'react'

const LargeButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false, 
  loading = false,
  className = '',
  variant = 'primary' // primary, secondary, danger
}) => {
  const baseClasses = 'farmer-button font-semibold transition-all duration-200'
  
  const variantClasses = {
    primary: 'bg-farmer-green text-white hover:bg-farmer-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  }

  const disabledClasses = 'opacity-50 cursor-not-allowed'

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="loading-spinner w-5 h-5 mr-2"></div>
          <span>लोड हो रहा है...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

export default LargeButton
