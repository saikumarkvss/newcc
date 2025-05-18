import React from 'react';
import { motion } from 'framer-motion';
import { Info, Calculator, Percent, CreditCard } from 'lucide-react';

const AboutPage: React.FC = () => {
  const calculatorInfo = [
    {
      id: 'basic',
      title: 'Basic Calculator',
      icon: <Calculator className="text-primary" />,
      description: 'Perform simple calculations with support for custom percentage operations. View results in Indian number format with words conversion. Track your calculation history for reference.',
      features: [
        'Basic arithmetic operations (+, -, ×, ÷)',
        'Custom percentage buttons (editable)',
        'Indian number format display',
        'Calculation history',
      ]
    },
    {
      id: 'reversePercentage',
      title: 'Reverse % Finder',
      icon: <Percent className="text-primary" />,
      description: 'Find the percentage difference between two amounts. Useful for calculating discounts, markups, or any percentage change between values.',
      features: [
        'Calculate percentage difference',
        'Shows increase/decrease indicators',
        'Swap values for quick comparisons',
      ]
    },
    {
      id: 'emi',
      title: 'EMI Calculator',
      icon: <CreditCard className="text-primary" />,
      description: 'Calculate Equated Monthly Installments (EMI) for loans with customizable principal amount, interest rate and tenure. View detailed breakdown of total interest and payment.',
      features: [
        'Adjustable loan amount',
        'Interest rate customization (up to 100%)',
        'Flexible loan tenure',
        'Detailed payment breakdown',
      ]
    },
  ];

  return (
    <div className="animate-fade-in pb-20">
      <div className="rounded-xl overflow-hidden shadow-lg bg-background-light mb-6">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">About Smart Calculator</h2>
          </div>
          
          <p className="text-text-secondary mb-4">
            Smart Calculator is a comprehensive calculation tool designed for everyday financial needs. Whether you need to perform basic calculations, find percentage differences, or plan your loan EMIs, this app has you covered.
          </p>
          
          <p className="text-text-secondary">
            With a clean, mobile-friendly interface and intuitive controls, Smart Calculator makes complex calculations simple and accessible.
          </p>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Calculator Types</h3>
      
      <div className="space-y-4">
        {calculatorInfo.map((calculator) => (
          <motion.div
            key={calculator.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl overflow-hidden shadow-lg bg-background-light"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {calculator.icon}
                <h3 className="text-lg font-semibold">{calculator.title}</h3>
              </div>
              
              <p className="text-text-secondary text-sm mb-4">{calculator.description}</p>
              
              <h4 className="text-primary text-sm font-medium mb-2">Features:</h4>
              <ul className="list-disc pl-5 text-text-secondary text-sm space-y-1">
                {calculator.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;