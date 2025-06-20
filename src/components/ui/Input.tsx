import React from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';

interface InputProps extends Omit<TextFieldProps, 'variant'> {
  variant?: 'outlined' | 'filled' | 'standard';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: boolean;
  helperText?: React.ReactNode;
  fullWidth?: boolean;
}

const Input: React.FC<InputProps> = ({
  variant = 'outlined',
  startIcon,
  endIcon,
  error = false,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-md';
  
  const variantClasses = {
    outlined: 'border border-gray-300 focus-within:border-primary-main focus-within:ring-1 focus-within:ring-primary-light',
    filled: 'bg-gray-100 border-b-2 border-gray-300 focus-within:border-primary-main',
    standard: 'border-b border-gray-300 focus-within:border-primary-main',
  };

  const errorClasses = error ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-200' : '';
  const widthClass = fullWidth ? 'w-full' : '';

  const tailwindClasses = `${baseClasses} ${variantClasses[variant]} ${errorClasses} ${widthClass} ${className}`;

  return (
    <TextField
      variant={variant}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      className={tailwindClasses}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">{startIcon}</InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : undefined,
        className: 'rounded-md',
      }}
      {...props}
    />
  );
};

export default Input;