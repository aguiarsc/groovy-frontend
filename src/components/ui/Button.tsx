import React, { ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  to?: string;
}

/**
 * Reusable button component with multiple variants and states
 * 
 * Features:
 * - Multiple visual variants (primary, secondary, danger, ghost)
 * - Different size options
 * - Loading state with spinner
 * - Full width option
 * - Can function as a navigation link when `to` prop is provided
 * - Consistent styling using the application's design system
 * - Neumorphic styling for depth and tactile feel
 * 
 * @param {ButtonProps} props - Button component properties
 * @returns {JSX.Element} Rendered button or link component
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  className = '',
  disabled,
  to,
  ...props
}) => {
  const baseClasses = 'neumorphic-button transition-all duration-200 font-medium focus:outline-none';
  
  const variantClasses = {
    primary: 'bg-macchiato-mauve text-macchiato-base hover:bg-macchiato-mauve/90',
    secondary: 'bg-macchiato-surface1 text-macchiato-text hover:bg-macchiato-surface1/90',
    danger: 'bg-macchiato-red text-macchiato-base hover:bg-macchiato-red/90',
    ghost: 'bg-transparent text-macchiato-text hover:bg-macchiato-surface0/50 shadow-none'
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5 rounded-md',
    md: 'text-base px-4 py-2 rounded-lg',
    lg: 'text-lg px-6 py-3 rounded-xl'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled || isLoading ? 'opacity-70 cursor-not-allowed' : '';
  
  const allClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${disabledClass} ${className}`;
  
  const content = isLoading ? (
    <div className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Loading...</span>
    </div>
  ) : (
    children
  );
  
  if (to) {
    return (
      <Link to={to} className={allClasses} {...(props as any)}>
        {content}
      </Link>
    );
  }
  
  return (
    <button
      className={allClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
};
