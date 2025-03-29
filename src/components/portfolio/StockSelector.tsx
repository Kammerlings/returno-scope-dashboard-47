
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock stock data
const availableStocks = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", price: 187.50, change: 1.4 },
  { ticker: "MSFT", name: "Microsoft Corporation", sector: "Technology", price: 395.24, change: 0.8 },
  { ticker: "GOOGL", name: "Alphabet Inc.", sector: "Technology", price: 153.67, change: -0.5 },
  { ticker: "AMZN", name: "Amazon.com Inc.", sector: "Consumer Cyclical", price: 191.26, change: 2.1 },
  { ticker: "META", name: "Meta Platforms Inc.", sector: "Technology", price: 468.20, change: 1.7 },
  { ticker: "TSLA", name: "Tesla Inc.", sector: "Automotive", price: 218.32, change: -2.3 },
  { ticker: "NVDA", name: "NVIDIA Corporation", sector: "Technology", price: 942.89, change: 3.5 },
  { ticker: "BRK.B", name: "Berkshire Hathaway Inc.", sector: "Financial Services", price: 402.71, change: 0.2 },
  { ticker: "JPM", name: "JPMorgan Chase & Co.", sector: "Financial Services", price: 196.42, change: -0.7 },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", price: 151.32, change: 0.5 },
  { ticker: "PG", name: "Procter & Gamble Co.", sector: "Consumer Defensive", price: 162.18, change: 0.9 },
  { ticker: "V", name: "Visa Inc.", sector: "Financial Services", price: 274.65, change: 1.2 },
  { ticker: "UNH", name: "UnitedHealth Group Inc.", sector: "Healthcare", price: 496.95, change: -1.1 },
  { ticker: "HD", name: "The Home Depot Inc.", sector: "Consumer Cyclical", price: 366.15, change: 1.5 },
  { ticker: "DIS", name: "The Walt Disney Company", sector: "Communication Services", price: 114.01, change: 0.6 },
  { ticker: "KO", name: "The Coca-Cola Company", sector: "Consumer Defensive", price: 59.81, change: 0.3 },
  { ticker: "PFE", name: "Pfizer Inc.", sector: "Healthcare", price: 26.15, change: -1.9 },
  { ticker: "BAC", name: "Bank of America Corp.", sector: "Financial Services", price: 38.14, change: -0.8 },
  { ticker: "VZ", name: "Verizon Communications Inc.", sector: "Communication Services", price: 39.54, change: 0.1 },
  { ticker: "NFLX", name: "Netflix Inc.", sector: "Communication Services", price: 678.69, change: 2.4 },
];

interface StockSelectorProps {
  onAddStock: (stock: any, shares: number) => void;
}

const StockSelector = ({ onAddStock }: StockSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [sharesInput, setSharesInput] = useState<{ [key: string]: number }>({});
  
  // Get unique sectors
  const sectors = [...new Set(availableStocks.map(stock => stock.sector))];
  
  // Filter stocks based on search term and selected sector
  const filteredStocks = availableStocks.filter(stock => {
    const matchesSearch = 
      stock.ticker.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = selectedSector ? stock.sector === selectedSector : true;
    
    return matchesSearch && matchesSector;
  });
  
  const handleAddStock = (stock: any) => {
    const shares = sharesInput[stock.ticker] || 0;
    if (shares <= 0) {
      toast({
        title: "Invalid shares quantity",
        description: "Please enter a positive number of shares.",
        variant: "destructive"
      });
      return;
    }
    
    onAddStock(stock, shares);
    
    // Reset shares input for this stock
    setSharesInput(prev => ({
      ...prev,
      [stock.ticker]: 0
    }));
    
    toast({
      title: "Stock added to portfolio",
      description: `Added ${shares} shares of ${stock.ticker} (${stock.name})`,
      variant: "default"
    });
  };
  
  const handleSharesChange = (ticker: string, value: string) => {
    const shares = parseInt(value) || 0;
    setSharesInput(prev => ({
      ...prev,
      [ticker]: shares
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Stocks to Portfolio</CardTitle>
        <CardDescription>Search and select stocks to add to your portfolio</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by ticker or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={selectedSector === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedSector(null)}
            >
              All Sectors
            </Badge>
            
            {sectors.map(sector => (
              <Badge
                key={sector}
                variant={selectedSector === sector ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedSector(sector === selectedSector ? null : sector)}
              >
                {sector}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="overflow-auto max-h-[400px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead>Ticker</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Change</TableHead>
                <TableHead>Shares</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStocks.length > 0 ? (
                filteredStocks.map(stock => (
                  <TableRow key={stock.ticker}>
                    <TableCell className="font-medium">{stock.ticker}</TableCell>
                    <TableCell>{stock.name}</TableCell>
                    <TableCell>${stock.price.toFixed(2)}</TableCell>
                    <TableCell className={stock.change >= 0 ? "text-green-600" : "text-red-600"}>
                      {stock.change >= 0 ? "+" : ""}{stock.change}%
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={sharesInput[stock.ticker] || ""}
                        onChange={(e) => handleSharesChange(stock.ticker, e.target.value)}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddStock(stock)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    No stocks match your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockSelector;
