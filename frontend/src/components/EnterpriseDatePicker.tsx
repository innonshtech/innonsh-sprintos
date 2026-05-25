import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface EnterpriseDatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const EnterpriseDatePicker = React.forwardRef<HTMLInputElement, EnterpriseDatePickerProps>(
  ({ label, error, className, ...props }, ref) => {
    // Get today's date in YYYY-MM-DD format for the 'min' attribute
    const today = new Date().toISOString().split('T')[0];

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={props.id}>{label}</Label>}
        <Input
          {...props}
          ref={ref}
          type="date"
          min={props.min || today} // By default, disable past dates
          className={`${className} ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

EnterpriseDatePicker.displayName = 'EnterpriseDatePicker';
