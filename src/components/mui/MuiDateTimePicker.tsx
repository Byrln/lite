import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { DateTimePicker as MuiDateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  error?: boolean;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  fullWidth?: boolean;
}

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  className,
  error = false,
  helperText,
  minDate,
  maxDate,
  disabled = false,
  required = false,
  placeholder,
  fullWidth = true,
}) => {
  return (
    <LocalizationProvider // @ts-ignore
      dateAdapter={AdapterDateFns}>
      <MuiDateTimePicker
        label={label}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        className={cn('w-full', className)}
        renderInput={(props) => (
          <TextField
            {...props}
            fullWidth={fullWidth}
            required={required}
            placeholder={placeholder}
            error={error}
            helperText={helperText}
            InputProps={{
              ...props.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <div className="flex space-x-1 text-gray-400">
                    <CalendarIcon className="h-4 w-4" />
                    <ClockIcon className="h-4 w-4" />
                  </div>
                </InputAdornment>
              ),
            }}
            className={cn(
              'rounded-md border border-gray-300',
              error ? 'border-red-500' : 'focus:border-primary-main focus:ring-1 focus:ring-primary-light'
            )}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export { DateTimePicker };