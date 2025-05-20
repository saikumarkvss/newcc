import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import Button from '../ui/Button';
import { calculate, calculatePercentageOperation } from '../../utils/calculations';
import { formatIndianNumber, numberToIndianWords, formatCalculation } from '../../utils/formatters';

const BasicCalculator: React.FC = () => {
  const [primaryDisplay, setPrimaryDisplay] = useState<string>('0');
  const [secondaryDisplay, setSecondaryDisplay] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [lastResult, setLastResult] = useState<string>('');
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const customPercentages = [
    { value: 2, label: '2%' },
    { value: 1.8, label: '1.8%' },
    { value: 1.7, label: '1.7%' }
  ];

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setPrimaryDisplay(num);
      setSecondaryDisplay('');
      setShouldResetDisplay(false);
    } else {
      setPrimaryDisplay(primaryDisplay === '0' ? num : primaryDisplay + num);
    }
  };

  const handleOperator = (op: string) => {
    if (shouldResetDisplay && lastResult) {
      setSecondaryDisplay(lastResult + ' ' + op + ' ');
      setPrimaryDisplay('0');
      setShouldResetDisplay(false);
    } else {
      const newExpression = primaryDisplay + ' ' + op + ' ';
      setSecondaryDisplay(newExpression);
      setPrimaryDisplay('0');
    }
  };

  const handlePercentage = (percentage?: number) => {
    const expression = secondaryDisplay + primaryDisplay;
    if (!expression) return;

    let result: number;
    if (percentage !== undefined) {
      // Custom percentage button
      result = calculatePercentageOperation(expression, percentage);
      setSecondaryDisplay(`${expression} ${percentage}% = `);
    } else {
      // Regular percentage button
      const value = parseFloat(primaryDisplay);
      result = value / 100;
      setSecondaryDisplay(`${expression}% = `);
    }

    setPrimaryDisplay(result.toString());
    setLastResult(result.toString());
    setShouldResetDisplay(true);
    setHistory([`${secondaryDisplay}${primaryDisplay} = ${result}`, ...history]);
  };

  const handleEquals = () => {
    if (!secondaryDisplay) return;

    const expression = secondaryDisplay + primaryDisplay;
    const result = calculate(expression);
    
    setSecondaryDisplay(expression + ' = ');
    setPrimaryDisplay(result.toString());
    setLastResult(result.toString());
    setShouldResetDisplay(true);
    setHistory([`${expression} = ${result}`, ...history]);
  };

  const handleClear = () => {
    setPrimaryDisplay('0');
    setSecondaryDisplay('');
    setLastResult('');
    setShouldResetDisplay(false);
  };

  const handleBackspace = () => {
    setPrimaryDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-background-light animate-fade-in">
      {/* Calculator Display */}
      <div className="calculator-screen">
        <div className="text-text-secondary text-right text-sm mb-2 min-h-[20px]">
          {formatCalculation(secondaryDisplay)}
        </div>
        <div className="text-4xl font-bold mb-1">
          {formatIndianNumber(parseFloat(primaryDisplay) || 0)}
        </div>
        <div className="text-text-secondary text-sm">
          {numberToIndianWords(parseFloat(primaryDisplay) || 0)}
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="absolute bottom-4 left-4 text-primary hover:text-primary-light"
        >
          <History size={20} />
        </button>
      </div>

      {/* Custom Percentage Buttons */}
      <div className="grid grid-cols-3 gap-3 p-4 bg-background">
        {customPercentages.map((percent) => (
          <Button
            key={percent.value}
            onClick={() => handlePercentage(percent.value)}
            variant="primary"
          >
            {percent.label}
          </Button>
        ))}
      </div>

      {/* Calculator Keypad */}
      <div className="calculator-keypad">
        <Button onClick={handleClear}>C</Button>
        <Button onClick={handleBackspace}>⌫</Button>
        <Button onClick={() => handlePercentage()}>%</Button>
        <Button onClick={() => handleOperator('÷')} variant="primary">÷</Button>

        <Button onClick={() => handleNumber('7')}>7</Button>
        <Button onClick={() => handleNumber('8')}>8</Button>
        <Button onClick={() => handleNumber('9')}>9</Button>
        <Button onClick={() => handleOperator('×')} variant="primary">×</Button>

        <Button onClick={() => handleNumber('4')}>4</Button>
        <Button onClick={() => handleNumber('5')}>5</Button>
        <Button onClick={() => handleNumber('6')}>6</Button>
        <Button onClick={() => handleOperator('-')} variant="primary">-</Button>

        <Button onClick={() => handleNumber('1')}>1</Button>
        <Button onClick={() => handleNumber('2')}>2</Button>
        <Button onClick={() => handleNumber('3')}>3</Button>
        <Button onClick={() => handleOperator('+')} variant="primary">+</Button>

        <Button onClick={() => handleNumber('0')} className="col-span-2">0</Button>
        <Button onClick={() => handleNumber('.')}>.</Button>
        <Button onClick={handleEquals} variant="primary">=</Button>
      </div>

      {/* History Panel */}
      {showHistory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute inset-0 bg-background z-10 p-4 custom-scrollbar overflow-y-auto"
        >
          <h3 className="text-xl font-bold mb-4">Calculation History</h3>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div
                key={index}
                className="bg-background-light p-3 rounded-lg text-right"
              >
                {formatCalculation(item)}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BasicCalculator;