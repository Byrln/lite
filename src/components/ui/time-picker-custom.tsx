import React from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

interface TimePickerCustomProps {
  value?: Date | null;
  onChange?: (value: Date | null) => void;
  label?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

export const TimePickerCustom: React.FC<TimePickerCustomProps> = ({
  value,
  onChange,
  label,
  disabled = false,
  error = false,
  helperText,
  placeholder,
  className,
  ...props
}) => {
  return (
    <LocalizationProvider // @ts-ignore
      dateAdapter={AdapterDateFns}>
      <TimePicker
        value={value}
        onChange={(value) => onChange?.(value as Date | null)}
        disabled={disabled}
        className={className}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={error}
            helperText={helperText}
            placeholder={placeholder}
            variant="outlined"
            fullWidth
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default TimePickerCustom;