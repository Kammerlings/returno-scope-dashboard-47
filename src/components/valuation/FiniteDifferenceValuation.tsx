
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FiniteDifferenceValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  const [timeSteps, setTimeSteps] = useState<number>(20);
  const [priceSteps, setPriceSteps] = useState<number>(50);
  const [optionType, setOptionType] = useState<string>("call");
  const [optionStyle, setOptionStyle] = useState<string>("european");
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [gridData, setGridData] = useState<any[]>([]);
  
  const runFiniteDifference = () => {
    // Parameters
    const S = spotPrice;
    const K = strikePrice;
    const sigma = volatility;
    const r = riskFreeRate;
    const T = timeToMaturity;
    const M = timeSteps;  // Number of time steps
    const N = priceSteps; // Number of price steps
    
    // Determine grid boundaries
    const sMax = S * 3;
    const sMin = 0;
    const ds = (sMax - sMin) / N;
    const dt = T / M;
    
    // Create grid
    const grid: number[][] = [];
    for (let i = 0; i <= M; i++) {
      grid[i] = [];
    }
    
    // Set terminal condition (option payoff at expiry)
    for (let j = 0; j <= N; j++) {
      const s = sMin + j * ds;
      if (optionType === "call") {
        grid[M][j] = Math.max(0, s - K);
      } else {
        grid[M][j] = Math.max(0, K - s);
      }
    }
    
    // Backwards in time
    for (let i = M - 1; i >= 0; i--) {
      for (let j = 1; j < N; j++) {
        const s = sMin + j * ds;
        
        // Explicit finite difference coefficients
        const a = 0.5 * dt * (sigma * sigma * j * j - r * j);
        const b = 1 - dt * (sigma * sigma * j * j + r);
        const c = 0.5 * dt * (sigma * sigma * j * j + r * j);
        
        // Explicit finite difference formula
        grid[i][j] = a * grid[i+1][j-1] + b * grid[i+1][j] + c * grid[i+1][j+1];
        
        // Handle American option early exercise
        if (optionStyle === "american") {
          const exerciseValue = optionType === "call"
            ? Math.max(0, s - K)
            : Math.max(0, K - s);
          grid[i][j] = Math.max(grid[i][j], exerciseValue);
        }
      }
      
      // Boundary conditions
      if (optionType === "call") {
        grid[i][0] = 0;
        grid[i][N] = sMax - K * Math.exp(-r * (T - i * dt));
      } else {
        grid[i][0] = K * Math.exp(-r * (T - i * dt));
        grid[i][N] = 0;
      }
    }
    
    // Interpolate to get option price at spot price
    const j = Math.floor((S - sMin) / ds);
    const weight = (S - (sMin + j * ds)) / ds;
    const price = (1 - weight) * grid[0][j] + weight * grid[0][j+1];
    
    setOptionPrice(price);
    
    // Create visualization data
    // We'll sample a subset of the grid for visualization
    const timeStep = Math.max(1, Math.floor(M / 5));
    const priceStep = Math.max(1, Math.floor(N / 10));
    const visualData = [];
    
    for (let i = 0; i <= M; i += timeStep) {
      for (let j = 0; j <= N; j += priceStep) {
        const s = sMin + j * ds;
        const t = i * dt;
        
        if (s > 0 && s < sMax * 0.8) { // Only include relevant price range
          visualData.push({
            time: T - t,
            price: s,
            value: grid[i][j],
            x: j * priceStep,
            y: i * timeStep,
          });
        }
      }
    }
    
    setGridData(visualData);
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
            <Label htmlFor="volatility">Volatility (σ)</Label>
            <Input
              id="volatility"
              type="number"
              step="0.01"
              value={volatility}
              onChange={(e) => setVolatility(parseFloat(e.target.value) || 0)}
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
            <Label htmlFor="time-steps">Time Steps</Label>
            <Input
              id="time-steps"
              type="number"
              min="10"
              max="100"
              value={timeSteps}
              onChange={(e) => setTimeSteps(parseInt(e.target.value) || 10)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price-steps">Price Steps</Label>
            <Input
              id="price-steps"
              type="number"
              min="20"
              max="200"
              value={priceSteps}
              onChange={(e) => setPriceSteps(parseInt(e.target.value) || 20)}
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
          
          <div className="space-y-2">
            <Label htmlFor="option-style">Option Style</Label>
            <Select value={optionStyle} onValueChange={setOptionStyle}>
              <SelectTrigger id="option-style">
                <SelectValue placeholder="Select option style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="european">European</SelectItem>
                <SelectItem value="american">American</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className="w-full" onClick={runFiniteDifference}>
          Calculate Using Finite Difference
        </Button>
        
        {optionPrice !== null && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <p className="text-3xl font-bold text-green-600">${optionPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Option Price</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Option Value Surface</h3>
        {gridData.length > 0 ? (
          <div className="h-80 overflow-auto">
            <svg width="400" height="400" viewBox="0 0 400 400">
              {/* Draw grid points */}
              {gridData.map((point, i) => {
                const valueNormalized = Math.min(1, point.value / (spotPrice * 0.5));
                const colorIntensity = Math.floor(valueNormalized * 255);
                const color = optionType === "call" 
                  ? `rgb(16, ${colorIntensity}, 129)` 
                  : `rgb(${colorIntensity}, 129, 246)`;
                
                return (
                  <circle
                    key={i}
                    cx={point.price * 2}
                    cy={400 - point.time * 300}
                    r={4}
                    fill={color}
                    opacity={0.8}
                  />
                );
              })}
              
              {/* Draw axes */}
              <line x1="0" y1="380" x2="400" y2="380" stroke="black" strokeWidth="1" />
              <line x1="20" y1="0" x2="20" y2="400" stroke="black" strokeWidth="1" />
              
              {/* X-axis labels */}
              <text x="200" y="398" textAnchor="middle" fontSize="12">Price ($)</text>
              
              {/* Y-axis labels */}
              <text x="5" y="200" textAnchor="middle" fontSize="12" transform="rotate(270,5,200)">Time to Maturity (Years)</text>
              
              {/* Current spot price marker */}
              <line 
                x1={spotPrice * 2} 
                y1="0" 
                x2={spotPrice * 2} 
                y2="380" 
                stroke="red" 
                strokeWidth="1" 
                strokeDasharray="5,5" 
              />
              <text 
                x={spotPrice * 2} 
                y="395" 
                textAnchor="middle" 
                fontSize="10" 
                fill="red"
              >
                Spot
              </text>
              
              {/* Strike price marker */}
              <line 
                x1={strikePrice * 2} 
                y1="0" 
                x2={strikePrice * 2} 
                y2="380" 
                stroke="blue" 
                strokeWidth="1" 
                strokeDasharray="5,5" 
              />
              <text 
                x={strikePrice * 2} 
                y="395" 
                textAnchor="middle" 
                fontSize="10" 
                fill="blue"
              >
                Strike
              </text>
            </svg>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Calculate to see the option value surface</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          3D visualization: Brighter colors indicate higher option values
        </p>
      </div>
    </div>
  );
};

export default FiniteDifferenceValuation;
