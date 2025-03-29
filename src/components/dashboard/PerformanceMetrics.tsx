
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { generatePerformanceMetrics } from "@/lib/mock-data";

interface PerformanceMetricsProps {
  timeframe: string;
}

export const PerformanceMetrics = ({ timeframe }: PerformanceMetricsProps) => {
  const metricsData = generatePerformanceMetrics();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Key Metrics</CardTitle>
        <CardDescription>Volatility and return analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {metricsData.metrics.map((metric, index) => (
            <div key={index} className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-500">{metric.name}</p>
              <p className="text-xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>
        
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={metricsData.monthlyReturns}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="month" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFF', borderRadius: '0.375rem', border: '1px solid #E2E8F0' }}
                formatter={(value) => [`${Number(value).toFixed(2)}%`, "Return"]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar 
                dataKey="return" 
                fill={(data: any) => data.return >= 0 ? "#10B981" : "#EF4444"}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
