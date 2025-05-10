import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductsList from "@/components/admin/ProductsList";
import OrdersList from "@/components/admin/OrdersList";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("products");

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isAuthLoading && (!user || !isAdmin)) {
      setLocation("/login");
    }
  }, [user, isAdmin, isAuthLoading, setLocation]);

  if (isAuthLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <Skeleton className="h-10 w-72" />
            <Skeleton className="h-6 w-96 mt-2" />
          </div>
          <div className="mb-6">
            <Skeleton className="h-10 w-96" />
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Only admins should see this page
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-neutral-900">
            {t("dashboard.admin.title")}
          </h2>
          <p className="mt-2 text-lg text-neutral-600">
            {t("dashboard.admin.subtitle")}
          </p>
        </div>

        <Tabs
          defaultValue="products"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-6 w-full justify-start border-b rounded-none">
            <TabsTrigger
              value="products"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              {t("dashboard.admin.tabs.products")}
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              {t("dashboard.admin.tabs.orders")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductsList />
          </TabsContent>
          <TabsContent value="orders">
            <OrdersList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
