
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PortfolioOverview } from "@/components/dashboard/PortfolioOverview";
import { AssetBreakdown } from "@/components/dashboard/AssetBreakdown";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { TimeframeSelector } from "@/components/dashboard/TimeframeSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import StockSelector from "@/components/portfolio/StockSelector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PortfolioStock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  shares: number;
  change: number;
}

const Portfolio = () => {
  const [timeframe, setTimeframe] = useState("1Y");
  const [portfolioStocks, setPortfolioStocks] = useState<PortfolioStock[]>([
    { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", price: 187.50, shares: 50, change: 1.4 },
    { ticker: "MSFT", name: "Microsoft Corporation", sector: "Technology", price: 395.24, shares: 25, change: 0.8 },
    { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Technology", price: 153.67, shares: 30, change: -0.5 },
  ]);
  
  const handleAddStock = (stock: any, shares: number) => {
    // Check if stock already exists in portfolio
    const existingStockIndex = portfolioStocks.findIndex(s => s.ticker === stock.ticker);
    
    if (existingStockIndex !== -1) {
      // Update existing stock shares
      const updatedStocks = [...portfolioStocks];
      updatedStocks[existingStockIndex].shares += shares;
      setPortfolioStocks(updatedStocks);
    } else {
      // Add new stock to portfolio
      setPortfolioStocks([
        ...portfolioStocks,
        {
          ticker: stock.ticker,
          name: stock.name,
          sector: stock.sector,
          price: stock.price,
          shares: shares,
          change: stock.change
        }
      ]);
    }
  };
  
  const handleRemoveStock = (ticker: string) => {
    setPortfolioStocks(portfolioStocks.filter(stock => stock.ticker !== ticker));
    toast({
      title: "Stock removed",
      description: `${ticker} has been removed from your portfolio`,
      variant: "default"
    });
  };
  
  const calculateTotalValue = () => {
    return portfolioStocks.reduce((total, stock) => total + stock.price * stock.shares, 0);
  };
  
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Portfolio Management</h1>
            <p className="text-sm text-slate-500 mt-1">Track and manage your investment portfolio</p>
          </div>
          <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="add-stocks">Add Stocks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PortfolioOverview timeframe={timeframe} />
              <PerformanceMetrics timeframe={timeframe} />
              <div className="md:col-span-2">
                <AssetBreakdown timeframe={timeframe} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Holdings</CardTitle>
                <CardDescription>Your current stock holdings and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ticker</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Sector</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Shares</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className="text-right">Weight</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioStocks.length > 0 ? (
                        <>
                          {portfolioStocks.map((stock) => {
                            const value = stock.price * stock.shares;
                            const weight = (value / calculateTotalValue()) * 100;
                            
                            return (
                              <TableRow key={stock.ticker}>
                                <TableCell className="font-medium">{stock.ticker}</TableCell>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell>{stock.sector}</TableCell>
                                <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                                <TableCell className="text-right">{stock.shares}</TableCell>
                                <TableCell className="text-right">${value.toLocaleString()}</TableCell>
                                <TableCell className={`text-right ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {stock.change >= 0 ? "+" : ""}{stock.change}%
                                </TableCell>
                                <TableCell className="text-right">{weight.toFixed(2)}%</TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="ghost" size="icon">
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleRemoveStock(stock.ticker)}
                                    >
                                      <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow>
                            <TableCell colSpan={5} className="font-bold text-right">Total</TableCell>
                            <TableCell className="font-bold text-right">${calculateTotalValue().toLocaleString()}</TableCell>
                            <TableCell colSpan={3}></TableCell>
                          </TableRow>
                        </>
                      ) : (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                            No stocks in your portfolio yet. Go to the "Add Stocks" tab to add some!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add-stocks">
            <StockSelector onAddStock={handleAddStock} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Portfolio;
