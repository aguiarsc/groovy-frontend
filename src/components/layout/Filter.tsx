import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';

/**
 * Filter Configuration Type
 * 
 * - Text filters: Simple string input fields
 * - Number filters: Numeric input fields with optional minimum values
 * - Select filters: Dropdown lists with predefined options
 * 
 */
type FilterConfig = 
  | {
      label: string;
      type: 'text';
      value: string;
      onChange: (value: string) => void;
    }
  | {
      label: string;
      type: 'number';
      value: number;
      onChange: (value: number) => void;
      min?: number;
    }
  | {
      label: string;
      type: 'select';
      value: string;
      onChange: (value: string) => void;
      options: { value: string; label: string }[];
    };

interface FilterProps {
  filters: FilterConfig[];
  onReset: () => void;
}

export const Filter: React.FC<FilterProps> = ({ filters, onReset }) => {
  return (
    <Card className="p-4">
      {/* Responsive grid layout: 1 column on mobile, 3 columns on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filters.map((filter, index) => {
          switch (filter.type) {
            case 'text':
              return (
                <Input
                  key={index}
                  label={filter.label}
                  type="text"
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                />
              );
              
            case 'number':
              return (
                <Input
                  key={index}
                  label={filter.label}
                  type="number"
                  value={filter.value.toString()}
                  min={filter.min ?? 0}
                  onChange={(e) => filter.onChange(Number(e.target.value))}
                />
              );

            case 'select':
              return (
                <div key={index}>
                  <label className="block text-sm font-medium text-macchiato-text mb-1">
                    {filter.label}
                  </label>
                  <select
                    className="w-full bg-macchiato-surface0/60 backdrop-blur-glass border border-macchiato-overlay0/20 text-macchiato-text rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-macchiato-mauve/20 focus:border-macchiato-mauve"
                    value={filter.value}
                    onChange={(e) => filter.onChange(e.target.value)}
                  >
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
          }
        })}
      </div>
      {/* Reset button aligned to the right */}
      <div className="flex justify-end mt-4">
        <Button variant="secondary" className="mr-2" onClick={onReset}>
          Reset
        </Button>
      </div>
    </Card>
  );
};
