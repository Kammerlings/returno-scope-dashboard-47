
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ComposedChart, Line, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Scatter, LineChart } from 'recharts';
import { Info, AlertCircle } from "lucide-react";
import { useState } from "react";

// Sample data for charts
const generateChartData = () => {
  const baseData = [
    { date: '2023-01-01', price: 150 },
    { date: '2023-01-15', price: 145 },
    { date: '2023-02-01', price: 160 },
    { date: '2023-02-15', price: 165 },
    { date: '2023-03-01', price: 155 },
    { date: '2023-03-15', price: 170 },
    { date: '2023-04-01', price: 175 },
    { date: '2023-04-15', price: 185 },
    { date: '2023-05-01', price: 180 },
    { date: '2023-05-15', price: 190 },
    { date: '2023-06-01', price: 200 },
    { date: '2023-06-15', price: 195 },
    { date: '2023-07-01', price: 210 },
    { date: '2023-07-15', price: 205 },
    { date: '2023-08-01', price: 220 },
    { date: '2023-08-15', price: 215 },
    { date: '2023-09-01', price: 225 },
    { date: '2023-09-15', price: 235 },
    { date: '2023-10-01', price: 230 },
    { date: '2023-10-15', price: 240 },
    { date: '2023-11-01', price: 250 },
    { date: '2023-11-15', price: 245 },
    { date: '2023-12-01', price: 255 },
    { date: '2023-12-15', price: 260 },
    { date: '2024-01-01', price: 265 },
    { date: '2024-01-15', price: 270 },
    { date: '2024-02-01', price: 260 },
    { date: '2024-02-15', price: 275 },
    { date: '2024-03-01', price: 280 },
    { date: '2024-03-15', price: 275 },
    { date: '2024-04-01', price: 290 },
    { date: '2024-04-15', price: 285 },
    { date: '2024-05-01', price: 295 },
  ];
  
  // Calculate volume with some randomness
  const withVolume = baseData.map(item => {
    const volumeBase = item.price * 1000;
    const volumeRandomness = Math.random() * volumeBase * 0.3;
    return {
      ...item,
      volume: Math.round(volumeBase + volumeRandomness)
    };
  });
  
  // Calculate moving averages
  const withMA = withVolume.map((item, index, array) => {
    // SMA-20
    let sma20 = null;
    if (index >= 19) {
      sma20 = array.slice(index - 19, index + 1).reduce((sum, curr) => sum + curr.price, 0) / 20;
    }
    
    // SMA-50
    let sma50 = null;
    if (index >= 49) {
      sma50 = array.slice(index - 49, index + 1).reduce((sum, curr) => sum + curr.price, 0) / 50;
    }
    
    // Calculate MACD (12,26,9)
    let ema12 = null;
    let ema26 = null;
    let macd = null;
    
    // Simple approximation for demo
    if (index >= 11) {
      ema12 = array.slice(index - 11, index + 1).reduce((sum, curr) => sum + curr.price, 0) / 12;
    }
    
    if (index >= 25) {
      ema26 = array.slice(index - 25, index + 1).reduce((sum, curr) => sum + curr.price, 0) / 26;
      if (ema12) {
        macd = ema12 - ema26;
      }
    }
    
    // Calculate RSI (14)
    let rsi = null;
    if (index >= 14) {
      const changes = [];
      for (let i = index - 13; i <= index; i++) {
        changes.push(array[i].price - array[i-1].price);
      }
      
      const gains = changes.filter(c => c > 0).reduce((sum, c) => sum + c, 0) / 14;
      const losses = changes.filter(c => c < 0).reduce((sum, c) => sum + Math.abs(c), 0) / 14;
      
      if (losses === 0) {
        rsi = 100;
      } else {
        const rs = gains / losses;
        rsi = 100 - (100 / (1 + rs));
      }
    }
    
    // Calculate Bollinger Bands (20, 2)
    let upperBand = null;
    let lowerBand = null;
    
    if (index >= 19) {
      const slice = array.slice(index - 19, index + 1);
      const avg = slice.reduce((sum, curr) => sum + curr.price, 0) / 20;
      const stdDev = Math.sqrt(
        slice.reduce((sum, curr) => sum + Math.pow(curr.price - avg, 2), 0) / 20
      );
      
      upperBand = avg + 2 * stdDev;
      lowerBand = avg - 2 * stdDev;
    }
    
    return {
      ...item,
      sma20,
      sma50,
      macd,
      rsi,
      upperBand,
      lowerBand
    };
  });
  
  return withMA;
};

const TechnicalAnalysis = () => {
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [timeframe, setTimeframe] = useState("daily");
  const [chartData, setChartData] = useState(generateChartData());
  
  // Technical indicator states
  const [showMA, setShowMA] = useState<boolean[]>([true, true]);
  const [showBollinger, setShowBollinger] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [macdPeriods, setMacdPeriods] = useState<[number, number, number]>([12, 26, 9]);
  const [rsiPeriod, setRsiPeriod] = useState<number>(14);
  
  // Mock stocks with same format as StockSelector
  const stocks = [
    { ticker: "AAPL", name: "Apple Inc." },
    { ticker: "MSFT", name: "Microsoft Corporation" },
    { ticker: "GOOGL", name: "Alphabet Inc." },
    { ticker: "AMZN", name: "Amazon.com Inc." },
    { ticker: "META", name: "Meta Platforms Inc." },
  ];
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Technical Analysis</h1>
          <p className="text-sm text-slate-500 mt-1">Advanced chart analysis tools for day traders</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Chart Settings</CardTitle>
                <CardDescription>Select stock and timeframe</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="stock-select">Stock</Label>
                    <Select value={selectedStock} onValueChange={setSelectedStock}>
                      <SelectTrigger id="stock-select">
                        <SelectValue placeholder="Select Stock" />
                      </SelectTrigger>
                      <SelectContent>
                        {stocks.map((stock) => (
                          <SelectItem key={stock.ticker} value={stock.ticker}>
                            {stock.ticker} - {stock.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="timeframe-select">Timeframe</Label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger id="timeframe-select">
                        <SelectValue placeholder="Select Timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1min">1 Minute</SelectItem>
                        <SelectItem value="5min">5 Minutes</SelectItem>
                        <SelectItem value="15min">15 Minutes</SelectItem>
                        <SelectItem value="30min">30 Minutes</SelectItem>
                        <SelectItem value="hourly">1 Hour</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Moving Averages</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sma-20" 
                        checked={showMA[0]} 
                        onCheckedChange={(checked) => setShowMA([checked as boolean, showMA[1]])}
                      />
                      <Label htmlFor="sma-20" className="text-sm">SMA-20</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sma-50" 
                        checked={showMA[1]} 
                        onCheckedChange={(checked) => setShowMA([showMA[0], checked as boolean])}
                      />
                      <Label htmlFor="sma-50" className="text-sm">SMA-50</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Bollinger Bands</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bollinger" 
                        checked={showBollinger} 
                        onCheckedChange={(checked) => setShowBollinger(checked as boolean)} 
                      />
                      <Label htmlFor="bollinger" className="text-sm">Show Bands (20, 2)</Label>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Volume</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="volume" 
                        checked={showVolume} 
                        onCheckedChange={(checked) => setShowVolume(checked as boolean)} 
                      />
                      <Label htmlFor="volume" className="text-sm">Show Volume</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="w-full md:w-2/3">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle>Price Chart: {selectedStock}</CardTitle>
                <CardDescription>
                  Technical analysis for {stocks.find(s => s.ticker === selectedStock)?.name} 
                  ({timeframe === "daily" ? "Daily" : timeframe})
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-auto">
                <div className="h-[400px] overflow-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart 
                      data={chartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      
                      {/* Bollinger Bands */}
                      {showBollinger && (
                        <>
                          <Line 
                            type="monotone" 
                            dataKey="upperBand" 
                            stroke="#8884d8" 
                            dot={false} 
                            strokeDasharray="3 3"
                            name="Upper Band"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="lowerBand" 
                            stroke="#8884d8" 
                            dot={false} 
                            strokeDasharray="3 3"
                            name="Lower Band"
                          />
                        </>
                      )}
                      
                      {/* Price line */}
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#000000" 
                        strokeWidth={2}
                        name="Price"
                      />
                      
                      {/* Moving Averages */}
                      {showMA[0] && (
                        <Line 
                          type="monotone" 
                          dataKey="sma20" 
                          stroke="#0ea5e9" 
                          dot={false}
                          name="SMA-20"
                        />
                      )}
                      
                      {showMA[1] && (
                        <Line 
                          type="monotone" 
                          dataKey="sma50" 
                          stroke="#6366f1" 
                          dot={false}
                          name="SMA-50"
                        />
                      )}
                      
                      {/* Volume */}
                      {showVolume && (
                        <Bar 
                          dataKey="volume" 
                          barSize={20} 
                          fill="#10b981" 
                          opacity={0.5}
                          name="Volume"
                        />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="indicators">
          <TabsList className="mb-4">
            <TabsTrigger value="indicators">Technical Indicators</TabsTrigger>
            <TabsTrigger value="oscillators">Oscillators</TabsTrigger>
            <TabsTrigger value="patterns">Chart Patterns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="indicators">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>MACD Indicator</CardTitle>
                  <CardDescription>Moving Average Convergence Divergence</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] overflow-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={chartData.slice(-20)}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="macd" 
                          stroke="#0ea5e9" 
                          dot={false}
                          name="MACD Line"
                        />
                        <Bar 
                          dataKey="macd" 
                          barSize={20} 
                          fill={(entry) => entry.macd >= 0 ? "#10b981" : "#ef4444" as string}
                          name="MACD Histogram"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <Label htmlFor="macd-fast" className="text-xs">Fast Period</Label>
                      <Input 
                        id="macd-fast" 
                        type="number" 
                        value={macdPeriods[0]}
                        onChange={(e) => setMacdPeriods([Number(e.target.value), macdPeriods[1], macdPeriods[2]])}
                        min={1}
                        max={50}
                      />
                    </div>
                    <div>
                      <Label htmlFor="macd-slow" className="text-xs">Slow Period</Label>
                      <Input 
                        id="macd-slow" 
                        type="number" 
                        value={macdPeriods[1]}
                        onChange={(e) => setMacdPeriods([macdPeriods[0], Number(e.target.value), macdPeriods[2]])}
                        min={1}
                        max={100}
                      />
                    </div>
                    <div>
                      <Label htmlFor="macd-signal" className="text-xs">Signal Period</Label>
                      <Input 
                        id="macd-signal" 
                        type="number" 
                        value={macdPeriods[2]}
                        onChange={(e) => setMacdPeriods([macdPeriods[0], macdPeriods[1], Number(e.target.value)])}
                        min={1}
                        max={50}
                      />
                    </div>
                  </div>
                  
                  <Alert className="mt-4 bg-slate-50">
                    <Info className="h-4 w-4" />
                    <AlertTitle>MACD Signal</AlertTitle>
                    <AlertDescription>
                      {chartData[chartData.length - 1].macd > 0 
                        ? "Bullish: MACD is above the signal line"
                        : "Bearish: MACD is below the signal line"}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>RSI Indicator</CardTitle>
                  <CardDescription>Relative Strength Index</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] overflow-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={chartData.slice(-20)}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="rsi" 
                          stroke="#8b5cf6" 
                          dot={false}
                          strokeWidth={2}
                          name="RSI"
                        />
                        <Line 
                          strokeDasharray="3 3" 
                          stroke="#ef4444" 
                          name="Overbought" 
                          dataKey={() => 70}
                        />
                        <Line 
                          strokeDasharray="3 3" 
                          stroke="#10b981" 
                          name="Oversold" 
                          dataKey={() => 30}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor="rsi-period">RSI Period: {rsiPeriod}</Label>
                    <Slider
                      id="rsi-period"
                      defaultValue={[14]}
                      max={30}
                      min={2}
                      step={1}
                      onValueChange={(value) => setRsiPeriod(value[0])}
                    />
                  </div>
                  
                  <Alert 
                    className="mt-4"
                    variant={
                      chartData[chartData.length - 1].rsi > 70 
                        ? "destructive" 
                        : "default"
                    }
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>RSI Signal</AlertTitle>
                    <AlertDescription>
                      {chartData[chartData.length - 1].rsi > 70 
                        ? "Overbought: Consider selling positions" 
                        : chartData[chartData.length - 1].rsi < 30 
                          ? "Oversold: Consider buying positions"
                          : "Neutral: Neither overbought nor oversold"}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="oscillators">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stochastic Oscillator</CardTitle>
                  <CardDescription>Momentum indicator comparing close price to price range</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] overflow-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={chartData.slice(-20).map((item, index) => {
                          // Simple stochastic calculation for demo
                          const sliceStart = Math.max(0, index - 13);
                          const sliceEnd = index + 1;
                          const slice = chartData.slice(-20).slice(sliceStart, sliceEnd);
                          const highest = Math.max(...slice.map(item => item.price));
                          const lowest = Math.min(...slice.map(item => item.price));
                          const stochasticK = ((item.price - lowest) / (highest - lowest)) * 100;
                          
                          return {
                            ...item,
                            stochasticK: stochasticK,
                            stochasticD: index >= 3 
                              ? chartData.slice(-20).slice(index-2, index+1).reduce((sum, item) => sum + ((item.price - lowest) / (highest - lowest)) * 100, 0) / 3 
                              : null
                          };
                        })}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="stochasticK" 
                          stroke="#ef4444" 
                          dot={false}
                          strokeWidth={2}
                          name="%K Line"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="stochasticD" 
                          stroke="#0ea5e9" 
                          dot={false}
                          strokeWidth={2}
                          name="%D Line"
                        />
                        <Line 
                          strokeDasharray="3 3" 
                          stroke="#ef4444" 
                          name="Overbought" 
                          dataKey={() => 80}
                        />
                        <Line 
                          strokeDasharray="3 3" 
                          stroke="#10b981" 
                          name="Oversold" 
                          dataKey={() => 20}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>ATR Indicator</CardTitle>
                  <CardDescription>Average True Range (Volatility)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] overflow-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart 
                        data={chartData.slice(-20).map((item, index, array) => {
                          if (index === 0) return { ...item, atr: null };
                          
                          // Simple calculation for demo
                          const tr = Math.max(
                            item.price - item.price * 0.98, // High - Low
                            Math.abs(item.price - array[index-1].price), // High - PrevClose
                            Math.abs(item.price * 0.98 - array[index-1].price) // Low - PrevClose
                          );
                          
                          // Use a 14-day period for ATR
                          let atr = tr;
                          const prevItem = array[index-1] as any;
                          if (prevItem && prevItem.atr !== null) {
                            atr = ((prevItem.atr * 13) + tr) / 14;
                          }
                          
                          return { ...item, atr };
                        })}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="atr" 
                          stroke="#f97316" 
                          dot={false}
                          strokeWidth={2}
                          name="ATR (14)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="patterns">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pattern Recognition</CardTitle>
                  <CardDescription>Detecting common chart patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] overflow-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart 
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke="#000000" 
                          strokeWidth={2}
                          name="Price"
                        />
                        
                        {/* Demonstration patterns */}
                        <Scatter 
                          name="Support Level" 
                          data={[
                            { date: "2023-11-01", price: 245, z: 100 },
                            { date: "2023-12-01", price: 250, z: 100 },
                            { date: "2024-01-01", price: 255, z: 100 },
                          ]}
                          fill="#10b981"
                          shape="triangle"
                        />
                        
                        <Scatter 
                          name="Resistance Level" 
                          data={[
                            { date: "2023-09-01", price: 230, z: 100 },
                            { date: "2023-10-01", price: 235, z: 100 },
                            { date: "2023-11-01", price: 255, z: 100 },
                          ]}
                          fill="#ef4444"
                          shape="triangle"
                        />
                        
                        <Scatter
                          name="Double Bottom" 
                          data={[{ date: "2023-12-01", price: 250, z: 200 }]}
                          fill="#8b5cf6"
                        />
                        
                        <Scatter
                          name="Head and Shoulders" 
                          data={[{ date: "2024-02-01", price: 280, z: 200 }]}
                          fill="#f97316"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm">Support Level</h4>
                      <p className="text-xs text-slate-500">Price level where downtrends tend to pause</p>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm">Resistance Level</h4>
                      <p className="text-xs text-slate-500">Price level where uptrends tend to pause</p>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm">Double Bottom</h4>
                      <p className="text-xs text-slate-500">Bullish reversal pattern</p>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm">Head & Shoulders</h4>
                      <p className="text-xs text-slate-500">Bearish reversal pattern</p>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm">Trend Lines</h4>
                      <p className="text-xs text-slate-500">Show direction of price movement</p>
                    </div>
                    
                    <div className="bg-slate-50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm">Fibonacci Levels</h4>
                      <p className="text-xs text-slate-500">Key retracement levels</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default TechnicalAnalysis;
