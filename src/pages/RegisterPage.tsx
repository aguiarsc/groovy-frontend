import React from 'react';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-macchiato-base">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};
