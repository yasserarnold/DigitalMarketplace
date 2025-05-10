import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import RootLayout from "@/components/layout/RootLayout";
import Home from "@/pages/home";
import UserDashboard from "@/pages/user-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import Checkout from "@/pages/checkout";
import SingleProduct from "@/pages/single-product";
import AuthPage from "@/pages/auth-page";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "@/pages/auth/login";
import register from "@/pages/auth/register";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/product/:id" component={SingleProduct} />
      <Route path="/user-dashboard" component={UserDashboard} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={register} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <RootLayout>
              <Router />
            </RootLayout>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
