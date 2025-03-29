
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const JumpDiffusionValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  const [jumpIntensity, setJumpIntensity] = useState<number>(1);
  const [jumpSizeMean, setJumpSizeMean] = useState<number>(-0.1);
  const [jumpSizeVol, setJumpSizeVol] = useState<number>(0.2);
  const [optionType, setOptionType] = useState<string>("call");
  const [numSimulations, setNumSimulations] = useState<number>(1000);
  
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [priceDistribution, setPriceDistribution] = useState<any[]>([]);
  
  const calculateJumpDiffusionPrice = () => {
    // In a real implementation, this would use the Merton Jump Diffusion model formula
    // For demo purposes, we'll create a simulated price and path simulations
    
    // Number of time steps
    const steps = 100;
    const dt = timeToMaturity / steps;
    
    // Simplified simulation of a few paths for visualization
    const paths: any[] = [];
    let totalPayoff = 0;
    const finalPrices: number[] = [];
    
    for (let sim = 0; sim < Math.min(numSimulations, 10); sim++) {
      const path: any[] = [];
      let currentPrice = spotPrice;
      
      path.push({
        step: 0,
        price: currentPrice,
      });
      
      for (let step = 1; step <= steps; step++) {
        // Generate random normal number for diffusion
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Generate Poisson jumps
        const lambda = jumpIntensity * dt;
        const jumpOccurs = Math.random() < lambda;
        
        // Calculate price change using GBM + jumps
        const drift = (riskFreeRate - 0.5 * volatility * volatility) * dt;
        const diffusion = volatility * Math.sqrt(dt) * z;
        
        // Jump component
        let jump = 0;
        if (jumpOccurs) {
          // Generate random normal jump size
          const u3 = Math.random();
          const u4 = Math.random();
          const jumpZ = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);
          
          jump = Math.exp(jumpSizeMean + jumpSizeVol * jumpZ) - 1;
        }
        
        currentPrice = currentPrice * Math.exp(drift + diffusion) * (1 + (jumpOccurs ? jump : 0));
        
        path.push({
          step: step / steps * timeToMaturity,
          price: currentPrice,
        });
      }
      
      finalPrices.push(currentPrice);
      
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
    
    // Process paths for visualization
    const chartData = Array(steps + 1).fill(0).map((_, i) => {
      const point: any = { step: i * timeToMaturity / steps };
      paths.forEach((path, pathIdx) => {
        point[`path${pathIdx}`] = path[i].price;
      });
      return point;
    });
    
    // Generate price distribution histogram
    const minPrice = Math.min(...finalPrices) * 0.9;
    const maxPrice = Math.max(...finalPrices) * 1.1;
    const numBins = 15;
    const binWidth = (maxPrice - minPrice) / numBins;
    
    const bins = Array(numBins).fill(0).map((_, i) => {
      const lowerBound = minPrice + i * binWidth;
      const upperBound = lowerBound + binWidth;
      return {
        bin: `${lowerBound.toFixed(0)}-${upperBound.toFixed(0)}`,
        count: 0,
        lowerBound,
        upperBound
      };
    });
    
    finalPrices.forEach(price => {
      const binIndex = Math.min(
        numBins - 1,
        Math.floor((price - minPrice) / binWidth)
      );
      if (binIndex >= 0) bins[binIndex].count++;
    });
    
    // Calculate option price as the discounted average payoff
    const avgPayoff = totalPayoff / numSimulations;
    const discountedPayoff = avgPayoff * Math.exp(-riskFreeRate * timeToMaturity);
    
    setSimulationData(chartData);
    setPriceDistribution(bins);
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
            <Label htmlFor="volatility">Diffusion Volatility (σ)</Label>
            <Input
              id="volatility"
              type="number"
              step="0.01"
              value={volatility}
              onChange={(e) => setVolatility(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jump-intensity">Jump Intensity (λ)</Label>
            <Input
              id="jump-intensity"
              type="number"
              step="0.1"
              value={jumpIntensity}
              onChange={(e) => setJumpIntensity(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jump-mean">Jump Size Mean (μⱼ)</Label>
            <Input
              id="jump-mean"
              type="number"
              step="0.05"
              value={jumpSizeMean}
              onChange={(e) => setJumpSizeMean(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jump-vol">Jump Size Volatility (σⱼ)</Label>
            <Input
              id="jump-vol"
              type="number"
              step="0.05"
              value={jumpSizeVol}
              onChange={(e) => setJumpSizeVol(parseFloat(e.target.value) || 0)}
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
          
          <div className="space-y-2">
            <Label htmlFor="num-simulations">Number of Simulations</Label>
            <Input
              id="num-simulations"
              type="number"
              min="100"
              max="10000"
              step="100"
              value={numSimulations}
              onChange={(e) => setNumSimulations(parseInt(e.target.value) || 1000)}
            />
          </div>
        </div>
        
        <Button className="w-full" onClick={calculateJumpDiffusionPrice}>
          Calculate Using Jump Diffusion
        </Button>
        
        {optionPrice !== null && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <p className="text-3xl font-bold text-green-600">${optionPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Option Price</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium">Expected Jumps</p>
                  <p className="text-lg">{(jumpIntensity * timeToMaturity).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Average Jump Effect</p>
                  <p className={`text-lg ${jumpSizeMean >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(Math.exp(jumpSizeMean) - 1).toFixed(2) * 100}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Jump Diffusion Simulations</h3>
        {simulationData.length > 0 ? (
          <div className="space-y-6">
            <div className="h-60 overflow-auto">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="step" 
                    label={{ value: 'Time (Years)', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, '']} />
                  <Legend />
                  {Array(Math.min(numSimulations, 10)).fill(0).map((_, i) => (
                    <Line 
                      key={i}
                      type="monotone" 
                      dataKey={`path${i}`} 
                      name={`Path ${i+1}`} 
                      stroke={`hsl(${(i * 36) % 360}, 70%, 50%)`} 
                      strokeWidth={1.5}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="h-60 overflow-auto">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="bin" 
                    label={{ value: 'Final Price Range ($)', position: 'insideBottom', offset: -5 }} 
                  />
                  <YAxis 
                    label={{ value: 'Frequency', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    name="Frequency" 
                    fill="#8884d8" 
                    stroke="#8884d8" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Run a simulation to see price paths and distribution</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          The top chart shows simulated price paths with jumps. The bottom chart shows the distribution of final prices.
        </p>
      </div>
    </div>
  );
};

export default JumpDiffusionValuation;
