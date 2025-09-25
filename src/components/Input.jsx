import { forwardRef } from 'react';
import { classNames } from '../lib/ui';

const Input = forwardRef(({ 
  label, 
  error, 
  helpText,
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={classNames(
          'input',
          error ? 'border-red-300 focus:ring-red-500' : '',
          className
        )}
        {...props}
      />
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;