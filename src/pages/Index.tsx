
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { AssetBreakdown } from "@/components/dashboard/AssetBreakdown";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { ReturnForecast } from "@/components/dashboard/ReturnForecast";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";
import { useState } from "react";

const Index = () => {
  const [timeframe, setTimeframe] = useState("1Y");
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Portfolio Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">Track your investments and analyze performance</p>
          </div>
          <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PortfolioOverview timeframe={timeframe} />
          <PerformanceMetrics timeframe={timeframe} />
        </div>
        
        <div className="mb-6">
          <AssetBreakdown timeframe={timeframe} />
        </div>
        
        <div>
          <ReturnForecast />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
