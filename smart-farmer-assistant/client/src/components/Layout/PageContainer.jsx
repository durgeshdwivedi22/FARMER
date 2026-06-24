import React from 'react'

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`container mx-auto px-4 py-6 ${className}`}>
      {children}
    </div>
  )
}

export default PageContainer
