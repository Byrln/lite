import React from 'react';
import { Badge as MuiBadge, BadgeProps as MuiBadgeProps } from '@mui/material';

interface BadgeProps extends MuiBadgeProps {
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | 'default';
  variant?: 'standard' | 'dot';
  size?: 'small' | 'medium' | 'large';
}

const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  variant = 'standard',
  size = 'medium',
  className = '',
  ...props
}) => {
  const colorClasses = {
    primary: 'bg-primary-main text-white',
    secondary: 'bg-secondary-main text-white',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white',
    default: 'bg-gray-500 text-white',
  };

  const sizeClasses = {
    small: 'scale-75',
    medium: 'scale-100',
    large: 'scale-125',
  };

  const tailwindClasses = `${colorClasses[color]} ${sizeClasses[size]} ${className}`;

  return (
    <MuiBadge
      color={color}
      variant={variant}
      className={tailwindClasses}
      {...props}
    >
      {children}
    </MuiBadge>
  );
};

export default Badge;