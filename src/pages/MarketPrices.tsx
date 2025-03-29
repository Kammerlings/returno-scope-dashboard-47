
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";

// Mock stock market data
const fetchMarketData = async () => {
  // In a real app, this would be an API call to fetch live market data
  return {
    stocks: [
      { symbol: "AAPL", name: "Apple Inc.", price: 182.63, change: 1.25, changePercent: 0.69 },
      { symbol: "MSFT", name: "Microsoft Corp.", price: 416.38, change: -2.54, changePercent: -0.61 },
      { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.12, change: 0.87, changePercent: 0.49 },
      { symbol: "GOOGL", name: "Alphabet Inc.", price: 162.08, change: -0.92, changePercent: -0.56 },
      { symbol: "META", name: "Meta Platforms Inc.", price: 477.85, change: 5.21, changePercent: 1.10 },
      { symbol: "TSLA", name: "Tesla Inc.", price: 184.86, change: -3.14, changePercent: -1.67 },
      { symbol: "NVDA", name: "NVIDIA Corp.", price: 953.86, change: 12.54, changePercent: 1.33 },
      { symbol: "BRK.A", name: "Berkshire Hathaway", price: 621754.0, change: 2341.0, changePercent: 0.38 },
    ],
    indices: [
      { symbol: "^DJI", name: "Dow Jones Industrial Average", price: 39171.75, change: -38.62, changePercent: -0.10 },
      { symbol: "^GSPC", name: "S&P 500", price: 5203.58, change: 14.17, changePercent: 0.27 },
      { symbol: "^IXIC", name: "NASDAQ Composite", price: 16274.09, change: 65.43, changePercent: 0.40 },
      { symbol: "^RUT", name: "Russell 2000", price: 2063.37, change: -12.14, changePercent: -0.58 },
    ],
    historicalData: [
      { date: "2023-01-01", SPX: 3800, DOW: 33000, NASDAQ: 10500 },
      { date: "2023-02-01", SPX: 3900, DOW: 33500, NASDAQ: 11000 },
      { date: "2023-03-01", SPX: 3950, DOW: 32800, NASDAQ: 11200 },
      { date: "2023-04-01", SPX: 4100, DOW: 33700, NASDAQ: 12000 },
      { date: "2023-05-01", SPX: 4150, DOW: 34000, NASDAQ: 12500 },
      { date: "2023-06-01", SPX: 4300, DOW: 34500, NASDAQ: 13200 },
      { date: "2023-07-01", SPX: 4400, DOW: 35000, NASDAQ: 13800 },
      { date: "2023-08-01", SPX: 4450, DOW: 35200, NASDAQ: 14000 },
      { date: "2023-09-01", SPX: 4350, DOW: 34800, NASDAQ: 13500 },
      { date: "2023-10-01", SPX: 4250, DOW: 34300, NASDAQ: 13200 },
      { date: "2023-11-01", SPX: 4500, DOW: 36000, NASDAQ: 14200 },
      { date: "2023-12-01", SPX: 4700, DOW: 37500, NASDAQ: 14800 },
      { date: "2024-01-01", SPX: 4800, DOW: 38000, NASDAQ: 15200 },
      { date: "2024-02-01", SPX: 4950, DOW: 38700, NASDAQ: 15600 },
      { date: "2024-03-01", SPX: 5100, DOW: 39200, NASDAQ: 16000 },
      { date: "2024-04-01", SPX: 5200, DOW: 39100, NASDAQ: 16300 },
    ]
  };
};

const MarketPrices = () => {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ['marketPrices'],
    queryFn: fetchMarketData,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-semibold mb-6">Loading market data...</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-semibold mb-6">Market Prices</h1>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Market Overview</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="indices">Indices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Major Indices Performance</CardTitle>
                  <CardDescription>Historical performance of major market indices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={marketData?.historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="SPX" stroke="#8884d8" name="S&P 500" />
                        <Line yAxisId="left" type="monotone" dataKey="DOW" stroke="#82ca9d" name="Dow Jones" />
                        <Line yAxisId="right" type="monotone" dataKey="NASDAQ" stroke="#ff7300" name="NASDAQ" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="stocks">
            <Card>
              <CardHeader>
                <CardTitle>Major Stocks</CardTitle>
                <CardDescription>Current prices and daily changes of major stocks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">% Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketData?.stocks.map((stock) => (
                      <TableRow key={stock.symbol}>
                        <TableCell className="font-medium">{stock.symbol}</TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell className="text-right">${stock.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={stock.change >= 0 ? "text-green-500 flex items-center justify-end" : "text-red-500 flex items-center justify-end"}>
                            {stock.change >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                            ${Math.abs(stock.change).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className={`text-right ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="indices">
            <Card>
              <CardHeader>
                <CardTitle>Market Indices</CardTitle>
                <CardDescription>Current values and daily changes of major market indices</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                      <TableHead className="text-right">Change</TableHead>
                      <TableHead className="text-right">% Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {marketData?.indices.map((index) => (
                      <TableRow key={index.symbol}>
                        <TableCell className="font-medium">{index.symbol}</TableCell>
                        <TableCell>{index.name}</TableCell>
                        <TableCell className="text-right">{index.price.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <span className={index.change >= 0 ? "text-green-500 flex items-center justify-end" : "text-red-500 flex items-center justify-end"}>
                            {index.change >= 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : <ArrowDown className="h-4 w-4 mr-1" />}
                            {Math.abs(index.change).toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell className={`text-right ${index.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                          {index.changePercent >= 0 ? "+" : ""}{index.changePercent.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MarketPrices;
