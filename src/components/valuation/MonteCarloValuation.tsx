
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const MonteCarloValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  const [simulations, setSimulations] = useState<number>(1000);
  const [optionType, setOptionType] = useState<string>("call");
  const [pricePaths, setPricePaths] = useState<any[]>([]);
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  
  const runSimulation = () => {
    // Number of steps in each path
    const steps = 100;
    const dt = timeToMaturity / steps;
    const paths: any[] = [];
    let totalPayoff = 0;
    
    // Generate paths
    for (let sim = 0; sim < Math.min(simulations, 50); sim++) {
      const path: any[] = [];
      let currentPrice = spotPrice;
      
      path.push({
        step: 0,
        price: currentPrice,
      });
      
      for (let step = 1; step <= steps; step++) {
        // Generate random normal number
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Calculate price change using geometric Brownian motion
        const drift = (riskFreeRate - 0.5 * volatility * volatility) * dt;
        const diffusion = volatility * Math.sqrt(dt) * z;
        
        currentPrice = currentPrice * Math.exp(drift + diffusion);
        
        path.push({
          step: step,
          price: currentPrice,
        });
      }
      
      // Calculate payoff
      let payoff = 0;
      if (optionType === "call") {
        payoff = Math.max(0, currentPrice - strikePrice);
      } else {
        payoff = Math.max(0, strikePrice - currentPrice);
      }
      
      totalPayoff += payoff;
      paths.push(path);
    }
    
    // For visualization, process the paths to the format recharts needs
    const chartData = Array(steps + 1).fill(0).map((_, i) => {
      const point: any = { step: i };
      paths.forEach((path, pathIdx) => {
        point[`path${pathIdx}`] = path[i].price;
      });
      return point;
    });
    
    // Calculate the option price as the discounted average payoff
    const avgPayoff = totalPayoff / simulations;
    const discountedPayoff = avgPayoff * Math.exp(-riskFreeRate * timeToMaturity);
    
    setPricePaths(chartData);
    setOptionPrice(discountedPayoff);
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
            <Label htmlFor="simulations">Number of Simulations</Label>
            <Input
              id="simulations"
              type="number"
              value={simulations}
              onChange={(e) => setSimulations(parseInt(e.target.value) || 100)}
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
        
        <Button className="w-full" onClick={runSimulation}>
          Run Monte Carlo Simulation
        </Button>
        
        {optionPrice !== null && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <p className="text-3xl font-bold text-green-600">${optionPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Estimated Option Price</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Simulated Price Paths</h3>
        {pricePaths.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={pricePaths}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="step" 
                  label={{ value: 'Time Steps', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                {Array(Math.min(simulations, 10)).fill(0).map((_, i) => (
                  <Area 
                    key={i}
                    type="monotone" 
                    dataKey={`path${i}`} 
                    stroke={`hsl(${(i * 36) % 360}, 70%, 50%)`} 
                    fillOpacity={0.1}
                    fill={`hsl(${(i * 36) % 360}, 70%, 80%)`} 
                    connectNulls 
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Run a simulation to see price paths</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Note: Only showing a subset of paths for visualization purposes.
        </p>
      </div>
    </div>
  );
};

export default MonteCarloValuation;
