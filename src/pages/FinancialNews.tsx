
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock financial news data
const fetchFinancialNews = async () => {
  // In a real app, this would be an API call to fetch live news
  return {
    topStories: [
      {
        id: 1,
        title: "Federal Reserve Signals Potential Rate Cuts Later This Year",
        summary: "The Federal Reserve has indicated it may start cutting interest rates later this year if inflation continues to cool, according to meeting minutes released yesterday.",
        source: "Financial Times",
        category: "Economy",
        time: "2 hours ago",
        url: "#"
      },
      {
        id: 2,
        title: "Tech Stocks Rally as Earnings Beat Expectations",
        summary: "Major technology companies reported stronger-than-expected quarterly earnings, driving a rally in the sector and pushing the Nasdaq to new highs.",
        source: "Bloomberg",
        category: "Markets",
        time: "4 hours ago",
        url: "#"
      },
      {
        id: 3,
        title: "Oil Prices Surge Amid Middle East Tensions",
        summary: "Crude oil prices jumped 3% today as geopolitical tensions in the Middle East raised concerns about potential supply disruptions.",
        source: "Reuters",
        category: "Commodities",
        time: "5 hours ago",
        url: "#"
      },
      {
        id: 4,
        title: "Major Bank Announces Job Cuts Amid Shift to Digital Services",
        summary: "One of the nation's largest banks revealed plans to cut 5,000 jobs as it accelerates its transition to digital banking services.",
        source: "Wall Street Journal",
        category: "Banking",
        time: "7 hours ago",
        url: "#"
      },
      {
        id: 5,
        title: "Consumer Confidence Index Rises for Third Straight Month",
        summary: "The Consumer Confidence Index increased again this month, reaching its highest level since the pandemic began, suggesting stronger retail spending ahead.",
        source: "CNBC",
        category: "Economy",
        time: "9 hours ago",
        url: "#"
      },
    ],
    marketNews: [
      {
        id: 6,
        title: "Market Volatility Increases as Investors Await Economic Data",
        summary: "Trading volumes surged today as investors positioned themselves ahead of tomorrow's important economic data releases.",
        source: "MarketWatch",
        category: "Markets",
        time: "1 hour ago",
        url: "#"
      },
      {
        id: 7,
        title: "Small-Cap Stocks Outperform as Economic Recovery Broadens",
        summary: "Small-cap stocks have outperformed large-caps this month as investors bet on a broader economic recovery benefiting smaller companies.",
        source: "Investor's Business Daily",
        category: "Markets",
        time: "3 hours ago",
        url: "#"
      },
    ],
    economicNews: [
      {
        id: 8,
        title: "Unemployment Claims Fall to Post-Pandemic Low",
        summary: "Weekly jobless claims dropped to their lowest level since the pandemic began, indicating continued improvement in the labor market.",
        source: "Bloomberg",
        category: "Economy",
        time: "2 hours ago",
        url: "#"
      },
      {
        id: 9,
        title: "Housing Starts Decline as Material Costs Remain Elevated",
        summary: "New residential construction fell last month as builders continued to grapple with high material costs and labor shortages.",
        source: "Reuters",
        category: "Economy",
        time: "6 hours ago",
        url: "#"
      },
    ],
    companyNews: [
      {
        id: 10,
        title: "Tech Giant Announces $10 Billion Stock Buyback Program",
        summary: "The company's board approved a new $10 billion stock repurchase program, signaling confidence in its long-term prospects.",
        source: "CNBC",
        category: "Companies",
        time: "4 hours ago",
        url: "#"
      },
      {
        id: 11,
        title: "Pharmaceutical Firm Gets FDA Approval for New Drug",
        summary: "Shares jumped after the company announced FDA approval for its breakthrough treatment, which analysts expect to generate billions in revenue.",
        source: "Financial Times",
        category: "Companies",
        time: "5 hours ago",
        url: "#"
      },
    ]
  };
};

const FinancialNews = () => {
  const { data: newsData, isLoading } = useQuery({
    queryKey: ['financialNews'],
    queryFn: fetchFinancialNews,
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl font-semibold mb-6">Loading financial news...</h1>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl font-semibold mb-6">Financial News</h1>
        
        <Tabs defaultValue="top">
          <TabsList className="mb-4">
            <TabsTrigger value="top">Top Stories</TabsTrigger>
            <TabsTrigger value="markets">Markets</TabsTrigger>
            <TabsTrigger value="economy">Economy</TabsTrigger>
            <TabsTrigger value="companies">Companies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="top">
            <div className="grid grid-cols-1 gap-6">
              {newsData?.topStories.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="markets">
            <div className="grid grid-cols-1 gap-6">
              {newsData?.marketNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="economy">
            <div className="grid grid-cols-1 gap-6">
              {newsData?.economicNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="companies">
            <div className="grid grid-cols-1 gap-6">
              {newsData?.companyNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

interface NewsItemProps {
  news: {
    id: number;
    title: string;
    summary: string;
    source: string;
    category: string;
    time: string;
    url: string;
  };
}

const NewsCard = ({ news }: NewsItemProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{news.title}</CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="outline">{news.category}</Badge>
              <span className="text-sm text-muted-foreground">{news.source}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{news.time}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{news.summary}</p>
      </CardContent>
      <CardFooter>
        <a href={news.url} className="text-primary text-sm hover:underline">Read full story →</a>
      </CardFooter>
    </Card>
  );
};

export default FinancialNews;
