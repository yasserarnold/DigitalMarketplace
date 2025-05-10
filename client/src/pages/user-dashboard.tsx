import { useEffect } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Order, OrderItem, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { Download } from "lucide-react";

export default function UserDashboard() {
  const { t } = useTranslation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !user) {
      setLocation("/login");
    }
  }, [user, isAuthLoading, setLocation]);

  // Fetch user orders
  const {
    data: orders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useQuery<Order[]>({
    queryKey: ["/api/user/orders"],
    enabled: !!user,
  });

  // Fetch products to get details for display
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: !!user,
  });

  // Fetch order details including items for each order
  const orderDetailsQueries = orders?.map((order) =>
    useQuery({
      queryKey: [`/api/orders/${order.id}`],
      enabled: !!user && !!orders,
    })
  );

  const isLoading = isAuthLoading || isOrdersLoading || isProductsLoading;
  const isError = isOrdersError || isProductsError;

  // Find product details by ID
  const getProductDetails = (productId: number) => {
    return products?.find((product) => product.id === productId);
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96 mt-2" />
          </div>
          <div>
            {[1, 2].map((i) => (
              <Card key={i} className="mb-6">
                <CardContent className="p-0">
                  <div className="divide-y divide-neutral-200">
                    {[1, 2].map((j) => (
                      <div key={j} className="px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Skeleton className="h-12 w-12 rounded-md" />
                            <div className="mr-4">
                              <Skeleton className="h-5 w-40" />
                              <Skeleton className="h-4 w-24 mt-1" />
                            </div>
                          </div>
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              حدث خطأ أثناء تحميل البيانات
            </h2>
            <p className="mt-2 text-neutral-600">
              يرجى المحاولة مرة أخرى لاحقاً
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasOrders = orders && orders.length > 0;

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-neutral-900">
            {t("dashboard.user.title")}
          </h2>
          <p className="mt-2 text-lg text-neutral-600">
            {t("dashboard.user.subtitle")}
          </p>
        </div>

        <div>
          {!hasOrders ? (
            <Card>
              <CardContent className="py-10 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-neutral-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-neutral-900">
                  {t("dashboard.user.noProducts")}
                </h3>
                <div className="mt-6">
                  <Button asChild>
                    <a href="/#products">تصفح المنتجات</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div>
              <h3 className="text-xl font-bold mb-4">
                {t("dashboard.user.purchases")}
              </h3>
              {orders.map((order, orderIndex) => {
                const orderDetails = orderDetailsQueries?.[orderIndex]?.data;
                const orderItems = orderDetails?.items as OrderItem[];

                return (
                  <Card key={order.id} className="mb-6">
                    <CardContent className="p-0">
                      <div className="bg-neutral-50 px-4 py-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-bold">رقم الطلب:</span> #{order.id}
                          </div>
                          <div>
                            <span className="font-bold">التاريخ:</span>{" "}
                            {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                          </div>
                          <div>
                            <span className="font-bold">الإجمالي:</span>{" "}
                            {formatCurrency(order.totalAmount)}
                          </div>
                        </div>
                      </div>
                      <div className="divide-y divide-neutral-200">
                        {orderItems?.map((item) => {
                          const product = getProductDetails(item.productId);
                          return (
                            <div
                              key={item.id}
                              className="px-4 py-5 sm:px-6"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-12 w-12 bg-neutral-100 rounded-md overflow-hidden">
                                    {product && (
                                      <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <div className="mr-4">
                                    <h4 className="text-lg font-bold text-neutral-900">
                                      {product?.title || "منتج غير معروف"}
                                    </h4>
                                    <p className="text-sm text-neutral-500">
                                      {t("dashboard.user.purchaseDate")}:{" "}
                                      {new Date(order.createdAt).toLocaleDateString("ar-SA")}
                                    </p>
                                  </div>
                                </div>
                                <Button className="bg-secondary hover:bg-green-700">
                                  <Download className="h-4 w-4 ml-2" />
                                  {t("dashboard.user.downloadAction")}
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
