
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from "recharts";
import { Info } from "lucide-react";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";
import { useState } from "react";

const Analysis = () => {
  const [timeframe, setTimeframe] = useState("1Y");
  
  // Sample return distribution data
  const returnDistribution = [
    { return: "-5% to -4%", frequency: 3 },
    { return: "-4% to -3%", frequency: 5 },
    { return: "-3% to -2%", frequency: 8 },
    { return: "-2% to -1%", frequency: 12 },
    { return: "-1% to 0%", frequency: 18 },
    { return: "0% to 1%", frequency: 25 },
    { return: "1% to 2%", frequency: 20 },
    { return: "2% to 3%", frequency: 15 },
    { return: "3% to 4%", frequency: 7 },
    { return: "4% to 5%", frequency: 4 },
  ];
  
  // Sample volatility data
  const volatilityData = [
    { name: "Jan", portfolio: 12.5, benchmark: 15.2 },
    { name: "Feb", portfolio: 13.1, benchmark: 14.8 },
    { name: "Mar", portfolio: 15.7, benchmark: 16.3 },
    { name: "Apr", portfolio: 14.3, benchmark: 15.7 },
    { name: "May", portfolio: 13.8, benchmark: 15.2 },
    { name: "Jun", portfolio: 12.9, benchmark: 14.8 },
    { name: "Jul", portfolio: 12.2, benchmark: 13.9 },
    { name: "Aug", portfolio: 12.7, benchmark: 14.5 },
    { name: "Sep", portfolio: 13.5, benchmark: 15.1 },
    { name: "Oct", portfolio: 14.1, benchmark: 15.8 },
    { name: "Nov", portfolio: 13.7, benchmark: 15.3 },
    { name: "Dec", portfolio: 12.8, benchmark: 14.7 },
  ];
  
  // Sample correlation data
  const correlationData = [
    { x: 8, y: 12, z: 10, name: "Technology" },
    { x: 6, y: 8, z: 8, name: "Healthcare" },
    { x: 4, y: 5, z: 6, name: "Consumer Staples" },
    { x: 7, y: 4, z: 7, name: "Energy" },
    { x: 5, y: 6, z: 9, name: "Financial" },
    { x: 9, y: 7, z: 5, name: "Real Estate" },
    { x: 6, y: 9, z: 8, name: "Utilities" },
    { x: 3, y: 8, z: 4, name: "Materials" },
  ];
  
  // Sample historical statistics
  const historicalStats = [
    {
      title: "Annualized Return",
      value: "12.4%",
      benchmark: "9.8%",
      difference: "+2.6%",
      isPositive: true
    },
    {
      title: "Annualized Volatility",
      value: "13.2%",
      benchmark: "15.3%",
      difference: "-2.1%",
      isPositive: true
    },
    {
      title: "Sharpe Ratio",
      value: "1.05",
      benchmark: "0.85",
      difference: "+0.20",
      isPositive: true
    },
    {
      title: "Maximum Drawdown",
      value: "-18.3%",
      benchmark: "-22.5%",
      difference: "+4.2%",
      isPositive: true
    },
    {
      title: "Beta",
      value: "0.87",
      benchmark: "1.00",
      difference: "-0.13",
      isPositive: true
    },
    {
      title: "Alpha",
      value: "3.2%",
      benchmark: "0.0%",
      difference: "+3.2%",
      isPositive: true
    }
  ];
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Statistical Analysis</h1>
            <p className="text-sm text-slate-500 mt-1">Deep dive into portfolio statistics</p>
          </div>
          <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {historicalStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center mt-1">
                  <span className="text-sm text-slate-500 mr-2">vs. Benchmark {stat.benchmark}</span>
                  <span className={`text-xs font-medium ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                    {stat.difference}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Tabs defaultValue="distribution">
          <TabsList className="mb-4">
            <TabsTrigger value="distribution">Return Distribution</TabsTrigger>
            <TabsTrigger value="volatility">Volatility Analysis</TabsTrigger>
            <TabsTrigger value="correlation">Correlation Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Return Distribution</CardTitle>
                <CardDescription>Frequency of returns across different ranges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={returnDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="return" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="frequency" fill="#6366F1" name="Frequency" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <Alert className="mt-4 bg-slate-50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>About Return Distribution</AlertTitle>
                  <AlertDescription>
                    This histogram shows how frequently your portfolio returns fall within specific ranges.
                    A normal distribution suggests stable performance, while skewed distributions may indicate more extreme outcomes.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="volatility">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Rolling Volatility</CardTitle>
                <CardDescription>30-day annualized volatility compared to benchmark</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={volatilityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 'dataMax + 5']} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="portfolio" stroke="#10B981" name="Portfolio" strokeWidth={2} />
                      <Line type="monotone" dataKey="benchmark" stroke="#6366F1" name="Benchmark" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <Alert className="mt-4 bg-slate-50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>About Volatility</AlertTitle>
                  <AlertDescription>
                    Volatility measures the dispersion of returns around the mean. Lower volatility typically indicates less risk
                    and more predictable performance, assuming returns are similar.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="correlation">
            <Card>
              <CardHeader>
                <CardTitle>Asset Correlation</CardTitle>
                <CardDescription>Relationship between sectors in your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="x" name="Risk" unit="%" domain={[0, 10]} />
                      <YAxis type="number" dataKey="y" name="Return" unit="%" domain={[0, 15]} />
                      <ZAxis type="number" dataKey="z" range={[100, 500]} />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(value: any) => [`${value}%`, ""]} />
                      <Legend />
                      <Scatter name="Sectors" data={correlationData} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-sm text-slate-600">
                  <p className="mb-2">The scatter plot shows the risk-return profile of different sectors in your portfolio:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>X-axis represents risk (volatility)</li>
                    <li>Y-axis represents return</li>
                    <li>Bubble size represents allocation percentage</li>
                  </ul>
                  <p className="mt-2">Sectors that are positioned in the upper-left offer the best risk-adjusted returns.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Analysis;
