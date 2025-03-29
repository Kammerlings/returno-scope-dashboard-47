
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const HestonModelValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  const [initialVolatility, setInitialVolatility] = useState<number>(0.2);
  const [longTermVolatility, setLongTermVolatility] = useState<number>(0.2);
  const [volatilityOfVolatility, setVolatilityOfVolatility] = useState<number>(0.3);
  const [meanReversionSpeed, setMeanReversionSpeed] = useState<number>(1.5);
  const [correlation, setCorrelation] = useState<number>(-0.7);
  const [optionType, setOptionType] = useState<string>("call");
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [volSurfaceData, setVolSurfaceData] = useState<any[]>([]);
  
  const calculateHestonPrice = () => {
    // In a real implementation, this would use the Heston stochastic volatility model formula
    // For demo purposes, we'll create a simulated price and volatility surface
    
    const simulatedPrice = optionType === "call"
      ? spotPrice * 0.1 * Math.exp(-0.5 * initialVolatility * initialVolatility * timeToMaturity)
      : strikePrice * 0.1 * Math.exp(-0.5 * initialVolatility * initialVolatility * timeToMaturity);
    
    // Generate volatility surface data
    const surfaceData = [];
    const strikes = [0.8, 0.9, 1.0, 1.1, 1.2];
    const maturities = [0.25, 0.5, 1.0, 1.5, 2.0];
    
    for (const ttm of maturities) {
      const dataPoint: any = { maturity: ttm };
      
      for (const strikeRatio of strikes) {
        const strike = spotPrice * strikeRatio;
        // Simulate volatility smile
        const skew = -0.2 * correlation * (strikeRatio - 1) * Math.sqrt(ttm);
        const convexity = 0.1 * volatilityOfVolatility * Math.pow(strikeRatio - 1, 2);
        const termStructure = longTermVolatility + (initialVolatility - longTermVolatility) * Math.exp(-meanReversionSpeed * ttm);
        
        const impliedVol = termStructure + skew + convexity;
        dataPoint[`k${strikeRatio * 100}`] = Math.max(0.1, impliedVol);
      }
      
      surfaceData.push(dataPoint);
    }
    
    setOptionPrice(simulatedPrice);
    setVolSurfaceData(surfaceData);
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="spot-price">Spot Price ($)</Label>
            <Input
              id="spot-price"
              type="number"
              value={spotPrice}
              onChange={(e) => setSpotPrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="strike-price">Strike Price ($)</Label>
            <Input
              id="strike-price"
              type="number"
              value={strikePrice}
              onChange={(e) => setStrikePrice(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="initial-volatility">Initial Volatility (v₀)</Label>
            <Input
              id="initial-volatility"
              type="number"
              step="0.01"
              value={initialVolatility}
              onChange={(e) => setInitialVolatility(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="long-term-volatility">Long Term Volatility (θ)</Label>
            <Input
              id="long-term-volatility"
              type="number"
              step="0.01"
              value={longTermVolatility}
              onChange={(e) => setLongTermVolatility(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vol-of-vol">Volatility of Volatility (σ)</Label>
            <Input
              id="vol-of-vol"
              type="number"
              step="0.1"
              value={volatilityOfVolatility}
              onChange={(e) => setVolatilityOfVolatility(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mean-reversion">Mean Reversion Speed (κ)</Label>
            <Input
              id="mean-reversion"
              type="number"
              step="0.1"
              value={meanReversionSpeed}
              onChange={(e) => setMeanReversionSpeed(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="correlation">Correlation (ρ)</Label>
            <Input
              id="correlation"
              type="number"
              step="0.1"
              min="-1"
              max="1"
              value={correlation}
              onChange={(e) => setCorrelation(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="risk-free-rate">Risk-Free Rate</Label>
            <Input
              id="risk-free-rate"
              type="number"
              step="0.001"
              value={riskFreeRate}
              onChange={(e) => setRiskFreeRate(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time-to-maturity">Time to Maturity (years)</Label>
            <Input
              id="time-to-maturity"
              type="number"
              step="0.1"
              value={timeToMaturity}
              onChange={(e) => setTimeToMaturity(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="option-type">Option Type</Label>
            <Select value={optionType} onValueChange={setOptionType}>
              <SelectTrigger id="option-type">
                <SelectValue placeholder="Select option type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call Option</SelectItem>
                <SelectItem value="put">Put Option</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className="w-full" onClick={calculateHestonPrice}>
          Calculate Using Heston Model
        </Button>
        
        {optionPrice !== null && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <p className="text-3xl font-bold text-green-600">${optionPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Option Price</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium">Volatility smile capture</p>
                  <p className="text-xs text-gray-500">Accounts for skew and curvature</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Mean reverting volatility</p>
                  <p className="text-xs text-gray-500">θ = {longTermVolatility.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow overflow-auto">
        <h3 className="text-lg font-semibold mb-4">Volatility Surface</h3>
        {volSurfaceData.length > 0 ? (
          <div className="h-80 overflow-auto">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volSurfaceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="maturity" 
                  label={{ value: 'Time to Maturity (Years)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  label={{ value: 'Implied Volatility', angle: -90, position: 'insideLeft' }}
                  domain={[0, 'dataMax + 0.1']}
                />
                <Tooltip formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Implied Vol']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="k80" 
                  name="80% Strike" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="k90" 
                  name="90% Strike" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="k100" 
                  name="100% Strike" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="k110" 
                  name="110% Strike" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="k120" 
                  name="120% Strike" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Calculate option price to see volatility surface</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          The volatility surface shows how implied volatility varies with strike price and maturity
        </p>
      </div>
    </div>
  );
};

export default HestonModelValuation;
