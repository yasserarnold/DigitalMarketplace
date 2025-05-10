import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const formSchema = z.object({
  firstName: z.string().min(2, "الاسم الأول مطلوب"),
  lastName: z.string().min(2, "الاسم الأخير مطلوب"),
  email: z.string().email("البريد الإلكتروني غير صالح"),
});

export default function Checkout() {
  const { t } = useTranslation();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
    },
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      setLocation("/");
    }
  }, [cartItems, setLocation]);

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (formData: z.infer<typeof formSchema>) => {
      setIsSubmitting(true);
      // Create the order
      const res = await apiRequest("POST", "/api/orders", {
        items: cartItems,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء الطلب بنجاح",
        description: "يمكنك الآن تنزيل منتجاتك من لوحة التحكم",
        variant: "default",
      });
      clearCart();
      setLocation("/user-dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "حدث خطأ أثناء إنشاء الطلب",
        description: error.message,
        variant: "destructive",
      });
      setIsSubmitting(false);
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "يجب تسجيل الدخول أولاً",
        description: "يرجى تسجيل الدخول لإكمال عملية الشراء",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }

    await createOrderMutation.mutateAsync(values);
  };

  if (isAuthLoading) {
    return (
      <div className="py-12 text-center">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-neutral-900">
            {t("checkout.title")}
          </h2>
          <p className="mt-2 text-lg text-neutral-600">
            {t("checkout.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-y-8 gap-x-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-neutral-900 mb-4">
                  {t("checkout.billingInfo")}
                </h3>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-6 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem className="col-span-6 sm:col-span-3">
                            <FormLabel>{t("checkout.firstName")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem className="col-span-6 sm:col-span-3">
                            <FormLabel>{t("checkout.lastName")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="col-span-6">
                            <FormLabel>{t("checkout.email")}</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                value={field.value || user?.email || ""}
                                disabled={!!user?.email}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Payment method notice */}
                      <div className="col-span-6">
                        <div className="bg-neutral-50 p-4 rounded-md">
                          <p className="text-sm text-neutral-700">
                            {t("checkout.paymentNote")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="w-full sm:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? "جاري المعالجة..."
                          : t("checkout.confirmOrder")}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="px-4 py-5 sm:px-6 border-b border-neutral-200">
                  <h3 className="text-lg font-medium text-neutral-900">
                    {t("checkout.orderSummary")}
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            {item.title}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {item.categoryName}
                          </p>
                        </div>
                        <p className="text-sm font-medium text-neutral-900">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    ))}

                    <div className="border-t border-neutral-200 pt-4">
                      <div className="flex justify-between">
                        <p className="text-sm text-neutral-700">
                          {t("checkout.subtotal")}
                        </p>
                        <p className="text-sm font-medium text-neutral-900">
                          {formatCurrency(totalPrice)}
                        </p>
                      </div>
                      <div className="flex justify-between mt-2">
                        <p className="text-sm text-neutral-700">
                          {t("checkout.tax")}
                        </p>
                        <p className="text-sm font-medium text-neutral-900">
                          0.00 ج.م‏
                        </p>
                      </div>
                      <div className="flex justify-between mt-4 pt-4 border-t border-neutral-200">
                        <p className="text-base font-medium text-neutral-900">
                          {t("cart.total")}
                        </p>
                        <p className="text-base font-medium text-neutral-900">
                          {formatCurrency(totalPrice)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setLocation("/")}
                    >
                      {t("checkout.backToCart")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
