
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Node = {
  price: number;
  value: number;
  x: number;
  y: number;
};

type Edge = {
  source: { x: number; y: number };
  target: { x: number; y: number };
  probability: number;
};

const BinomialTreeValuation = () => {
  const [spotPrice, setSpotPrice] = useState<number>(100);
  const [strikePrice, setStrikePrice] = useState<number>(100);
  const [volatility, setVolatility] = useState<number>(0.2);
  const [riskFreeRate, setRiskFreeRate] = useState<number>(0.05);
  const [timeToMaturity, setTimeToMaturity] = useState<number>(1);
  const [steps, setSteps] = useState<number>(5);
  const [optionType, setOptionType] = useState<string>("call");
  const [optionStyle, setOptionStyle] = useState<string>("european");
  const [optionPrice, setOptionPrice] = useState<number | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  
  const runBinomialTree = () => {
    // Time step
    const dt = timeToMaturity / steps;
    
    // Calculate up and down factors
    const u = Math.exp(volatility * Math.sqrt(dt));
    const d = 1 / u;
    
    // Risk-neutral probability
    const p = (Math.exp(riskFreeRate * dt) - d) / (u - d);
    
    // Generate the tree nodes and edges
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Generate price tree (forward pass)
    const priceTree: number[][] = [];
    for (let i = 0; i <= steps; i++) {
      priceTree[i] = [];
      for (let j = 0; j <= i; j++) {
        const price = spotPrice * Math.pow(u, j) * Math.pow(d, i - j);
        priceTree[i][j] = price;
        
        // Add node
        newNodes.push({
          price,
          value: 0, // Will be filled in backward pass
          x: i * 100,
          y: (j - i/2) * 70
        });
        
        // Add edges
        if (i < steps) {
          // Up edge
          newEdges.push({
            source: { x: i * 100, y: (j - i/2) * 70 },
            target: { x: (i+1) * 100, y: ((j+1) - (i+1)/2) * 70 },
            probability: p
          });
          
          // Down edge
          newEdges.push({
            source: { x: i * 100, y: (j - i/2) * 70 },
            target: { x: (i+1) * 100, y: (j - (i+1)/2) * 70 },
            probability: 1-p
          });
        }
      }
    }
    
    // Generate option value tree (backward pass)
    const valueTree: number[][] = [];
    for (let i = 0; i <= steps; i++) {
      valueTree[i] = [];
    }
    
    // Terminal values
    for (let j = 0; j <= steps; j++) {
      if (optionType === "call") {
        valueTree[steps][j] = Math.max(0, priceTree[steps][j] - strikePrice);
      } else {
        valueTree[steps][j] = Math.max(0, strikePrice - priceTree[steps][j]);
      }
    }
    
    // Backward induction
    for (let i = steps - 1; i >= 0; i--) {
      for (let j = 0; j <= i; j++) {
        const exerciseValue = optionType === "call"
          ? Math.max(0, priceTree[i][j] - strikePrice)
          : Math.max(0, strikePrice - priceTree[i][j]);
        
        const continuationValue = Math.exp(-riskFreeRate * dt) * 
          (p * valueTree[i+1][j+1] + (1-p) * valueTree[i+1][j]);
        
        if (optionStyle === "american") {
          valueTree[i][j] = Math.max(exerciseValue, continuationValue);
        } else {
          valueTree[i][j] = continuationValue;
        }
      }
    }
    
    // Update node values
    for (let i = 0; i <= steps; i++) {
      for (let j = 0; j <= i; j++) {
        const nodeIndex = newNodes.findIndex(
          n => Math.abs(n.x - i * 100) < 0.1 && Math.abs(n.y - (j - i/2) * 70) < 0.1
        );
        if (nodeIndex !== -1) {
          newNodes[nodeIndex].value = valueTree[i][j];
        }
      }
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    setOptionPrice(valueTree[0][0]);
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
            <Label htmlFor="steps">Number of Steps</Label>
            <Input
              id="steps"
              type="number"
              min="1"
              max="10"
              value={steps}
              onChange={(e) => setSteps(parseInt(e.target.value) || 1)}
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
        
        <Button className="w-full" onClick={runBinomialTree}>
          Calculate Using Binomial Tree
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
        <h3 className="text-lg font-semibold mb-4">Binomial Tree Visualization</h3>
        {nodes.length > 0 ? (
          <div className="h-80 overflow-auto">
            <svg width={(steps+1) * 120} height="300" viewBox={`-20 -150 ${(steps+1) * 120} 300`}>
              {/* Draw edges first */}
              {edges.map((edge, i) => (
                <g key={`edge-${i}`}>
                  <line
                    x1={edge.source.x}
                    y1={edge.source.y}
                    x2={edge.target.x}
                    y2={edge.target.y}
                    stroke="#aaa"
                    strokeWidth="1"
                  />
                  <text
                    x={(edge.source.x + edge.target.x) / 2}
                    y={(edge.source.y + edge.target.y) / 2 - 5}
                    fontSize="10"
                    fill="#666"
                    textAnchor="middle"
                  >
                    {edge.probability.toFixed(2)}
                  </text>
                </g>
              ))}
              
              {/* Draw nodes */}
              {nodes.map((node, i) => (
                <g key={`node-${i}`}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    fill="white"
                    stroke={optionType === "call" ? "#10B981" : "#3B82F6"}
                    strokeWidth="2"
                  />
                  <text
                    x={node.x}
                    y={node.y - 5}
                    fontSize="10"
                    textAnchor="middle"
                  >
                    ${node.price.toFixed(1)}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + 12}
                    fontSize="12"
                    fontWeight="bold"
                    fill={optionType === "call" ? "#10B981" : "#3B82F6"}
                    textAnchor="middle"
                  >
                    ${node.value.toFixed(2)}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Generate a tree to visualize</p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Each node shows: Asset Price (top) and Option Value (bottom)
        </p>
      </div>
    </div>
  );
};

export default BinomialTreeValuation;
