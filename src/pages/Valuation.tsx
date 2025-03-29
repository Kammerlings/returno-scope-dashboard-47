
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BinomialTreeValuation from "@/components/valuation/BinomialTreeValuation";
import BlackScholesValuation from "@/components/valuation/BlackScholesValuation";
import FiniteDifferenceValuation from "@/components/valuation/FiniteDifferenceValuation";
import MonteCarloValuation from "@/components/valuation/MonteCarloValuation";
import HestonModelValuation from "@/components/valuation/HestonModelValuation";
import JumpDiffusionValuation from "@/components/valuation/JumpDiffusionValuation";

const Valuation = () => {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Option Valuation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Price derivatives using various pricing models
          </p>
        </div>
        
        <Tabs defaultValue="black-scholes">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="black-scholes">Black-Scholes</TabsTrigger>
            <TabsTrigger value="monte-carlo">Monte Carlo</TabsTrigger>
            <TabsTrigger value="binomial">Binomial Tree</TabsTrigger>
            <TabsTrigger value="finite-diff">Finite Difference</TabsTrigger>
            <TabsTrigger value="heston">Heston Model</TabsTrigger>
            <TabsTrigger value="jump-diffusion">Jump Diffusion</TabsTrigger>
          </TabsList>
          
          <div className="overflow-auto">
            <TabsContent value="black-scholes" className="overflow-auto">
              <BlackScholesValuation />
            </TabsContent>
            
            <TabsContent value="monte-carlo" className="overflow-auto">
              <MonteCarloValuation />
            </TabsContent>
            
            <TabsContent value="binomial" className="overflow-auto">
              <BinomialTreeValuation />
            </TabsContent>
            
            <TabsContent value="finite-diff" className="overflow-auto">
              <FiniteDifferenceValuation />
            </TabsContent>
            
            <TabsContent value="heston" className="overflow-auto">
              <HestonModelValuation />
            </TabsContent>
            
            <TabsContent value="jump-diffusion" className="overflow-auto">
              <JumpDiffusionValuation />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Valuation;
