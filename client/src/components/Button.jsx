
import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', disabled = false, onClick, className = '', ...props }) => {
  const baseClass = `btn-${variant} btn-${size} ${disabled ? 'btn-disabled' : ''} ${className}`.trim();

  return (
    <button
      className={baseClass}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
