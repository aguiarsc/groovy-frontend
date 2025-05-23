import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { UserRole } from '../../types';

/**
 * RegisterForm Component
 * - User profile creation with name, email, and password
 * - Password confirmation to prevent typos
 * - Robust form validation with specific error messages
 * - Loading state indication during registration
 * - Error display for failed registration attempts
 * - Integration with authentication system via useAuth hook
 * - Automatic navigation after successful registration
 * - Link to login page for existing users
 * - Terms of service acknowledgment
 */
export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: UserRole.USER
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validate()) return;
    
    const { confirmPassword, ...userData } = formData;
    const success = await register(userData);
    
    if (success) {
      navigate('/home');
    }
  };
  
  return (
    <Card className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold text-macchiato-text mb-6 text-center">Create an Account</h2>
      
      {/* Display error message from authentication system if present */}
      {error && (
        <div className="bg-macchiato-red/20 border border-macchiato-red text-macchiato-red px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Name input with validation feedback */}
        <Input
          label="Name"
          type="text"
          name="name"
          placeholder="Your name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          fullWidth
        />
        
        {/* Email input with validation feedback */}
        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          fullWidth
        />
        
        {/* Password input with validation feedback */}
        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          fullWidth
        />
        
        {/* Password confirmation with validation feedback */}
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          fullWidth
        />
        
        {/* Terms of service acknowledgment */}
        <div className="mb-6">
          <p className="text-sm text-macchiato-subtext0 mb-2">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
        
        {/* Submit button with loading state */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isLoading}
        >
          Register
        </Button>
      </form>
      
      {/* Login link for existing users */}
      <div className="mt-6 text-center">
        <p className="text-macchiato-subtext0">
          Already have an account?{' '}
          <Link to="/login" className="text-macchiato-mauve hover:text-macchiato-pink">
            Login
          </Link>
        </p>
      </div>
    </Card>
  );
};
