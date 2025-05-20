import React, { useState } from 'react';

// Utility functions
export const calculate = (expression: string): number => {
  if (!expression) return 0;
  
  // Remove trailing operators
  const cleanExpression = expression.replace(/[+\-×÷*\/]$/, '');
  
  // Replace visual operators with JS operators
  const sanitizedExpression = cleanExpression
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  
  try {
    // Use Function constructor to evaluate the expression
    // eslint-disable-next-line no-new-func
    return new Function(`return ${sanitizedExpression}`)();
  } catch (error) {
    console.error('Calculation error:', error);
    return 0;
  }
};

// Calculate percentage value
export const calculatePercentage = (base: number, percentage: number): number => {
  return (base * percentage) / 100;
};

// Calculate percentage operation
export const calculatePercentageOperation = (expression: string, percentage: number): number => {
  // Find the last number in the expression
  const matches = expression.match(/[-]?\d+\.?\d*$/);
  if (!matches) return 0;
  
  const lastNumber = parseFloat(matches[0]);
  const baseExpression = expression.slice(0, -matches[0].length).trim();
  
  if (!baseExpression) {
    // If there's no operation, just calculate percentage of the number
    return (lastNumber * percentage) / 100;
  }
  
  const operator = baseExpression.slice(-1);
  const baseNumber = calculate(baseExpression.slice(0, -1));
  
  switch (operator) {
    case '+':
      return baseNumber + ((baseNumber * percentage) / 100);
    case '-':
      return baseNumber - ((baseNumber * percentage) / 100);
    case '×':
    case '*':
      return baseNumber * (percentage / 100);
    case '÷':
    case '/':
      return baseNumber / (percentage / 100);
    default:
      return (lastNumber * percentage) / 100;
  }
};

// Calculate percentage difference between two numbers
export const calculatePercentageDifference = (fromAmount: number, toAmount: number): number => {
  if (fromAmount === 0) return 0;
  return ((toAmount - fromAmount) / fromAmount) * 100;
};

// EMI calculation
export const calculateEMI = (
  principalAmount: number,
  interestRate: number,
  tenureMonths: number
): { emi: number; totalInterest: number; totalPayment: number } => {
  // Convert annual interest rate to monthly
  const monthlyInterestRate = interestRate / (12 * 100);
  
  // Calculate EMI
  const emi = principalAmount * monthlyInterestRate * 
    Math.pow(1 + monthlyInterestRate, tenureMonths) / 
    (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
  
  // Calculate total payment and interest
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principalAmount;
  
  return {
    emi,
    totalInterest,
    totalPayment
  };
};

// Basic Calculator Component
const BasicCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
      setExpression(num);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    setDisplay(op);
    setExpression(expression + op);
  };

  const handleEquals = () => {
    try {
      const result = calculate(expression).toString();
      setDisplay(result);
      setExpression(result);
    } catch (error) {
      setDisplay('Error');
      setExpression('');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="text-right text-2xl font-mono">{display}</div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        <button onClick={handleClear} className="col-span-2 bg-red-500 text-white p-4 rounded hover:bg-red-600">
          AC
        </button>
        <button onClick={() => handleOperator('÷')} className="bg-gray-200 p-4 rounded hover:bg-gray-300">÷</button>
        <button onClick={() => handleOperator('×')} className="bg-gray-200 p-4 rounded hover:bg-gray-300">×</button>
        
        {[7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className="bg-gray-100 p-4 rounded hover:bg-gray-200"
          >
            {num}
          </button>
        ))}
        <button onClick={() => handleOperator('-')} className="bg-gray-200 p-4 rounded hover:bg-gray-300">-</button>
        
        {[4, 5, 6].map(num => (
          <button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className="bg-gray-100 p-4 rounded hover:bg-gray-200"
          >
            {num}
          </button>
        ))}
        <button onClick={() => handleOperator('+')} className="bg-gray-200 p-4 rounded hover:bg-gray-300">+</button>
        
        {[1, 2, 3].map(num => (
          <button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className="bg-gray-100 p-4 rounded hover:bg-gray-200"
          >
            {num}
          </button>
        ))}
        <button onClick={handleEquals} className="bg-blue-500 text-white p-4 rounded hover:bg-blue-600">=</button>
        
        <button
          onClick={() => handleNumber('0')}
          className="col-span-2 bg-gray-100 p-4 rounded hover:bg-gray-200"
        >
          0
        </button>
        <button
          onClick={() => handleNumber('.')}
          className="bg-gray-100 p-4 rounded hover:bg-gray-200"
        >
          .
        </button>
      </div>
    </div>
  );
};

export default BasicCalculator;