import React, { useState } from 'react';
import { Clock, Trash2, Delete } from 'lucide-react';
import Button from '../ui/Button';
import { calculate, calculatePercentageOperation } from '../../utils/calculations';
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
      setCalculation(result + '');
      setShowResult(false);
    } else {
      setInput(input === '0' ? digit : input + digit);
    }
  };

  const appendOperator = (operator: string) => {
    if (input === 'Error') return;

    const currentValue = showResult ? result : parseFloat(input);
    const newCalc = calculation + (showResult ? '' : input) + ' ' + operator + ' ';
    
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
    if (showResult) return;
    setInput(input.length > 1 ? input.slice(0, -1) : '0');
  };

  const handlePercentage = (percentage: number) => {
    if (isNaN(percentage) || input === 'Error') return;

    const expr = calculation + input;
    const result = calculatePercentageOperation(expr, percentage);
    const calcStr = `${expr} ${percentage}%`;

    setResult(result);
    setInput(result.toString());
    setCalculation(calcStr + ' =');
    setShowResult(true);
    setHistory(prev => [{ calculation: calcStr + ' =', result }, ...prev]);
  };

  const calculateResult = () => {
    try {
      if (!calculation && input === '0') {
        return;
      }

      const expr = calculation + input;
      if (expr.endsWith('=')) {
        return;
      }

      const calcResult = calculate(expr);
      const fullCalculation = expr + ' =';

      setResult(calcResult);
      setCalculation(fullCalculation);
      setInput(calcResult.toString());
      setShowResult(true);
      setHistory(prev => [{ calculation: fullCalculation, result: calcResult }, ...prev]);
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

  const displayedValue = showResult ? result : parseFloat(input) || 0;
  const displayText = formatIndianNumber(displayedValue);

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-background animate-fade-in">
      {/* Calculator Screen */}
      <div className="calculator-screen p-4">
        <div className="flex flex-col items-end w-full">
          <div className="text-text-secondary text-sm h-5 mb-1 min-h-[20px] overflow-x-auto whitespace-nowrap custom-scrollbar w-full text-right">
            {formatCalculation(calculation)}
          </div>
          <div className="text-4xl font-bold text-text-primary mb-2 break-all text-right">
            {displayText}
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
                  <div className="text-xs text-text-secondary overflow-x-auto whitespace-nowrap custom-scrollbar">
                    {formatCalculation(item.calculation)}
                  </div>
                  <div className="text-md font-medium">{formatIndianNumber(item.result)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Custom Percentage Buttons */}
      <div className="grid grid-cols-3 gap-[1px] p-1 bg-background">
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
      <div className="grid grid-cols-4 gap-[1px] p-1 bg-background">
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
