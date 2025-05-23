import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

/**
 * Card Component
 * 
 * A versatile card container with optional hover and click behaviors.
 * Uses a glass-morphism design pattern with optional neumorphic shadows on hover.
 * 
 * Features:
 * - Consistent padding and styling for content containers
 * - Optional hover animations with shadow and subtle elevation
 * - Click handling for interactive cards
 * - Flexible content layout through children
 * - Customizable through className prop
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverable = false
}) => {
  const baseClasses = 'glass-card p-4';
  const hoverClasses = hoverable 
    ? 'hover:shadow-neumorphic-light cursor-pointer transition-all duration-300 transform hover:-translate-y-1' 
    : '';
  
  const clickClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
