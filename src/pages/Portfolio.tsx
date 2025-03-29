
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { AssetBreakdown } from "@/components/dashboard/AssetBreakdown";
import { useState } from "react";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";

const Portfolio = () => {
  const [timeframe, setTimeframe] = useState("1Y");
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Portfolio Details</h1>
            <p className="text-sm text-slate-500 mt-1">Deep dive into your investment portfolio</p>
          </div>
          <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
        </div>
        
        <Tabs defaultValue="breakdown">
          <TabsList className="mb-4">
            <TabsTrigger value="breakdown">Asset Breakdown</TabsTrigger>
            <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="breakdown">
            <AssetBreakdown timeframe={timeframe} />
          </TabsContent>
          
          <TabsContent value="risk">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Value at Risk (VaR)</CardTitle>
                  <CardDescription>95% confidence level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">-$4,250</div>
                  <p className="text-sm text-slate-500 mt-1">Maximum daily loss with 95% confidence</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Expected Shortfall</CardTitle>
                  <CardDescription>95% confidence level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-800">-$6,830</div>
                  <p className="text-sm text-slate-500 mt-1">Average loss in worst 5% scenarios</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Portfolio Stress Test Results</CardTitle>
                <CardDescription>Estimated impact of market scenarios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-red-50 border border-red-100">
                    <div className="text-xl font-semibold text-red-700">-24.5%</div>
                    <p className="text-sm text-slate-700">Market Crash Scenario</p>
                  </div>
                  <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
                    <div className="text-xl font-semibold text-amber-700">-12.3%</div>
                    <p className="text-sm text-slate-700">High Inflation Scenario</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                    <div className="text-xl font-semibold text-blue-700">-8.7%</div>
                    <p className="text-sm text-slate-700">Rising Interest Rates</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Alert className="bg-slate-50">
              <Info className="h-4 w-4" />
              <AlertTitle>Understanding Risk Metrics</AlertTitle>
              <AlertDescription>
                Value at Risk (VaR) estimates the maximum loss expected over a given time period at a specified confidence level.
                Expected Shortfall indicates the average loss in the worst outcomes beyond the VaR threshold.
              </AlertDescription>
            </Alert>
          </TabsContent>
          
          <TabsContent value="allocation">
            <Card>
              <CardHeader>
                <CardTitle>Current vs. Target Allocation</CardTitle>
                <CardDescription>Review and adjust your investment strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Equities</span>
                      <span className="text-sm text-slate-500">62% vs 60% target</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-blue-500" style={{ width: "62%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Fixed Income</span>
                      <span className="text-sm text-slate-500">28% vs 30% target</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-green-500" style={{ width: "28%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Alternatives</span>
                      <span className="text-sm text-slate-500">7% vs 5% target</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-purple-500" style={{ width: "7%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Cash</span>
                      <span className="text-sm text-slate-500">3% vs 5% target</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded">
                      <div className="h-full rounded bg-amber-500" style={{ width: "3%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
