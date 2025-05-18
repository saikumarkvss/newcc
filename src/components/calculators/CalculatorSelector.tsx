import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Percent, CreditCard, HelpCircle, X } from 'lucide-react';
import { CalculatorType } from '../../App';

interface CalculatorSelectorProps {
  onSelect: (type: CalculatorType) => void;
  onClose: () => void;
}

const CalculatorSelector: React.FC<CalculatorSelectorProps> = ({ onSelect, onClose }) => {
  const calculators = [
    { id: 'basic', name: 'Basic Calculator', icon: <Calculator className="text-primary" /> },
    { id: 'reversePercentage', name: 'Reverse % Finder', icon: <Percent className="text-primary" /> },
    { id: 'emi', name: 'EMI Calculator', icon: <CreditCard className="text-primary" /> },
    { id: 'about', name: 'About', icon: <HelpCircle className="text-primary" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-background-light rounded-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-background">
          <h2 className="text-lg font-semibold">Select Calculator</h2>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-2">
          {calculators.map((calc) => (
            <motion.button
              key={calc.id}
              onClick={() => onSelect(calc.id as CalculatorType)}
              className="flex items-center gap-3 w-full p-4 rounded-button hover:bg-background text-left transition-colors"
              whileTap={{ scale: 0.98 }}
            >
              {calc.icon}
              <span>{calc.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CalculatorSelector;