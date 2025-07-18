import React from 'react';
import { Controller } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import moment from 'moment';
import { useIntl } from 'react-intl';
import { dateStringToObj } from 'lib/utils/helpers';

interface DatePickerCustomProps {
  name: string;
  control: any;
  defaultValue?: any;
  label?: string;
  error?: boolean;
  helperText?: string;
  onChange?: (date: any) => void;
  register?: any;
  onFilterChange?: (formattedDate: string | null) => void;
}

const DatePickerCustom: React.FC<DatePickerCustomProps> = ({
  name,
  control,
  defaultValue = null,
  label,
  error,
  helperText,
  onChange,
  register,
  onFilterChange,
}) => {
  const intl = useIntl();
  let displayLabel = label ?
    (label.startsWith('id:') ? intl.formatMessage({ id: label.substring(3) }) : label) :
    '';
  displayLabel = displayLabel.replace(/огноо/gi, '').trim();
  displayLabel = displayLabel.replace(/RowHeaderStarDate/gi, '').trim();

  return (
    <div className="flex items-center justify-center">
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field: { onChange: fieldOnChange, value } }) => (
          <DatePicker
            label={displayLabel}
            value={value}
            onChange={(date) => {
              try {
                if (date) {
                  const formattedDate = moment(
                    dateStringToObj(moment(date).format('YYYY-MM-DD')),
                    'YYYY-MM-DD'
                  );

                  fieldOnChange(formattedDate);

                  if (onChange) {
                    onChange(formattedDate);
                  }

                  if (onFilterChange) {
                    onFilterChange(moment(date).format('YYYY-MM-DD'));
                  }
                } else {
                  fieldOnChange(null);
                  if (onChange) {
                    onChange(null);
                  }
                  if (onFilterChange) {
                    onFilterChange(null);
                  }
                }
              } catch (error) {
                console.error('Error formatting date:', error);
                fieldOnChange(null);
                if (onFilterChange) {
                  onFilterChange(null);
                }
              }
            }}
            renderInput={(params) => (
              <TextField
                size="small"
                id={name}
                {...(register && register(name))}
                {...params}
                error={!!error}
                helperText={helperText || ''}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '9999px',
                  },
                  '& .MuiInputBase-input': {
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'black',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  backgroundColor: 'transparent',
                }}
              />
            )}
          />
        )}
      />
    </div>
  );
};

export default DatePickerCustom;