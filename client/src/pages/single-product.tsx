import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency, getProductBadge } from "@/lib/utils";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function SingleProduct() {
  const { t } = useTranslation();
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Parse product ID from URL
  const productId = parseInt(params.id);

  // Redirect to home if ID is invalid
  useEffect(() => {
    if (isNaN(productId)) {
      setLocation("/");
    }
  }, [productId, setLocation]);

  // Fetch product details
  const {
    data: product,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
    enabled: !isNaN(productId),
  });

  // Fetch categories to get category name
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const isLoading = isProductLoading || isCategoriesLoading;
  const isError = isProductError || isCategoriesError;

  // Get category name
  const getCategoryName = (categoryId?: number) => {
    // Handle both undefined and null for categoryId
    if (categoryId === undefined || categoryId === null || !categories) return "";
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : "";
  };

  const handleAddToCart = () => {
    if (!user) {
      // Show login requirement dialog
      setShowAuthDialog(true);
      return;
    }
    
    if (product) {
      addToCart({
        productId: product.id,
        title: product.title,
        price: product.discountPrice || product.price,
        imageUrl: product.imageUrl,
        categoryName: getCategoryName(product.categoryId || undefined),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            <div>
              <Skeleton className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden w-full h-96" />
            </div>
            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <Skeleton className="h-12 w-3/4" />
              <div className="mt-3">
                <Skeleton className="h-8 w-48" />
              </div>
              <div className="mt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </div>
              <div className="mt-10">
                <Skeleton className="h-12 w-48 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">
              حدث خطأ أثناء تحميل المنتج
            </h2>
            <p className="mt-2 text-neutral-600">
              المنتج غير موجود أو حدث خطأ في الاتصال
            </p>
            <Button
              className="mt-4"
              onClick={() => setLocation("/")}
            >
              العودة إلى الرئيسية
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const badge = getProductBadge(product);
  // Safely handle null value by treating it as undefined
  const categoryId = product.categoryId !== null ? product.categoryId : undefined;
  const categoryName = getCategoryName(categoryId);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
          {/* Login Dialog */}
          <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
            <AlertDialogContent className="text-right">
              <AlertDialogHeader>
                <AlertDialogTitle>يجب تسجيل الدخول</AlertDialogTitle>
                <AlertDialogDescription>
                  يجب عليك تسجيل الدخول أو إنشاء حساب لإضافة المنتجات إلى سلة التسوق والشراء.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-row justify-start gap-2">
                <AlertDialogCancel>إلغاء</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Link href="/auth">تسجيل الدخول / إنشاء حساب</Link>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* Product image */}
          <div className="flex flex-col items-center">
            <div className="w-full aspect-w-1 aspect-h-1 rounded-lg overflow-hidden relative">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-center object-cover"
              />
              {badge && (
                <div
                  className={`absolute top-4 left-4 ${badge.color} text-sm font-bold px-3 py-1 rounded`}
                >
                  {badge.text}
                </div>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
              {product.title}
            </h1>
            <div className="mt-3">
              <h2 className="sr-only">{t("product.price")}</h2>
              {product.discountPrice ? (
                <div className="flex items-baseline">
                  <p className="text-3xl text-primary font-bold">
                    {formatCurrency(product.discountPrice)}
                  </p>
                  <p className="mr-2 line-through text-neutral-500">
                    {formatCurrency(product.price)}
                  </p>
                </div>
              ) : (
                <p className="text-3xl text-primary font-bold">
                  {formatCurrency(product.price)}
                </p>
              )}
            </div>

            {categoryName && (
              <div className="mt-2">
                <span className="text-sm text-neutral-600">
                  {t("product.category")}: {categoryName}
                </span>
              </div>
            )}

            <div className="mt-6">
              <h3 className="sr-only">{t("product.description")}</h3>
              <div className="text-base text-neutral-700 space-y-4">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-10">
              <Button
                size="lg"
                onClick={handleAddToCart}
                className="w-full md:w-auto"
              >
                {t("product.addToCart")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
