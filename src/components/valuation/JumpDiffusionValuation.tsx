
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const JumpDiffusionValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  const [jumpIntensity, setJumpIntensity] = useState<number>(1);
  const [jumpSize, setJumpSize] = useState<number>(0.1);
  const [jumpVolatility, setJumpVolatility] = useState<number>(0.2);
  const [optionType, setOptionType] = useState<string>("call");
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [greeks, setGreeks] = useState<any>(null);
  const [sensitivityData, setSensitivityData] = useState<any[]>([]);
  
  // Cumulative standard normal distribution function
  const cnd = (x: number): number => {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2.0);
    
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return 0.5 * (1.0 + sign * y);
  };
  
  const calculateJumpDiffusion = () => {
    // Jump diffusion inputs
    const S = spotPrice;
    const K = strikePrice;
    const r = riskFreeRate;
    const T = timeToMaturity;
    const sigma = volatility;
    const lambda = jumpIntensity;
    const muJ = jumpSize;
    const sigmaJ = jumpVolatility;
    
    // Implement Jump Diffusion model (Simplified Merton model)
    let price = 0;
    
    // We use a finite sum approximation for the Jump Diffusion model
    const maxJumps = 10; // Maximum number of jumps to consider
    
    for (let n = 0; n <= maxJumps; n++) {
      // Probability of n jumps occurring
      const poissonProb = Math.exp(-lambda * T) * Math.pow(lambda * T, n) / factorial(n);
      
      // Adjusted volatility for n jumps
      const adjustedSigma = Math.sqrt(sigma * sigma + n * sigmaJ * sigmaJ / T);
      
      // Adjusted risk-free rate for n jumps
      const adjustedR = r - lambda * (Math.exp(muJ) - 1) + n * muJ / T;
      
      // Black-Scholes price for these adjusted parameters
      const d1 = (Math.log(S / K) + (adjustedR + 0.5 * adjustedSigma * adjustedSigma) * T) / (adjustedSigma * Math.sqrt(T));
      const d2 = d1 - adjustedSigma * Math.sqrt(T);
      
      let jumpPrice = 0;
      if (optionType === "call") {
        jumpPrice = S * Math.exp((adjustedR - r) * T) * cnd(d1) - K * Math.exp(-r * T) * cnd(d2);
      } else {
        jumpPrice = K * Math.exp(-r * T) * cnd(-d2) - S * Math.exp((adjustedR - r) * T) * cnd(-d1);
      }
      
      // Add this component to the total price
      price += poissonProb * jumpPrice;
    }
    
    // Calculate approximate Greeks
    const delta = calculateDelta(S, K, r, T, sigma, lambda, muJ, sigmaJ);
    const gamma = calculateGamma(S, K, r, T, sigma, lambda, muJ, sigmaJ);
    const theta = calculateTheta(S, K, r, T, sigma, lambda, muJ, sigmaJ) / 365; // Daily theta
    const vega = calculateVega(S, K, r, T, sigma, lambda, muJ, sigmaJ) / 100; // Per 1% vol change
    
    // Generate sensitivity data
    const sensData = [];
    const pricePadding = S * 0.2;
    
    for (let underlying = S - pricePadding; underlying <= S + pricePadding; underlying += pricePadding / 10) {
      let callPrice = 0;
      let putPrice = 0;
      
      for (let n = 0; n <= maxJumps; n++) {
        const poissonProb = Math.exp(-lambda * T) * Math.pow(lambda * T, n) / factorial(n);
        const adjustedSigma = Math.sqrt(sigma * sigma + n * sigmaJ * sigmaJ / T);
        const adjustedR = r - lambda * (Math.exp(muJ) - 1) + n * muJ / T;
        
        const d1 = (Math.log(underlying / K) + (adjustedR + 0.5 * adjustedSigma * adjustedSigma) * T) / (adjustedSigma * Math.sqrt(T));
        const d2 = d1 - adjustedSigma * Math.sqrt(T);
        
        callPrice += poissonProb * (underlying * Math.exp((adjustedR - r) * T) * cnd(d1) - K * Math.exp(-r * T) * cnd(d2));
        putPrice += poissonProb * (K * Math.exp(-r * T) * cnd(-d2) - underlying * Math.exp((adjustedR - r) * T) * cnd(-d1));
      }
      
      sensData.push({
        underlying,
        callPrice,
        putPrice,
        intrinsicCall: Math.max(0, underlying - K),
        intrinsicPut: Math.max(0, K - underlying)
      });
    }
    
    setOptionPrice(price);
    setGreeks({
      delta,
      gamma,
      theta,
      vega,
      lambda: calculateLambdaSensitivity(S, K, r, T, sigma, lambda, muJ, sigmaJ)
    });
    setSensitivityData(sensData);
  };
  
  // Helper functions for Jump Diffusion model
  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };
  
  // Approximate Greeks by finite difference
  const calculateDelta = (S: number, K: number, r: number, T: number, sigma: number, 
                           lambda: number, muJ: number, sigmaJ: number): number => {
    const h = 0.01 * S;
    const pUp = calculatePrice(S + h, K, r, T, sigma, lambda, muJ, sigmaJ, optionType);
    const pDown = calculatePrice(S - h, K, r, T, sigma, lambda, muJ, sigmaJ, optionType);
    return (pUp - pDown) / (2 * h);
  };
  
  const calculateGamma = (S: number, K: number, r: number, T: number, sigma: number, 
                           lambda: number, muJ: number, sigmaJ: number): number => {
    const h = 0.01 * S;
    const pUp = calculatePrice(S + h, K, r, T, sigma, lambda, muJ, sigmaJ, optionType);
    const pMid = calculatePrice(S, K, r, T, sigma, lambda, muJ, sigmaJ, optionType);
    const pDown = calculatePrice(S - h, K, r, T, sigma, lambda, muJ, sigmaJ, optionType);
    return (pUp - 2 * pMid + pDown) / (h * h);
  };
  
  const calculateTheta = (S: number, K: number, r: number, T: number, sigma: number, 
                           lambda: number, muJ: number, sigmaJ: number): number => {
    const h = 0.01;
    if (T <= h) return 0; // Avoid negative time to maturity
    const pNow = calculatePrice(S, K, r, T, sigma, lambda, muJ, sigmaJ, optionType);
    const pLater = calculatePrice(S, K, r, T - h, sigma, lambda, muJ, sigmaJ, optionType);
    return (pLater - pNow) / h;
  };
  
  const calculateVega = (S: number, K: number, r: number, T: number, sigma: number, 
                           lambda: number, muJ: number, sigmaJ: number): number => {
    const h = 0.01;
    const pUp = calculatePrice(S, K, r, T, sigma + h, lambda, muJ, sigmaJ, optionType);
    const pDown = calculatePrice(S, K, r, T, sigma - h, lambda, muJ, sigmaJ, optionType);
    return (pUp - pDown) / (2 * h);
  };
  
  const calculateLambdaSensitivity = (S: number, K: number, r: number, T: number, sigma: number, 
                                      lambda: number, muJ: number, sigmaJ: number): number => {
    const h = 0.1;
    const pUp = calculatePrice(S, K, r, T, sigma, lambda + h, muJ, sigmaJ, optionType);
    const pDown = calculatePrice(S, K, r, T, sigma, lambda - h, muJ, sigmaJ, optionType);
    return (pUp - pDown) / (2 * h);
  };
  
  // Price calculator for a specific set of parameters
  const calculatePrice = (S: number, K: number, r: number, T: number, sigma: number, 
                          lambda: number, muJ: number, sigmaJ: number, type: string): number => {
    const maxJumps = 10;
    let price = 0;
    
    for (let n = 0; n <= maxJumps; n++) {
      const poissonProb = Math.exp(-lambda * T) * Math.pow(lambda * T, n) / factorial(n);
      const adjustedSigma = Math.sqrt(sigma * sigma + n * sigmaJ * sigmaJ / T);
      const adjustedR = r - lambda * (Math.exp(muJ) - 1) + n * muJ / T;
      
      const d1 = (Math.log(S / K) + (adjustedR + 0.5 * adjustedSigma * adjustedSigma) * T) / (adjustedSigma * Math.sqrt(T));
      const d2 = d1 - adjustedSigma * Math.sqrt(T);
      
      let jumpPrice = 0;
      if (type === "call") {
        jumpPrice = S * Math.exp((adjustedR - r) * T) * cnd(d1) - K * Math.exp(-r * T) * cnd(d2);
      } else {
        jumpPrice = K * Math.exp(-r * T) * cnd(-d2) - S * Math.exp((adjustedR - r) * T) * cnd(-d1);
      }
      
      price += poissonProb * jumpPrice;
    }
    
    return price;
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
            <Label htmlFor="jump-size">Jump Size (μ)</Label>
            <Input
              id="jump-size"
              type="number"
              step="0.01"
              value={jumpSize}
              onChange={(e) => setJumpSize(parseFloat(e.target.value) || 0)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="jump-volatility">Jump Volatility (σᴊ)</Label>
            <Input
              id="jump-volatility"
              type="number"
              step="0.01"
              value={jumpVolatility}
              onChange={(e) => setJumpVolatility(parseFloat(e.target.value) || 0)}
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
        
        <Button className="w-full" onClick={calculateJumpDiffusion}>
          Calculate Using Jump Diffusion
        </Button>
        
        {optionPrice !== null && greeks && (
          <Card className="mt-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">Results</h3>
              <p className="text-3xl font-bold text-green-600">${optionPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Option Price</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-sm font-medium">Delta</p>
                  <p className="text-lg">{greeks.delta.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Gamma</p>
                  <p className="text-lg">{greeks.gamma.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Theta (per day)</p>
                  <p className="text-lg">{greeks.theta.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Vega (per 1% vol)</p>
                  <p className="text-lg">{greeks.vega.toFixed(4)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Lambda Sensitivity</p>
                  <p className="text-lg">{greeks.lambda.toFixed(4)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Option Pricing Sensitivity</h3>
        {sensitivityData.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="underlying" 
                  label={{ value: 'Underlying Price ($)', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  label={{ value: 'Option Price ($)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, '']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="callPrice" 
                  name="Call Price" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="putPrice" 
                  name="Put Price" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="intrinsicCall" 
                  name="Call Intrinsic" 
                  stroke="#10B981" 
                  strokeDasharray="5 5"
                  strokeWidth={1} 
                />
                <Line 
                  type="monotone" 
                  dataKey="intrinsicPut" 
                  name="Put Intrinsic" 
                  stroke="#3B82F6" 
                  strokeDasharray="5 5"
                  strokeWidth={1} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Calculate option price to see sensitivity chart</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          The solid lines show option values, dashed lines show intrinsic values
        </p>
      </div>
    </div>
  );
};

export default JumpDiffusionValuation;
