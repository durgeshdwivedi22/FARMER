import React from 'react'

const Alert = ({ type = 'info', message, onClose }) => {
  const typeClasses = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800'
  }

  const iconClasses = {
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle',
    error: 'fas fa-exclamation-circle'
  }

  return (
    <div className={`border-2 rounded-lg p-4 mb-4 flex items-start ${typeClasses[type]}`}>
      <i className={`${iconClasses[type]} text-xl mr-3 mt-1`}></i>
      <div className="flex-1">
        <p className="text-lg font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-2xl opacity-60 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Alert
