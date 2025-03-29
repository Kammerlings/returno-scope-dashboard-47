
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { generatePortfolioData } from "@/lib/mock-data";

interface PortfolioOverviewProps {
  timeframe: string;
}

export const PortfolioOverview = ({ timeframe }: PortfolioOverviewProps) => {
  const portfolioData = generatePortfolioData(timeframe);
  const currentValue = portfolioData[portfolioData.length - 1].value;
  const initialValue = portfolioData[0].value;
  const percentChange = ((currentValue - initialValue) / initialValue) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Value</CardTitle>
        <CardDescription>Historical performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <span className="text-3xl font-bold">${currentValue.toLocaleString()}</span>
          <span className={`ml-2 text-sm font-medium ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
          </span>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={portfolioData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#FFF', borderRadius: '0.375rem', border: '1px solid #E2E8F0' }}
                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Value"]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0EA5E9" 
                fill="url(#colorValue)" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
