import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  label?: string;
  type?: string;
  readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  className = '',
  id,
  label,
  type = 'text',
  readOnly = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="text-text-secondary text-sm mb-1 block">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full bg-background-light text-text-primary px-4 py-3 rounded-button 
                  focus:ring-1 focus:ring-primary border border-background-light ${className}`}
      />
    </div>
  );
};

export default Input;