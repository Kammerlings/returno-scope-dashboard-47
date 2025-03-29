
// Helper function to get date labels based on timeframe
const getDateLabels = (timeframe: string): string[] => {
  const now = new Date();
  const labels: string[] = [];
  
  switch (timeframe) {
    case '1M':
      // Daily labels for one month
      for (let i = 30; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      break;
    case '3M':
      // Weekly labels for three months
      for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - (i * 7));
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      break;
    case '6M':
      // Bi-weekly labels for six months
      for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setDate(now.getDate() - (i * 14));
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      }
      break;
    case '1Y':
      // Monthly labels for one year
      for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
      break;
    case '5Y':
      // Quarterly labels for five years
      for (let i = 20; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - (i * 3));
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
      break;
    case 'ALL':
      // Yearly labels for all time (using 10 years for demo)
      for (let i = 10; i >= 0; i--) {
        const date = new Date();
        date.setFullYear(now.getFullYear() - i);
        labels.push(date.getFullYear().toString());
      }
      break;
    default:
      // Default to 1Y
      for (let i = 12; i >= 0; i--) {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
      }
  }
  
  return labels;
};

// Generate random walk with trend
const generateRandomWalk = (length: number, initialValue: number, trend: number = 0.005, volatility: number = 0.02): number[] => {
  const values: number[] = [initialValue];
  
  for (let i = 1; i < length; i++) {
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    const trendFactor = trend; // Positive trend
    const previousValue = values[i - 1];
    const newValue = previousValue * (1 + trendFactor + randomFactor);
    values.push(Math.max(newValue, initialValue * 0.5)); // Prevent extremely low values
  }
  
  return values;
};

// Generate portfolio data with random walk for demo
export const generatePortfolioData = (timeframe: string) => {
  const dateLabels = getDateLabels(timeframe);
  const valueSeries = generateRandomWalk(dateLabels.length, 100000, 0.01, 0.03);
  
  return dateLabels.map((date, index) => ({
    date,
    value: Math.round(valueSeries[index]),
  }));
};

// Generate asset allocation for demo
export const generateAssetAllocation = () => {
  return [
    { name: "US Stocks", value: 42500 },
    { name: "Int'l Stocks", value: 25000 },
    { name: "Bonds", value: 35000 },
    { name: "Real Estate", value: 12500 },
    { name: "Commodities", value: 7500 },
    { name: "Cash", value: 10000 },
  ];
};

// Generate performance metrics for demo
export const generatePerformanceMetrics = () => {
  // Generate random monthly returns
  const monthlyReturns = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ].map(month => ({
    month,
    return: (Math.random() * 10) - 4 // Random returns between -4% and 6%
  }));
  
  // Simple metrics
  const returns = monthlyReturns.map(item => item.return);
  const annualReturn = returns.reduce((a, b) => a + b, 0);
  const volatility = Math.sqrt(returns.reduce((a, b) => a + (b * b), 0) / returns.length);
  const sharpeRatio = annualReturn / volatility;
  const maxDrawdown = Math.min(...returns);
  
  return {
    monthlyReturns,
    metrics: [
      { name: "Annual Return", value: `${annualReturn.toFixed(2)}%` },
      { name: "Volatility", value: `${volatility.toFixed(2)}%` },
      { name: "Sharpe Ratio", value: sharpeRatio.toFixed(2) },
      { name: "Max Drawdown", value: `${maxDrawdown.toFixed(2)}%` }
    ]
  };
};

// Generate forecast data for demo
export const generateForecastData = () => {
  const now = new Date();
  const dateLabels: string[] = [];
  
  // Historical data (past 6 months)
  for (let i = 6; i > 0; i--) {
    const date = new Date();
    date.setMonth(now.getMonth() - i);
    dateLabels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  }
  
  // Current month
  dateLabels.push(now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  
  // Forecast data (next 12 months)
  for (let i = 1; i <= 12; i++) {
    const date = new Date();
    date.setMonth(now.getMonth() + i);
    dateLabels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
  }
  
  // Generate historical values
  const initialValue = 100000;
  const historicalValues = generateRandomWalk(7, initialValue, 0.01, 0.03);
  
  // Generate forecast values with slightly higher volatility
  const lastHistoricalValue = historicalValues[historicalValues.length - 1];
  const forecastValues = generateRandomWalk(12, lastHistoricalValue, 0.008, 0.04);
  
  // Combined data
  const forecastData = dateLabels.map((date, index) => {
    // First 7 points are historical
    if (index < 7) {
      return {
        date,
        historical: Math.round(historicalValues[index]),
        forecast: null,
        upperBound: null,
        lowerBound: null
      };
    } else {
      // Forecast points with confidence intervals
      const forecastIndex = index - 7;
      const forecastValue = Math.round(forecastValues[forecastIndex]);
      const confidence = 0.1 + (forecastIndex * 0.015); // Increasing confidence band over time
      
      return {
        date,
        historical: null,
        forecast: forecastValue,
        upperBound: Math.round(forecastValue * (1.0 + confidence)),
        lowerBound: Math.round(forecastValue * (1.0 - confidence))
      };
    }
  });
  
  // Scenario analysis
  const scenarioAnalysis = [
    {
      name: "Base Case",
      description: "Expected market conditions with moderate growth",
      expectedReturn: 8.5,
      probability: 60
    },
    {
      name: "Bull Market",
      description: "Strong economic growth and positive market sentiment",
      expectedReturn: 15.3,
      probability: 20
    },
    {
      name: "Bear Market",
      description: "Economic downturn with significant market correction",
      expectedReturn: -12.7,
      probability: 15
    },
    {
      name: "Stagflation",
      description: "High inflation with economic stagnation",
      expectedReturn: -5.2,
      probability: 5
    }
  ];
  
  return { forecastData, scenarioAnalysis };
};
