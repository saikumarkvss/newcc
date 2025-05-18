import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'small' | 'wide' | 'text';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const getButtonClasses = () => {
    switch (variant) {
      case 'primary':
        return 'calculator-button calculator-button-orange';
      case 'small':
        return 'calculator-button calculator-button-small';
      case 'wide':
        return 'calculator-button col-span-2';
      case 'text':
        return 'text-primary font-medium py-2 px-4 rounded-button bg-transparent hover:bg-background-light';
      default:
        return 'calculator-button';
    }
  };

  return (
    <motion.button
      className={`${getButtonClasses()} ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;