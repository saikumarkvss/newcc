// Basic calculator operations
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
  // Find the last number and operator in the expression
  const matches = expression.match(/([-+×÷])?(\d+\.?\d*)$/);
  if (!matches) return 0;
  
  const operator = matches[1] || '';
  const lastNumber = parseFloat(matches[2]);
  const baseExpression = expression.slice(0, -matches[0].length).trim();
  
  if (!baseExpression) {
    // If there's no operation, just calculate percentage of the number
    return (lastNumber * percentage) / 100;
  }
  
  const baseNumber = calculate(baseExpression);
  const percentageValue = (lastNumber * percentage) / 100;
  
  switch (operator) {
    case '+':
      return baseNumber + percentageValue;
    case '-':
      return baseNumber - percentageValue;
    case '×':
      return baseNumber * (percentage / 100);
    case '÷':
      return baseNumber / (percentage / 100);
    default:
      return percentageValue;
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
  type: 'reducing' | 'flat' = 'reducing'
): { 
  emi: number; 
  totalInterest: number; 
  totalPayment: number;
  schedule: Array<{
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
} => {
  let emi: number;
  let totalInterest: number;
  let totalPayment: number;
  let schedule = [];

  if (type === 'reducing') {
    // Convert annual interest rate to monthly
    const monthlyInterestRate = interestRate / (12 * 100);
    
    // Calculate EMI
    emi = principalAmount * monthlyInterestRate * 
      Math.pow(1 + monthlyInterestRate, tenureMonths) / 
      (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
    
    // Generate amortization schedule
    let remainingBalance = principalAmount;
    for (let month = 1; month <= tenureMonths; month++) {
      const monthlyInterest = remainingBalance * monthlyInterestRate;
      const monthlyPrincipal = emi - monthlyInterest;
      remainingBalance = Math.max(0, remainingBalance - monthlyPrincipal);
      
      schedule.push({
        month,
        emi,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        balance: remainingBalance
      });
    }
  } else {
    // Flat rate calculation
    const yearlyInterest = principalAmount * (interestRate / 100);
    const totalInterestAmount = yearlyInterest * (tenureMonths / 12);
    const monthlyPrincipal = principalAmount / tenureMonths;
    const monthlyInterest = totalInterestAmount / tenureMonths;
    emi = monthlyPrincipal + monthlyInterest;
    
    let remainingBalance = principalAmount;
    for (let month = 1; month <= tenureMonths; month++) {
      remainingBalance = Math.max(0, remainingBalance - monthlyPrincipal);
      schedule.push({
        month,
        emi,
        principal: monthlyPrincipal,
        interest: monthlyInterest,
        balance: remainingBalance
      });
    }
  }
  
  totalPayment = emi * tenureMonths;
  totalInterest = totalPayment - principalAmount;
  
  return {
    emi,
    totalInterest,
    totalPayment,
    schedule
  };
};