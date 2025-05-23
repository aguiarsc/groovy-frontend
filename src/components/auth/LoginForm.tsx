import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';

/**
 * LoginForm Component
 * 
 * A comprehensive login form that handles user authentication, input validation,
 * error display, and post-login navigation.
 * 
 * Features:
 * - Email and password input fields with validation
 * - Real-time form validation with error messages
 * - Loading state indication during authentication
 * - Error message display for failed login attempts
 * - Integration with the authentication system via useAuth hook
 * - Automatic navigation after successful login
 * - Link to registration page for new users
 * 
 * The form is styled consistently with the application's design system
 * and provides users with clear feedback for all interaction states.
 */
export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  /**
   * Validates form inputs before submission
   * 
   * Performs the following checks:
   * 1. Ensures email is provided and properly formatted
   * 2. Ensures password is provided
   * 
   * Stores validation errors in the component state for display
   * 
   * @returns {boolean} True if all validations pass, false otherwise
   */
  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};
    let isValid = true;
    
    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  /**
   * Handles form submission
   * 
   * Process:
   * 1. Prevents default form submission behavior
   * 2. Clears any previous auth errors
   * 3. Validates form inputs
   * 4. Attempts login through auth system
   * 5. Navigates to home page on success
   * 
   * @param {React.FormEvent} e - The form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validate()) return;
    
    const success = await login(email, password);
    if (success) {
      navigate('/home');
    }
  };
  
  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-macchiato-text mb-6 text-center">Login to Groovy</h2>
      
      {/* Display error message from authentication system if present */}
      {error && (
        <div className="bg-macchiato-red/20 border border-macchiato-red text-macchiato-red px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Email input with validation feedback */}
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          fullWidth
        />
        
        {/* Password input with validation feedback */}
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          fullWidth
        />
        
        {/* Submit button with loading state */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Login
        </Button>
      </form>
      
      {/* Registration link for new users */}
      <div className="mt-6 text-center">
        <p className="text-macchiato-subtext0">
          Don't have an account?{' '}
          <Link to="/register" className="text-macchiato-mauve hover:text-macchiato-pink">
            Register
          </Link>
        </p>
      </div>
    </Card>
  );
};
