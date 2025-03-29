
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";
import { generateForecastData } from "@/lib/mock-data";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const ReturnForecast = () => {
  const { forecastData, scenarioAnalysis } = generateForecastData();
  
  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle>Return Forecast</CardTitle>
        <CardDescription>Projected returns with confidence intervals</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="forecast">
          <TabsList className="mb-4">
            <TabsTrigger value="forecast">Forecast Chart</TabsTrigger>
            <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="forecast">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={forecastData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#38BDF8" stopOpacity={0.1} />
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
                  <ReferenceLine x="Jan 2024" stroke="#94A3B8" strokeDasharray="3 3" label={{ value: 'Forecast Start', position: 'top', fill: '#94A3B8', fontSize: 12 }} />
                  
                  {/* Historical data */}
                  <Line
                    type="monotone"
                    dataKey="historical"
                    stroke="#0EA5E9"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  
                  {/* Forecast data */}
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                    activeDot={{ r: 6 }}
                  />
                  
                  {/* Confidence intervals */}
                  <Area
                    type="monotone"
                    dataKey="upperBound"
                    stroke="none"
                    fill="url(#splitColor)"
                    activeDot={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="lowerBound"
                    stroke="none"
                    fill="url(#splitColor)"
                    activeDot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span className="text-xs text-slate-600">Historical</span>
              </div>
              <div className="flex items-center mr-4">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-xs text-slate-600">Forecast</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-200 mr-2"></div>
                <span className="text-xs text-slate-600">Confidence Interval (95%)</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="scenarios">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scenario</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Expected Return</TableHead>
                  <TableHead className="text-right">Probability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarioAnalysis.map((scenario, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{scenario.name}</TableCell>
                    <TableCell>{scenario.description}</TableCell>
                    <TableCell className={`text-right ${scenario.expectedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {scenario.expectedReturn >= 0 ? '+' : ''}{scenario.expectedReturn}%
                    </TableCell>
                    <TableCell className="text-right">{scenario.probability}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <p className="text-xs text-slate-500 mt-4">
              Note: These scenarios are based on historical data and market analysis. Actual results may vary significantly.
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
