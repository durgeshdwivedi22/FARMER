import React from 'react';

// Large Button Component - optimized for farmers with low tech literacy
export const LargeButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'lg',
  disabled = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-green-600 hover:bg-green-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-500 hover:bg-green-600 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-xl',
    xl: 'px-12 py-6 text-2xl',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-lg
        font-bold
        transition-all
        duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        w-full
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Card Component
export const Card = ({ children, className = '', title = '' }) => {
  return (
    <div className={`
      bg-white
      rounded-lg
      shadow-md
      p-6
      border-l-4
      border-green-600
      ${className}
    `}>
      {title && <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>}
      {children}
    </div>
  );
};

// Information Card with Icon
export const InfoCard = ({ icon: Icon, title, value, subtitle = '', color = 'green' }) => {
  const colors = {
    green: 'bg-green-50 border-green-300 text-green-700',
    red: 'bg-red-50 border-red-300 text-red-700',
    blue: 'bg-blue-50 border-blue-300 text-blue-700',
    yellow: 'bg-yellow-50 border-yellow-300 text-yellow-700',
  };

  return (
    <Card className={`${colors[color]} border-l-4`}>
      <div className="flex items-start">
        {Icon && <Icon className="w-12 h-12 mr-4" />}
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
};

// Input Field - large and easy to use
export const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  className = '',
  error = '',
  helperText = '',
  ...props
}) => {
  return (
    <div className="mb-6 w-full">
      {label && (
        <label className="block text-lg font-bold text-gray-800 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full
          px-4
          py-3
          text-lg
          border-2
          border-gray-300
          rounded-lg
          focus:border-green-600
          focus:outline-none
          focus:ring-2
          focus:ring-green-300
          transition-all
          ${error ? 'border-red-600' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      {helperText && <p className="text-gray-500 text-sm mt-2">{helperText}</p>}
    </div>
  );
};

// Select Input
export const SelectField = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'चुनें...',
  required = false,
  className = '',
  error = '',
  ...props
}) => {
  return (
    <div className="mb-6 w-full">
      {label && (
        <label className="block text-lg font-bold text-gray-800 mb-2">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        className={`
          w-full
          px-4
          py-3
          text-lg
          border-2
          border-gray-300
          rounded-lg
          focus:border-green-600
          focus:outline-none
          transition-all
          ${error ? 'border-red-600' : ''}
          ${className}
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
};

// Alert/Message Box
export const Alert = ({ 
  type = 'info', 
  message, 
  onClose,
  title = ''
}) => {
  const colors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div className={`
      ${colors[type]}
      border-l-4
      p-4
      rounded-lg
      mb-4
    `}>
      {title && <p className="font-bold mb-2">{title}</p>}
      <p className="text-lg">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="text-sm mt-2 font-bold hover:underline"
        >
          बंद करें (Close)
        </button>
      )}
    </div>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ message = 'लोड हो रहा है...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mb-4"></div>
      <p className="text-lg text-gray-700">{message}</p>
    </div>
  );
};

// Transaction Item
export const TransactionItem = ({ 
  name, 
  amount, 
  date, 
  type,
  category,
  onClick
}) => {
  const typeColors = {
    investment: 'bg-blue-100 text-blue-800',
    profit: 'bg-green-100 text-green-800',
    loss: 'bg-red-100 text-red-800',
  };

  const typeSymbols = {
    investment: '💰',
    profit: '📈',
    loss: '📉',
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg border-l-4 border-green-600 mb-3 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className="font-bold text-lg">{name}</p>
          <p className="text-sm text-gray-600">{date}</p>
        </div>
        <div className="text-right">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${typeColors[type]}`}>
            {typeSymbols[type]} ₹{amount}
          </span>
        </div>
      </div>
      {category && <p className="text-xs text-gray-500 mt-2">Category: {category}</p>}
    </div>
  );
};

export default {
  LargeButton,
  Card,
  InfoCard,
  InputField,
  SelectField,
  Alert,
  LoadingSpinner,
  TransactionItem
};
