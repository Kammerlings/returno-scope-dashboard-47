
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { BarChart3, Home, PieChart, TrendingUp, LineChart } from "lucide-react";
import { ReactNode } from "react";

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
  // Menu items
  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Portfolio",
      url: "#",
      icon: PieChart,
    },
    {
      title: "Performance",
      url: "#",
      icon: TrendingUp,
    },
    {
      title: "Analysis",
      url: "#",
      icon: BarChart3,
    },
    {
      title: "Forecasts",
      url: "#",
      icon: LineChart,
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
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center">
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                    </a>
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
