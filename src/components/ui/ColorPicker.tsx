import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  label?: string;
  colors?: string[];
}

const defaultColors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#FF9F1C', // Orange
  '#6A0572', // Purple
  '#1A535C', // Dark Teal
  '#F9C80E', // Yellow
  '#2EC4B6', // Turquoise
  '#011627', // Navy
  '#E71D36', // Bright Red
  '#F15BB5', // Pink
  '#00BBF9', // Blue
  '#00F5D4', // Aqua
  '#9B5DE5', // Purple
  '#F17013', // Brand Orange
];

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  className,
  label,
  colors = defaultColors,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close the color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn('relative', className)} ref={pickerRef}>
      {label && (
        <Typography variant="caption" className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </Typography>
      )}
      
      <div
        className="h-9 w-full cursor-pointer rounded-md border border-gray-300 p-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          className="h-full w-full rounded"
          style={{ backgroundColor: value || '#FFFFFF' }}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white p-2 shadow-lg">
          <div className="grid grid-cols-5 gap-1">
            {colors.map((color, index) => (
              <div
                key={index}
                className={cn(
                  'h-6 w-6 cursor-pointer rounded-full border border-gray-300',
                  color === value && 'ring-2 ring-primary-main ring-offset-1'
                )}
                style={{ backgroundColor: color }}
                onClick={() => {
                  onChange(color);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { ColorPicker };