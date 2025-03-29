
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

const Performance = () => {
  const [timeframe, setTimeframe] = useState("1Y");
  const [benchmarkIndex, setBenchmarkIndex] = useState<string>("sp500");
  
  // Sample data for comparing performance
  const comparisonData = [
    { month: "Jan", portfolio: 4.3, sp500: 3.8, nasdaq: 5.2, dow: 2.8 },
    { month: "Feb", portfolio: 2.1, sp500: 2.5, nasdaq: 3.1, dow: 1.9 },
    { month: "Mar", portfolio: -1.2, sp500: -0.8, nasdaq: -1.5, dow: -0.5 },
    { month: "Apr", portfolio: 3.5, sp500: 2.8, nasdaq: 3.8, dow: 2.2 },
    { month: "May", portfolio: 1.8, sp500: 1.5, nasdaq: 2.0, dow: 1.3 },
    { month: "Jun", portfolio: 0.9, sp500: 0.5, nasdaq: 0.7, dow: 0.3 },
    { month: "Jul", portfolio: 2.7, sp500: 2.2, nasdaq: 2.9, dow: 1.8 },
    { month: "Aug", portfolio: 1.5, sp500: 1.2, nasdaq: 1.6, dow: 1.0 },
    { month: "Sep", portfolio: -0.8, sp500: -1.0, nasdaq: -1.3, dow: -0.7 },
    { month: "Oct", portfolio: 3.2, sp500: 2.7, nasdaq: 3.5, dow: 2.0 },
    { month: "Nov", portfolio: 2.4, sp500: 2.0, nasdaq: 2.5, dow: 1.7 },
    { month: "Dec", portfolio: 1.9, sp500: 1.5, nasdaq: 2.1, dow: 1.2 },
  ];
  
  // Calculate cumulative returns
  const cumulativeData = comparisonData.reduce((acc, curr, index) => {
    if (index === 0) {
      acc.push({
        month: curr.month,
        portfolio: 100 + curr.portfolio,
        sp500: 100 + curr.sp500,
        nasdaq: 100 + curr.nasdaq,
        dow: 100 + curr.dow,
      });
    } else {
      const prev = acc[index - 1];
      acc.push({
        month: curr.month,
        portfolio: prev.portfolio * (1 + curr.portfolio / 100),
        sp500: prev.sp500 * (1 + curr.sp500 / 100),
        nasdaq: prev.nasdaq * (1 + curr.nasdaq / 100),
        dow: prev.dow * (1 + curr.dow / 100),
      });
    }
    return acc;
  }, [] as any[]);
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Performance Analysis</h1>
            <p className="text-sm text-slate-500 mt-1">Compare your returns with market benchmarks</p>
          </div>
          <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
        </div>
        
        <div className="mb-6">
          <PerformanceMetrics timeframe={timeframe} />
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Benchmark Comparison</CardTitle>
            <CardDescription>How your portfolio performs against major indices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                className={`px-3 py-1 text-sm rounded-full ${benchmarkIndex === "sp500" ? "bg-blue-100 text-blue-700" : "bg-slate-100"}`}
                onClick={() => setBenchmarkIndex("sp500")}
              >
                S&P 500
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-full ${benchmarkIndex === "nasdaq" ? "bg-blue-100 text-blue-700" : "bg-slate-100"}`}
                onClick={() => setBenchmarkIndex("nasdaq")}
              >
                NASDAQ
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded-full ${benchmarkIndex === "dow" ? "bg-blue-100 text-blue-700" : "bg-slate-100"}`}
                onClick={() => setBenchmarkIndex("dow")}
              >
                Dow Jones
              </button>
            </div>
            
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)}`, "Value"]} />
                  <Legend />
                  <Line type="monotone" dataKey="portfolio" stroke="#10B981" strokeWidth={2} activeDot={{ r: 8 }} name="Your Portfolio" />
                  <Line type="monotone" dataKey={benchmarkIndex} stroke="#6366F1" strokeWidth={2} name={benchmarkIndex === "sp500" ? "S&P 500" : benchmarkIndex === "nasdaq" ? "NASDAQ" : "Dow Jones"} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performance Attribution</CardTitle>
            <CardDescription>What's driving your returns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sector">
              <TabsList className="mb-4">
                <TabsTrigger value="sector">By Sector</TabsTrigger>
                <TabsTrigger value="holdings">Top Holdings</TabsTrigger>
                <TabsTrigger value="factors">Risk Factors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sector">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Technology</span>
                      <span className="text-sm font-medium text-emerald-600">+2.45%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-emerald-500" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Healthcare</span>
                      <span className="text-sm font-medium text-emerald-600">+1.32%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-emerald-500" style={{ width: "42%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Financials</span>
                      <span className="text-sm font-medium text-red-600">-0.87%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-red-500" style={{ width: "28%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Consumer Discretionary</span>
                      <span className="text-sm font-medium text-emerald-600">+0.95%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-emerald-500" style={{ width: "35%" }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="holdings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between">
                      <span className="font-medium">AAPL</span>
                      <span className="font-medium text-emerald-600">+4.2%</span>
                    </div>
                    <p className="text-sm text-slate-500">Apple Inc.</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between">
                      <span className="font-medium">MSFT</span>
                      <span className="font-medium text-emerald-600">+3.8%</span>
                    </div>
                    <p className="text-sm text-slate-500">Microsoft Corp.</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between">
                      <span className="font-medium">AMZN</span>
                      <span className="font-medium text-emerald-600">+2.9%</span>
                    </div>
                    <p className="text-sm text-slate-500">Amazon.com Inc.</p>
                  </div>
                  <div className="p-4 rounded-lg border">
                    <div className="flex justify-between">
                      <span className="font-medium">GOOGL</span>
                      <span className="font-medium text-emerald-600">+2.3%</span>
                    </div>
                    <p className="text-sm text-slate-500">Alphabet Inc.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="factors">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Market Beta</span>
                      <span className="text-sm font-medium">+1.75%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-blue-500" style={{ width: "55%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Size (Small Cap)</span>
                      <span className="text-sm font-medium">+0.62%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-blue-500" style={{ width: "32%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Value</span>
                      <span className="text-sm font-medium">-0.45%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-red-500" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Momentum</span>
                      <span className="text-sm font-medium">+1.23%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-blue-500" style={{ width: "45%" }}></div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Performance;
