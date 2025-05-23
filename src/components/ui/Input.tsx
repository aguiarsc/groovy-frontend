import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

/**
 * Input Component
 * 
 * A customized input field with consistent styling that follows the application's
 * design system. Supports label, error states, and responsive width.
 * 
 * Features:
 * - Integrated label display
 * - Error state with visual feedback (red border) and error message display
 * - Focus states with ring highlight
 * - Glass-morphism design with subtle backdrop blur
 * - Responsive width control
 * - Fully forwards all standard HTML input props and ref
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    const baseClasses = 'bg-macchiato-surface0/60 backdrop-blur-glass border text-macchiato-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-all duration-200';

    const borderClasses = error 
      ? 'border-macchiato-red focus:border-macchiato-red focus:ring-macchiato-red/20' 
      : 'border-macchiato-overlay0/20 focus:border-macchiato-mauve focus:ring-macchiato-mauve/20';
    
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
        {label && (
          <label className="block text-macchiato-text mb-2 font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseClasses} ${borderClasses} ${widthClass} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-macchiato-red text-sm">{error}</p>
        )}
      </div>
    );
  }
);
