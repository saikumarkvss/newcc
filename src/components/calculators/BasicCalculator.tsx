import React, { useState } from 'react';
import { Clock, Trash2, Delete } from 'lucide-react';
import Button from '../ui/Button';
import { calculate, calculatePercentage } from '../../utils/calculations';
import { formatIndianNumber, numberToIndianWords, formatCalculation } from '../../utils/formatters';

const BasicCalculator: React.FC = () => {
  const [input, setInput] = useState<string>('0');
  const [calculation, setCalculation] = useState<string>('');
  const [result, setResult] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [history, setHistory] = useState<Array<{ calculation: string, result: number }>>([]);
  const [customPercentages, setCustomPercentages] = useState<number[]>([2, 1.8, 1.7]);
  const [editingPercentIndex, setEditingPercentIndex] = useState<number | null>(null);
  const [percentValue, setPercentValue] = useState<string>('');

  const clear = () => {
    setInput('0');
    setCalculation('');
    setResult(0);
    setShowResult(false);
  };

  const appendDigit = (digit: string) => {
    if (showResult) {
      setInput(digit);
      setCalculation('');
      setShowResult(false);
    } else {
      setInput(input === '0' ? digit : input + digit);
    }
  };

  const appendOperator = (operator: string) => {
    if (input === 'Error') return;

    let newCalc = calculation;
    
    if (showResult) {
      // Continue calculation with previous result
      newCalc = `${result}${operator}`;
    } else if (calculation.includes('=')) {
      // Start new calculation after equals
      newCalc = `${input}${operator}`;
    } else if (!calculation) {
      // First operator press
      newCalc = `${input}${operator}`;
    } else {
      // Calculate intermediate result
      const currentValue = parseFloat(input);
      const calcResult = calculate(calculation + currentValue);
      newCalc = `${calcResult}${operator}`;
      setResult(calcResult);
    }

    setCalculation(newCalc);
    setInput('0');
    setShowResult(false);
  };

  const appendDecimal = () => {
    if (!input.includes('.')) {
      setInput(input + '.');
    }
  };

  const toggleSign = () => {
    setInput(input.startsWith('-') ? input.slice(1) : '-' + input);
  };

  const handleBackspace = () => {
    setInput(input.length > 1 ? input.slice(0, -1) : '0');
  };

  const handlePercentage = (percentage: number) => {
    if (isNaN(percentage) || input === 'Error') return;

    const currentValue = parseFloat(input);
    if (isNaN(currentValue)) return;

    let resultValue: number;
    let calcStr: string;

    if (calculation.includes('+')) {
      // For addition: 1000 + 2% = 1000 + (1000 * 0.02) = 1020
      const baseValue = calculate(calculation.replace(/\+.*/, ''));
      const percentageAmount = calculatePercentage(baseValue, percentage);
      resultValue = baseValue + percentageAmount;
      calcStr = `${baseValue} + ${percentage}%`;
    } else if (calculation.includes('-')) {
      // For subtraction: 1000 - 2% = 1000 - (1000 * 0.02) = 980
      const baseValue = calculate(calculation.replace(/-.*/, ''));
      const percentageAmount = calculatePercentage(baseValue, percentage);
      resultValue = baseValue - percentageAmount;
      calcStr = `${baseValue} - ${percentage}%`;
    } else {
      // For standalone percentage: 1000 * 2% = 20
      resultValue = calculatePercentage(currentValue, percentage);
      calcStr = `${currentValue} × ${percentage}%`;
    }

    setResult(resultValue);
    setInput(resultValue.toString());
    setCalculation(calcStr + ' =');
    setShowResult(true);

    setHistory(prev => [{ calculation: calcStr + ' =', result: resultValue }, ...prev]);
  };

  const calculateResult = () => {
    try {
      if (!calculation) {
        // If no calculation, just show the input as result
        setResult(parseFloat(input));
        setInput(input);
        setShowResult(true);
        return;
      }

      if (calculation.includes('=')) {
        // If already calculated, do nothing
        return;
      }

      const expression = calculation + input;
      const calcResult = calculate(expression);

      setResult(calcResult);
      setCalculation(expression + ' =');
      setInput(calcResult.toString());
      setShowResult(true);

      setHistory(prev => [{ calculation: expression + ' =', result: calcResult }, ...prev]);
    } catch (error) {
      setInput('Error');
      setCalculation('');
      setShowResult(false);
    }
  };

  const startEditingPercent = (index: number) => {
    setEditingPercentIndex(index);
    setPercentValue(customPercentages[index].toString());
  };

  const saveCustomPercent = () => {
    if (editingPercentIndex !== null) {
      const newValue = parseFloat(percentValue);
      if (!isNaN(newValue)) {
        const updated = [...customPercentages];
        updated[editingPercentIndex] = newValue;
        setCustomPercentages(updated);
      }
      setEditingPercentIndex(null);
    }
  };

  const clearHistory = () => setHistory([]);

  const displayedValue = showResult ? result : parseFloat(input);
  const displayText = formatIndianNumber(displayedValue);
  const fullDisplayText = displayText.startsWith(',') ? '0' + displayText : displayText;

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-background animate-fade-in">
      {/* Calculator Screen */}
      <div className="calculator-screen p-4">
        <div className="flex flex-col items-end w-full">
          <div className="text-text-secondary text-sm h-5 mb-1 min-h-[20px]">
            {formatCalculation(calculation)}
          </div>
          <div className="text-4xl font-bold text-text-primary mb-2 break-all text-right">
            {fullDisplayText}
          </div>
          <div className="text-text-secondary text-xs mb-3 min-h-[16px]">
            {numberToIndianWords(displayedValue)}
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="text" onClick={() => setShowHistory(!showHistory)} className="text-sm">
            <Clock size={16} className="mr-1" />
            {showHistory ? 'Hide History' : 'Show History'}
          </Button>
        </div>
      </div>

      {/* History */}
      {showHistory && (
        <div className="bg-background-light p-4 max-h-60 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">Calculation History</h3>
            <Button variant="text" onClick={clearHistory} className="text-xs">
              <Trash2 size={14} className="mr-1" />
              Clear
            </Button>
          </div>
          {history.length === 0 ? (
            <p className="text-text-secondary text-sm">No calculations yet.</p>
          ) : (
            <div className="space-y-2">
              {history.map((item, index) => (
                <div key={index} className="border-b border-background pb-2">
                  <div className="text-xs text-text-secondary">{formatCalculation(item.calculation)}</div>
                  <div className="text-md font-medium">{formatIndianNumber(item.result)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Custom Percentage Buttons */}
      <div className="grid grid-cols-3 gap-1 p-4 bg-background border-t border-background-light">
        {customPercentages.map((percent, index) => (
          <div key={index} className="relative">
            {editingPercentIndex === index ? (
              <div className="flex">
                <input
                  type="number"
                  value={percentValue}
                  onChange={(e) => setPercentValue(e.target.value)}
                  className="w-full p-2 bg-background-light rounded-l-button text-text-primary text-center"
                  autoFocus
                />
                <button
                  onClick={saveCustomPercent}
                  className="bg-primary px-2 rounded-r-button"
                >
                  ✓
                </button>
              </div>
            ) : (
              <Button
                onClick={() => handlePercentage(percent)}
                className="w-full h-16"
                variant="primary"
              >
                {percent}%
                <span
                  className="absolute top-1 right-1 text-xs opacity-70 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditingPercent(index);
                  }}
                >
                  ✎
                </span>
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-background">
        <Button onClick={clear}>C</Button>
        <Button onClick={handleBackspace}><Delete size={20} /></Button>
        <Button onClick={() => handlePercentage(100)}>%</Button>
        <Button onClick={() => appendOperator('÷')} variant="primary">÷</Button>

        <Button onClick={() => appendDigit('7')}>7</Button>
        <Button onClick={() => appendDigit('8')}>8</Button>
        <Button onClick={() => appendDigit('9')}>9</Button>
        <Button onClick={() => appendOperator('×')} variant="primary">×</Button>

        <Button onClick={() => appendDigit('4')}>4</Button>
        <Button onClick={() => appendDigit('5')}>5</Button>
        <Button onClick={() => appendDigit('6')}>6</Button>
        <Button onClick={() => appendOperator('-')} variant="primary">-</Button>

        <Button onClick={() => appendDigit('1')}>1</Button>
        <Button onClick={() => appendDigit('2')}>2</Button>
        <Button onClick={() => appendDigit('3')}>3</Button>
        <Button onClick={() => appendOperator('+')} variant="primary">+</Button>

        <Button onClick={() => appendDigit('0')} variant="wide" className="col-span-2">0</Button>
        <Button onClick={appendDecimal}>.</Button>
        <Button onClick={calculateResult} variant="primary">=</Button>
      </div>
    </div>
  );
};

export default BasicCalculator;
