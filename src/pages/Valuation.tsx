
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MonteCarloValuation from "@/components/valuation/MonteCarloValuation";
import FiniteDifferenceValuation from "@/components/valuation/FiniteDifferenceValuation";
import BinomialTreeValuation from "@/components/valuation/BinomialTreeValuation";
import BlackScholesValuation from "@/components/valuation/BlackScholesValuation";

const Valuation = () => {
  const [activeTab, setActiveTab] = useState("monte-carlo");

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Instrument Valuation</h1>
          <p className="text-gray-600 max-w-4xl">
            Use industry-standard option pricing models to value financial derivatives. Adjust input parameters to see how they affect
            the theoretical value of options and other derivatives.
          </p>
        </div>

        <Tabs 
          defaultValue="monte-carlo" 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 bg-white">
            <TabsTrigger value="monte-carlo">Monte Carlo Simulation</TabsTrigger>
            <TabsTrigger value="finite-difference">Finite Difference Methods</TabsTrigger>
            <TabsTrigger value="binomial-tree">Binomial Trees</TabsTrigger>
            <TabsTrigger value="black-scholes">Black-Scholes Model</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monte-carlo">
            <Card>
              <CardHeader>
                <CardTitle>Monte Carlo Simulation</CardTitle>
                <CardDescription>
                  Price options by simulating thousands of possible price paths for the underlying asset.
                  Particularly useful for path-dependent exotic options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonteCarloValuation />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="finite-difference">
            <Card>
              <CardHeader>
                <CardTitle>Finite Difference Methods</CardTitle>
                <CardDescription>
                  Numerically solve the Black-Scholes PDE by discretizing time and price to create a grid of option values.
                  Effective for American and exotic options.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FiniteDifferenceValuation />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="binomial-tree">
            <Card>
              <CardHeader>
                <CardTitle>Binomial Tree Model</CardTitle>
                <CardDescription>
                  Model the underlying asset price as a discrete-time lattice (tree) with up and down movements.
                  Well-suited for American options and understanding option pricing fundamentals.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BinomialTreeValuation />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="black-scholes">
            <Card>
              <CardHeader>
                <CardTitle>Black-Scholes-Merton Model</CardTitle>
                <CardDescription>
                  Classic analytical solution for European options pricing using a closed-form formula.
                  The foundation of modern option pricing theory.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BlackScholesValuation />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Valuation;
