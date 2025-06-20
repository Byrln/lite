import * as React from 'react';
import { Radio } from '@base-ui-components/react/radio';
import { RadioGroup } from '@base-ui-components/react/radio-group';

// Define the interface for radio items
export interface RadioItem {
  value: string;
  label: string;
  disabled?: boolean;
}

// Define the props interface for the CustomRadio component
export interface CustomRadioProps {
  items: RadioItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  className?: string;
  radioClassName?: string;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  caption?: string;
  labelClassName?: string;
  captionClassName?: string;
  required?: boolean;
}

// Default class names
const defaultRadioClassName = "flex size-5 items-center justify-center rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800 data-[checked]:bg-purple-600 data-[unchecked]:border data-[unchecked]:border-gray-300";
const defaultLabelClassName = "flex items-center gap-2";
const defaultCaptionClassName = "font-medium";

// Create the reusable CustomRadio component
export const CustomRadio: React.FC<CustomRadioProps> = ({
  defaultValue,
  items,
  onChange,
  caption,
  orientation = 'vertical',
  className = "flex flex-col items-start gap-1 text-gray-900",
  radioClassName = defaultRadioClassName,
  labelClassName = defaultLabelClassName,
  captionClassName = defaultCaptionClassName,
  name,
  required = false,
  disabled = false,
  value,
}) => {
  // Handle value change
  const handleValueChange = (value: unknown, event?: Event) => {
    if (onChange) {
      onChange(value as string);
    }
  };

  return (
    <RadioGroup
      aria-labelledby={caption ? `${name}-caption` : undefined}
      defaultValue={defaultValue || items[0]?.value}
      value={value}
      className={`${className} ${orientation === 'horizontal' ? 'flex-row' : 'flex-col'}`}
      onValueChange={handleValueChange}
    >
      {caption && (
        <div className={captionClassName} id={`${name}-caption`}>
          {caption}
        </div>
      )}

      {items.map((item) => (
        <label key={item.value} className={labelClassName}>
          <Radio.Root
            value={item.value}
            className={radioClassName}
            disabled={item.disabled || disabled}
            required={required}
          >
            <Radio.Indicator className="flex before:size-2 before:rounded-full before:bg-gray-50 data-[unchecked]:hidden" />
          </Radio.Root>
          {item.label}
        </label>
      ))}
    </RadioGroup>
  );
};

// Example usage of the component
export function ExampleRadioGroup() {
  const appleOptions: RadioItem[] = [
    { value: 'fuji-apple', label: 'Fuji' },
    { value: 'gala-apple', label: 'Gala' },
    { value: 'granny-smith-apple', label: 'Granny Smith' },
  ];

  return <CustomRadio defaultValue="fuji-apple" caption="Best apple" items={appleOptions} />;
}

export default CustomRadio;
