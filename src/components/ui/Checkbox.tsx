import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: boolean;
  errorMessage?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, error, errorMessage, ...props }, ref) => {
    return (
      <div className="flex items-start space-x-2">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-primary-main focus:ring-primary-light cursor-pointer",
              error && "border-red-500",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={props.id}
                className={cn(
                  "text-sm font-medium text-gray-700",
                  props.disabled && "text-gray-400",
                  error && "text-red-500"
                )}
              >
                {label}
              </label>
            )}
            {description && (
              <span className="text-xs text-gray-500">{description}</span>
            )}
            {error && errorMessage && (
              <span className="text-xs text-red-500 mt-1">{errorMessage}</span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };