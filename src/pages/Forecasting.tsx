
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart, ComposedChart, Bar, Scatter, ScatterChart, ZAxis } from "recharts";
import { useState } from "react";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";

// Mock forecast data - this would come from an API in a real application
const generateForecastData = (timeframe: string) => {
  // Generate historical + forecast data based on timeframe
  const multiplier = timeframe === "1M" ? 30 : 
                    timeframe === "3M" ? 90 : 
                    timeframe === "6M" ? 180 : 
                    timeframe === "1Y" ? 365 : 
                    timeframe === "5Y" ? 1825 : 2500;
                    
  const dataPoints = timeframe === "1M" ? 30 : 
                    timeframe === "3M" ? 45 : 
                    timeframe === "6M" ? 60 : 
                    timeframe === "1Y" ? 72 : 
                    timeframe === "5Y" ? 90 : 120;
  
  // The historical part (2/3 of data points)
  const historicalPoints = Math.floor(dataPoints * 2/3);
  
  const data = [];
  const startValue = 100;
  let currentValue = startValue;
  
  // Create past data with some volatility
  for (let i = 0; i < historicalPoints; i++) {
    const randomChange = (Math.random() - 0.48) * 5; // Slightly positive bias
    currentValue = Math.max(currentValue + randomChange, 10); // Ensure minimum value
    
    data.push({
      day: -1 * (historicalPoints - i),
      actual: parseFloat(currentValue.toFixed(2)),
      monteCarlo: null,
      arima: null,
      regression: null,
      volatility: parseFloat((Math.random() * 3 + 1).toFixed(2))
    });
  }
  
  // Now add forecast data
  const forecastPoints = dataPoints - historicalPoints;
  
  // ARIMA tends to continue the trend but with increasing uncertainty
  let arimaValue = currentValue;
  // Regression tends to smooth to the mean
  let regressionValue = currentValue;
  // Monte Carlo simulates many possible paths
  let monteCarloValues = Array(5).fill(currentValue);
  
  for (let i = 0; i < forecastPoints; i++) {
    // ARIMA forecast with increasing confidence interval
    const arimaChange = (Math.random() - 0.48) * 5; // Similar to historical pattern
    arimaValue = Math.max(arimaValue + arimaChange, 10);
    
    // Linear regression forecast (more conservative)
    const regressionChange = (startValue * 1.2 - regressionValue) * 0.02; // Tends toward 120% of start value
    regressionValue = regressionValue + regressionChange;
    
    // Monte Carlo - multiple possible paths
    monteCarloValues = monteCarloValues.map(val => {
      const mcChange = (Math.random() - 0.5) * 8; // More volatile
      return Math.max(val + mcChange, 10);
    });
    
    // Get an average for the main chart
    const monteCarloAvg = monteCarloValues.reduce((sum, val) => sum + val, 0) / monteCarloValues.length;
    
    data.push({
      day: i + 1,
      actual: null,
      monteCarlo: parseFloat(monteCarloAvg.toFixed(2)),
      arima: parseFloat(arimaValue.toFixed(2)),
      regression: parseFloat(regressionValue.toFixed(2)),
      volatility: parseFloat((Math.random() * 3 + 2).toFixed(2)) // Increasing volatility in the future
    });
  }
  
  return data;
};

// Monte Carlo simulation data (multiple paths)
const generateMonteCarloData = (timeframe: string) => {
  const paths = 50; // Number of simulation paths
  const dataPoints = timeframe === "1M" ? 30 : 
                    timeframe === "3M" ? 45 : 
                    timeframe === "6M" ? 60 : 
                    timeframe === "1Y" ? 72 : 
                    timeframe === "5Y" ? 90 : 120;
  
  // The historical part (2/3 of data points)
  const historicalPoints = Math.floor(dataPoints * 2/3);
  const forecastPoints = dataPoints - historicalPoints;
  
  // Start all paths from the same value
  const startValue = 100;
  
  const simulationPaths = [];
  
  for (let path = 0; path < paths; path++) {
    let currentValue = startValue;
    const pathData = [];
    
    // Skip historical part
    // Only generate forecast points
    for (let i = 0; i < forecastPoints; i++) {
      const volatility = 0.02 + (Math.random() * 0.03); // Different volatility for each path
      const drift = 0.001 + (Math.random() * 0.002); // Different drift for each path
      
      // Geometric Brownian Motion formula (simplified)
      const change = currentValue * (drift + volatility * (Math.random() * 2 - 1));
      currentValue = Math.max(currentValue + change, 10);
      
      pathData.push({
        day: i + 1,
        value: parseFloat(currentValue.toFixed(2))
      });
    }
    
    simulationPaths.push({
      id: path,
      data: pathData
    });
  }
  
  // Flatten the data for the chart (creating percentiles)
  const flatData = [];
  
  for (let day = 1; day <= forecastPoints; day++) {
    const dayValues = simulationPaths.map(path => 
      path.data.find(d => d.day === day)?.value || 0
    ).sort((a, b) => a - b);
    
    const p10 = dayValues[Math.floor(dayValues.length * 0.1)];
    const p25 = dayValues[Math.floor(dayValues.length * 0.25)];
    const p50 = dayValues[Math.floor(dayValues.length * 0.5)];
    const p75 = dayValues[Math.floor(dayValues.length * 0.75)];
    const p90 = dayValues[Math.floor(dayValues.length * 0.9)];
    
    flatData.push({
      day,
      p10,
      p25,
      p50,
      p75,
      p90
    });
  }
  
  return flatData;
};

const Forecasting = () => {
  const [timeframe, setTimeframe] = useState("1Y");
  const [forecastType, setForecastType] = useState("combined");
  
  const forecastData = generateForecastData(timeframe);
  const monteCarloData = generateMonteCarloData(timeframe);
  
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Advanced Forecasting</h1>
          <TimeframeSelector selected={timeframe} onSelect={handleTimeframeChange} />
        </div>
        
        <Tabs defaultValue="combined">
          <TabsList className="mb-4">
            <TabsTrigger 
              value="combined" 
              onClick={() => setForecastType("combined")}
            >
              Combined Methods
            </TabsTrigger>
            <TabsTrigger 
              value="monteCarlo" 
              onClick={() => setForecastType("monteCarlo")}
            >
              Monte Carlo Simulation
            </TabsTrigger>
            <TabsTrigger 
              value="arima" 
              onClick={() => setForecastType("arima")}
            >
              ARIMA Model
            </TabsTrigger>
            <TabsTrigger 
              value="regression" 
              onClick={() => setForecastType("regression")}
            >
              Regression Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="combined">
            <Card>
              <CardHeader>
                <CardTitle>Comparison of Forecasting Methods</CardTitle>
                <CardDescription>
                  Displaying multiple forecasting methodologies side by side for comparison
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="day" 
                        label={{ value: 'Days (Past/Future)', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis 
                        label={{ value: 'Value', angle: -90, position: 'insideLeft' }} 
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (value === null) return ['-', name];
                          return [`${value}`, name];
                        }}
                        labelFormatter={(label) => `Day ${label} ${parseInt(label) < 0 ? '(Past)' : '(Forecast)'}` }
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#4f46e5" 
                        name="Historical" 
                        strokeWidth={2}
                        dot={{ r: 1 }}
                        activeDot={{ r: 5 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="monteCarlo" 
                        stroke="#f97316" 
                        name="Monte Carlo" 
                        strokeDasharray="5 5"
                        dot={{ r: 1 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="arima" 
                        stroke="#16a34a" 
                        name="ARIMA" 
                        strokeDasharray="3 3"
                        dot={{ r: 1 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="regression" 
                        stroke="#8884d8" 
                        name="Regression" 
                        strokeDasharray="1 1"
                        dot={{ r: 1 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Metrics</CardTitle>
                  <CardDescription>Key metrics for the different forecasting models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">Monte Carlo Simulation</h3>
                      <p className="text-sm text-muted-foreground">
                        Uses random sampling to model probability of different outcomes. Best for understanding possible scenarios and their probability.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">ARIMA Model</h3>
                      <p className="text-sm text-muted-foreground">
                        Autoregressive Integrated Moving Average. Focuses on trends and cycles in the data to make short-term forecasts.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Regression Analysis</h3>
                      <p className="text-sm text-muted-foreground">
                        Uses statistical approach to find relationships between variables. Best for understanding fundamental factors driving returns.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Volatility</CardTitle>
                  <CardDescription>Expected volatility in the forecast period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData.filter(d => d.day >= 0)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 6]} />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Volatility']}
                          labelFormatter={(label) => `Day ${label} (Forecast)`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="volatility" 
                          fill="#8884d8" 
                          stroke="#8884d8"
                          name="Volatility"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="monteCarlo">
            <Card>
              <CardHeader>
                <CardTitle>Monte Carlo Simulation</CardTitle>
                <CardDescription>
                  Probabilistic model using thousands of random simulations to forecast potential outcomes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monteCarloData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="day" 
                        label={{ value: 'Days (Future)', position: 'insideBottom', offset: -5 }} 
                      />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip 
                        formatter={(value) => [`${value}`, '']}
                        labelFormatter={(label) => `Day ${label} (Forecast)`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="p90" 
                        stackId="1" 
                        stroke="#e2e8f0" 
                        fill="#e2e8f0" 
                        name="90th Percentile"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="p75" 
                        stackId="1" 
                        stroke="#cbd5e1" 
                        fill="#cbd5e1" 
                        name="75th Percentile"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="p50" 
                        stackId="1" 
                        stroke="#94a3b8" 
                        fill="#94a3b8" 
                        name="Median"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="p25" 
                        stackId="1" 
                        stroke="#64748b" 
                        fill="#64748b" 
                        name="25th Percentile"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="p10" 
                        stackId="1" 
                        stroke="#475569" 
                        fill="#475569" 
                        name="10th Percentile"
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Monte Carlo Simulation Explanation</h3>
                  <p className="text-sm text-muted-foreground">
                    Monte Carlo simulations generate thousands of potential future price paths based on historical volatility and returns. 
                    The shaded areas represent different confidence levels - from the 10th percentile (worst case) to the 90th percentile (best case). 
                    This approach is particularly useful for understanding the range of possible outcomes and their probabilities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="arima">
            <Card>
              <CardHeader>
                <CardTitle>ARIMA Model Forecast</CardTitle>
                <CardDescription>
                  Autoregressive Integrated Moving Average model for time series forecasting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (value === null) return ['-', name];
                          return [`${value}`, name];
                        }}
                        labelFormatter={(label) => `Day ${label} ${parseInt(label) < 0 ? '(Past)' : '(Forecast)'}` }
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#4f46e5" 
                        name="Historical" 
                        strokeWidth={2}
                        dot={{ r: 1 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="arima" 
                        stroke="#16a34a" 
                        name="ARIMA Forecast" 
                        strokeWidth={2}
                        dot={{ r: 1 }}
                      />
                      {/* Add confidence intervals for ARIMA */}
                      <Area
                        type="monotone"
                        dataKey="arima"
                        stroke="none"
                        fill="#16a34a"
                        fillOpacity={0.1}
                        name="Confidence Interval"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">ARIMA Model Explanation</h3>
                  <p className="text-sm text-muted-foreground">
                    ARIMA (Autoregressive Integrated Moving Average) models are statistical models that use time series data to predict future values.
                    They are especially good at capturing trends, seasonality, and cycles in the data. The model examines past values and past errors
                    to predict future values. ARIMA models are particularly useful for short to medium-term forecasting.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="regression">
            <Card>
              <CardHeader>
                <CardTitle>Regression Analysis</CardTitle>
                <CardDescription>
                  Statistical approach to modeling relationships between variables
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip 
                        formatter={(value, name) => {
                          if (value === null) return ['-', name];
                          return [`${value}`, name];
                        }}
                        labelFormatter={(label) => `Day ${label} ${parseInt(label) < 0 ? '(Past)' : '(Forecast)'}` }
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#4f46e5" 
                        name="Historical" 
                        strokeWidth={2}
                        dot={{ r: 1 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="regression" 
                        stroke="#8884d8" 
                        name="Regression Forecast" 
                        strokeWidth={2}
                        dot={{ r: 1 }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Regression Analysis Explanation</h3>
                  <p className="text-sm text-muted-foreground">
                    Regression analysis is a statistical method used to model relationships between variables. 
                    For financial forecasting, regression models can identify how factors like economic indicators, 
                    interest rates, or market sentiment affect asset prices. These models are useful for understanding 
                    the underlying drivers of performance and can provide longer-term forecasts based on expected changes 
                    in these factors.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Forecasting;
