
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { generateAssetAllocation } from "@/lib/mock-data";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, TrendingUp } from "lucide-react";

interface AssetBreakdownProps {
  timeframe: string;
}

export const AssetBreakdown = ({ timeframe }: AssetBreakdownProps) => {
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const assetData = generateAssetAllocation();
  
  const COLORS = ['#0EA5E9', '#8B5CF6', '#F97316', '#10B981', '#F59E0B', '#6366F1'];
  
  // Custom rendering for the legend
  const renderLegend = (props: any) => {
    const { payload } = props;
    
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <div 
            key={`legend-${index}`} 
            className={`flex items-center cursor-pointer p-1 rounded transition-colors ${selectedAsset === entry.value ? 'bg-slate-100' : ''}`}
            onClick={() => setSelectedAsset(selectedAsset === entry.value ? null : entry.value)}
          >
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }} />
            <span className="text-xs font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  const filteredData = selectedAsset
    ? assetData.filter(item => item.name === selectedAsset)
    : assetData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Breakdown</CardTitle>
        <CardDescription>Allocation and performance by asset class</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="allocation">
          <TabsList className="mb-4">
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="allocation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      onClick={(data) => setSelectedAsset(selectedAsset === data.name ? null : data.name)}
                    >
                      {assetData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          style={{ 
                            opacity: selectedAsset && selectedAsset !== entry.name ? 0.4 : 1,
                            filter: selectedAsset === entry.name ? 'drop-shadow(0px 0px 4px rgba(0,0,0,0.2))' : 'none'
                          }}
                        />
                      ))}
                    </Pie>
                    <Legend content={renderLegend} />
                    <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Allocation</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((asset, index) => (
                      <TableRow key={index} className="cursor-pointer hover:bg-slate-50" onClick={() => setSelectedAsset(selectedAsset === asset.name ? null : asset.name)}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[assetData.findIndex(a => a.name === asset.name) % COLORS.length] }}/>
                            {asset.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">${asset.value.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          {((asset.value / assetData.reduce((sum, a) => sum + a.value, 0)) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    {selectedAsset && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center">
                          <button 
                            className="text-xs text-blue-600 hover:text-blue-800" 
                            onClick={() => setSelectedAsset(null)}
                          >
                            Clear selection
                          </button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="performance">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead className="text-right">Return ({timeframe})</TableHead>
                  <TableHead className="text-right">Volatility</TableHead>
                  <TableHead className="text-right">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetData.map((asset, index) => {
                  // Generate random performance data for demo
                  const return1y = (Math.random() * 40) - 15;
                  const volatility = Math.random() * 20;
                  
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}/>
                          {asset.name}
                        </div>
                      </TableCell>
                      <TableCell className={`text-right ${return1y >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {return1y >= 0 ? '+' : ''}{return1y.toFixed(2)}%
                      </TableCell>
                      <TableCell className="text-right">{volatility.toFixed(2)}%</TableCell>
                      <TableCell className="text-right">
                        {return1y >= 0 ? 
                          <TrendingUp className="inline-block ml-2 h-4 w-4 text-green-600" /> : 
                          <TrendingDown className="inline-block ml-2 h-4 w-4 text-red-600" />
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
