import React from 'react';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-macchiato-base">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};
