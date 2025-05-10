import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { insertProductSchema } from "@shared/schema";
import { Category, Product } from "@shared/schema";

interface ProductFormProps {
  productId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const formSchema = insertProductSchema.extend({
  price: z.coerce.number().positive("السعر يجب أن يكون أكبر من صفر"),
  discountPrice: z.coerce
    .number()
    .positive("سعر الخصم يجب أن يكون أكبر من صفر")
    .optional(),
  categoryId: z.coerce.number().optional(),
});

export default function ProductForm({
  productId,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: product, isLoading: isLoadingProduct } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      imageUrl: "",
      fileUrl: "",
      categoryId: undefined,
      featured: false,
      popular: false,
      discountPrice: undefined,
      active: true,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        title: product.title,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        fileUrl: product.fileUrl,
        categoryId: product.categoryId,
        featured: product.featured,
        popular: product.popular,
        discountPrice: product.discountPrice || undefined,
        active: product.active,
      });
    }
  }, [product, form.reset]);

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (productId) {
        const res = await apiRequest(
          "PUT",
          `/api/products/${productId}`,
          values,
        );
        return res.json();
      } else {
        const res = await apiRequest("POST", "/api/products", values);
        return res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: productId ? "تم تحديث المنتج بنجاح" : "تم إنشاء المنتج بنجاح",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "حدث خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    await mutation.mutateAsync(values);
    setIsSubmitting(false);
  };

  if (isLoadingProduct && productId) {
    return <div className="text-center py-10">جاري التحميل...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.admin.productTitle")}</FormLabel>
                <FormControl>
                  <Input placeholder="عنوان المنتج" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.admin.productCategory")}</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر فئة" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("dashboard.admin.productDescription")}</FormLabel>
              <FormControl>
                <Textarea placeholder="وصف المنتج" {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.admin.productPrice")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discountPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.admin.productDiscount")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseFloat(value),
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.admin.productImage")}</FormLabel>
                <FormControl>
                  <Input placeholder="رابط الصورة" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  رابط صورة المنتج (URL)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fileUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("dashboard.admin.productFile")}</FormLabel>
                <FormControl>
                  <Input placeholder="رابط الملف" {...field} />
                </FormControl>
                <FormDescription className="text-xs">
                  رابط ملف المنتج للتحميل (URL)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4 space-x-reverse">
            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("dashboard.admin.isFeatured")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="popular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("dashboard.admin.isPopular")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-x-reverse space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("dashboard.admin.productStatus")}</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 space-x-reverse">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("dashboard.admin.cancel")}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "جاري الحفظ..."
              : productId
                ? t("dashboard.admin.save")
                : t("dashboard.admin.addProduct")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
