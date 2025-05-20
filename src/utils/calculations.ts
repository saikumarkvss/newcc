// Basic calculator operations
export const calculate = (expression: string): number => {
  if (!expression) return 0;
  
  // Handle percentage calculations
  if (expression.includes('%')) {
    const parts = expression.split('%');
    if (parts.length === 2) {
      const baseExpression = parts[0].trim();
      if (baseExpression.includes('-')) {
        const [base, percentage] = baseExpression.split('-').map(part => parseFloat(part.trim()));
        return base - (base * (percentage / 100));
      }
      // Add other percentage operations as needed
    }
    return 0;
  }
  
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
  tenureMonths: number,
  isFlat: boolean = false
): { emi: number; totalInterest: number; totalPayment: number } => {
  if (isFlat) {
    const totalInterest = (principalAmount * interestRate * tenureMonths) / (12 * 100);
    const totalPayment = principalAmount + totalInterest;
    const emi = totalPayment / tenureMonths;
    
    return {
      emi,
      totalInterest,
      totalPayment
    };
  }
  
  // Reducing balance method
  const monthlyInterestRate = interestRate / (12 * 100);
  const emi = principalAmount * monthlyInterestRate * 
    Math.pow(1 + monthlyInterestRate, tenureMonths) / 
    (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
  
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principalAmount;
  
  return {
    emi,
    totalInterest,
    totalPayment
  };
};