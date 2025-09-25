import ReactSelect from 'react-select';
import { Controller } from 'react-hook-form';
import { classNames } from '../lib/ui';

const Select = ({ 
  label, 
  error, 
  helpText,
  className = '',
  ...props 
}) => {
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? '#f87171' : state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        borderColor: error ? '#f87171' : '#9ca3af'
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151'
    })
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <ReactSelect
        styles={customStyles}
        className={classNames('react-select-container', className)}
        classNamePrefix="react-select"
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
};

export const ControlledSelect = ({ 
  name, 
  control, 
  label, 
  error, 
  helpText,
  className = '',
  rules = {},
  ...props 
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field }) => (
          <Select
            {...field}
            {...props}
            className={className}
          />
        )}
      />
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
export default Select;