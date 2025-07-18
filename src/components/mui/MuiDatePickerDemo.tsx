import React from 'react';
import { useForm } from 'react-hook-form';
import DatePickerCustom from './MuiDatePickerCustom';
import { useIntl } from 'react-intl';

interface DatePickerDemoProps {
  onDateChange?: (date: string) => void;
}

const DatePickerDemo: React.FC<DatePickerDemoProps> = ({ onDateChange }) => {
  const intl = useIntl();
  const {
    control,
    register,
    formState: { errors },
  } = useForm();

  return (
    <div className="flex flex-col space-y-4">
      <DatePickerCustom
        name="CurrDate"
        control={control}
        defaultValue={null}
        label={intl.formatMessage({ id: "RowHeaderStarDate" })}
        error={errors.CurrDate}
        register={register}
        onChange={(value) => {
          if (onDateChange) {
            onDateChange(value);
          }
        }}
      />
    </div>
  );
};

export default DatePickerDemo;