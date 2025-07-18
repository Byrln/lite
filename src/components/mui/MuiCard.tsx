import React from 'react';
import { Card as MuiCard, CardProps as MuiCardProps, CardContent } from '@mui/material';

interface CardProps extends MuiCardProps {
  variant?: 'outlined' | 'elevation';
  padding?: 'none' | 'small' | 'medium' | 'large';
  noBorder?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevation',
  padding = 'medium',
  noBorder = false,
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-5',
    large: 'p-8',
  };

  const variantClasses = {
    outlined: 'border border-gray-200',
    elevation: 'shadow-card',
  };

  const borderClass = noBorder ? 'border-0' : '';

  const tailwindClasses = `bg-white rounded-lg ${paddingClasses[padding]} ${variantClasses[variant]} ${borderClass} ${className}`;

  return (
    <MuiCard className={tailwindClasses} variant={variant} {...props}>
      {children}
    </MuiCard>
  );
};

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <h3 className={`text-lg font-medium text-gray-800 mb-2 ${className}`}>{children}</h3>;
};

export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <p className={`text-sm text-gray-600 mb-4 ${className}`}>{children}</p>;
};

export const CardActions: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`flex items-center justify-end space-x-2 mt-4 ${className}`}>{children}</div>;
};

export default Card;