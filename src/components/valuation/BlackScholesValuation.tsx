
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const BlackScholesValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  const [dividend, setDividend] = useState<number>(0);
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
  
  const calculateBlackScholes = () => {
    // Black-Scholes inputs
    const S = spotPrice;
    const K = strikePrice;
    const r = riskFreeRate;
    const T = timeToMaturity;
    const sigma = volatility;
    const q = dividend;
    
    // Calculations
    const d1 = (Math.log(S / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);
    
    let price = 0;
    let delta = 0;
    let gamma = 0;
    let theta = 0;
    let vega = 0;
    let rho = 0;
    
    if (optionType === "call") {
      price = S * Math.exp(-q * T) * cnd(d1) - K * Math.exp(-r * T) * cnd(d2);
      delta = Math.exp(-q * T) * cnd(d1);
      theta = -(S * sigma * Math.exp(-q * T) * Math.exp(-d1 * d1 / 2) / (2 * Math.sqrt(2 * Math.PI * T)) + 
              q * S * Math.exp(-q * T) * cnd(d1) - 
              r * K * Math.exp(-r * T) * cnd(d2)) / 365;
    } else {
      price = K * Math.exp(-r * T) * cnd(-d2) - S * Math.exp(-q * T) * cnd(-d1);
      delta = Math.exp(-q * T) * (cnd(d1) - 1);
      theta = -(S * sigma * Math.exp(-q * T) * Math.exp(-d1 * d1 / 2) / (2 * Math.sqrt(2 * Math.PI * T)) - 
              q * S * Math.exp(-q * T) * cnd(-d1) - 
              r * K * Math.exp(-r * T) * cnd(-d2)) / 365;
    }
    
    // Common greeks
    gamma = Math.exp(-q * T) * Math.exp(-d1 * d1 / 2) / (S * sigma * Math.sqrt(2 * Math.PI * T));
    vega = S * Math.exp(-q * T) * Math.sqrt(T) * Math.exp(-d1 * d1 / 2) / Math.sqrt(2 * Math.PI) / 100;
    rho = (optionType === "call") 
      ? K * T * Math.exp(-r * T) * cnd(d2) / 100
      : -K * T * Math.exp(-r * T) * cnd(-d2) / 100;
    
    // Generate sensitivity data
    const sensData = [];
    
    // Generate price vs. underlying price
    const pricePadding = S * 0.2;
    for (let underlying = S - pricePadding; underlying <= S + pricePadding; underlying += pricePadding / 10) {
      const tD1 = (Math.log(underlying / K) + (r - q + 0.5 * sigma * sigma) * T) / (sigma * Math.sqrt(T));
      const tD2 = tD1 - sigma * Math.sqrt(T);
      
      let callPrice = 0;
      let putPrice = 0;
      
      callPrice = underlying * Math.exp(-q * T) * cnd(tD1) - K * Math.exp(-r * T) * cnd(tD2);
      putPrice = K * Math.exp(-r * T) * cnd(-tD2) - underlying * Math.exp(-q * T) * cnd(-tD1);
      
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
      rho
    });
    setSensitivityData(sensData);
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
            <Label htmlFor="dividend">Dividend Yield</Label>
            <Input
              id="dividend"
              type="number"
              step="0.001"
              value={dividend}
              onChange={(e) => setDividend(parseFloat(e.target.value) || 0)}
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
        
        <Button className="w-full" onClick={calculateBlackScholes}>
          Calculate Using Black-Scholes
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
                  <p className="text-sm font-medium">Rho (per 1% rate)</p>
                  <p className="text-lg">{greeks.rho.toFixed(4)}</p>
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

export default BlackScholesValuation;
