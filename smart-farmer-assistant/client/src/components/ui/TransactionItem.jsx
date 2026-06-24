import React from 'react'

const TransactionItem = ({ 
  name, 
  amount, 
  date, 
  type, 
  category,
  className = ''
}) => {
  const typeClasses = {
    investment: 'bg-blue-50 text-blue-800 border-blue-200',
    profit: 'bg-green-50 text-green-800 border-green-200',
    loss: 'bg-red-50 text-red-800 border-red-200'
  }

  const typeIcons = {
    investment: '📉',
    profit: '📈',
    loss: '⚠️'
  }

  const categoryIcons = {
    seeds: '🌱',
    fertilizer: '🧪',
    pesticide: '💊',
    labor: '👷',
    equipment: '🔧',
    irrigation: '💧',
    harvest: '🌾',
    other: '📦'
  }

  return (
    <div className={`farmer-card ${typeClasses[type]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{categoryIcons[category] || typeIcons[type]}</span>
          <div>
            <p className="font-semibold text-lg">{name}</p>
            <p className="text-sm opacity-75">{date}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold">
            {type === 'profit' ? '+' : type === 'loss' ? '-' : ''}
            ₹{amount.toLocaleString('en-IN')}
          </p>
          <p className="text-sm opacity-75">{category}</p>
        </div>
      </div>
    </div>
  )
}

export default TransactionItem
