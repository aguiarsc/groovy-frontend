import React, { useState, useRef, useEffect } from 'react';

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  className?: string;
  thumbColor?: string;
  trackColor?: string;
  trackFillColor?: string;
}

/**
 * Slider Component
 * 
 * A customizable range input slider with support for minimum/maximum values,
 * step increments, and visual customization. Implements drag-and-drop interaction
 * for smooth user experience.
 * 
 * Features:
 * - Mouse-based interaction (click and drag)
 * - Custom styling for track, thumb, and filled portions
 * - Step-based value increments for precise control
 * - Controlled component pattern with value/onChange props
 * - Neumorphic styling for the thumb element
 */
export const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = '',
  thumbColor = 'bg-macchiato-mauve',
  trackColor = 'bg-macchiato-surface1',
  trackFillColor = 'bg-macchiato-mauve'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateValue(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  };

  /**
   * Calculate and update the slider value based on mouse position
   */
  const updateValue = (e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, position / rect.width));
    const newValue = min + percentage * (max - min);
    
    const steppedValue = Math.round(newValue / step) * step;
    
    onChange(steppedValue);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div 
      ref={sliderRef}
      className={`h-2 relative rounded-full cursor-pointer ${trackColor} ${className}`}
      onMouseDown={handleMouseDown}
    >
      {/* Filled portion of the track */}
      <div 
        className={`absolute top-0 left-0 h-full rounded-full ${trackFillColor}`}
        style={{ width: `${percentage}%` }}
      />
      
      {/* Draggable thumb element */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-neumorphic-dark ${thumbColor}`}
        style={{ left: `calc(${percentage}% - 0.5rem)` }}
      />
    </div>
  );
};
