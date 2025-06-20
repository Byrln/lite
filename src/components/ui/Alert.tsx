import React from 'react';
import { Alert as MuiAlert, AlertProps as MuiAlertProps, AlertTitle } from '@mui/material';
import { 
  CheckCircleOutline, 
  ErrorOutline, 
  InfoOutlined, 
  WarningAmberOutlined 
} from '@mui/icons-material';

interface AlertProps extends MuiAlertProps {
  title?: string;
  variant?: 'filled' | 'outlined' | 'standard';
  severity?: 'success' | 'info' | 'warning' | 'error';
}

const Alert: React.FC<AlertProps> = ({
  children,
  title,
  variant = 'standard',
  severity = 'info',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-md';
  
  const variantClasses = {
    standard: {
      success: 'bg-green-50 text-green-800 border border-green-200',
      info: 'bg-blue-50 text-blue-800 border border-blue-200',
      warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
      error: 'bg-red-50 text-red-800 border border-red-200',
    },
    outlined: {
      success: 'bg-white text-green-800 border border-green-500',
      info: 'bg-white text-blue-800 border border-blue-500',
      warning: 'bg-white text-yellow-800 border border-yellow-500',
      error: 'bg-white text-red-800 border border-red-500',
    },
    filled: {
      success: 'bg-green-600 text-white',
      info: 'bg-blue-600 text-white',
      warning: 'bg-yellow-600 text-white',
      error: 'bg-red-600 text-white',
    },
  };

  const iconMap = {
    success: <CheckCircleOutline className="h-5 w-5" />,
    info: <InfoOutlined className="h-5 w-5" />,
    warning: <WarningAmberOutlined className="h-5 w-5" />,
    error: <ErrorOutline className="h-5 w-5" />,
  };

  const tailwindClasses = `${baseClasses} ${variantClasses[variant][severity]} ${className}`;

  return (
    <MuiAlert
      variant={variant}
      severity={severity}
      icon={iconMap[severity]}
      className={tailwindClasses}
      {...props}
    >
      {title && <AlertTitle className="font-medium">{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
};

export default Alert;