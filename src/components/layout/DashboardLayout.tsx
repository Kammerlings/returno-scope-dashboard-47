
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Home, PieChart, TrendingUp, LineChart, NewspaperIcon, DollarSign, Calculator } from "lucide-react";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 flex items-center">
            <SidebarTrigger />
            <div className="ml-4">
              <span className="text-xl font-semibold text-slate-800">ReturnoScope</span>
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const AppSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Menu items
  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Market Prices",
      url: "/market-prices",
      icon: DollarSign,
    },
    {
      title: "Financial News",
      url: "/financial-news",
      icon: NewspaperIcon,
    },
    {
      title: "Portfolio",
      url: "/portfolio",
      icon: PieChart,
    },
    {
      title: "Performance",
      url: "/performance",
      icon: TrendingUp,
    },
    {
      title: "Analysis",
      url: "/analysis",
      icon: BarChart3,
    },
    {
      title: "Forecasting",
      url: "/forecasting",
      icon: LineChart,
    },
    {
      title: "Valuation",
      url: "/valuation",
      icon: Calculator,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={pathname === item.url}
                  >
                    <Link to={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
