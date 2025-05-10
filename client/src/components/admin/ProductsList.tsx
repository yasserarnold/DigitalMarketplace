import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import ProductForm from "./ProductForm";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit, Trash, Plus } from "lucide-react";

export default function ProductsList() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: () => apiRequest("GET", "/api/categories"),
    select: (data) => {
      // طباعة البيانات لتشخيص المشكلة
      console.log("Fetched categories:", data);

      // التحقق من أن البيانات هي مصفوفة
      if (Array.isArray(data)) {
        return data;
      } else {
        // إعادة مصفوفة فارغة إذا كانت البيانات غير صالحة
        return [];
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`, undefined);
    },
    onSuccess: () => {
      toast({
        title: "تم حذف المنتج بنجاح",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "حدث خطأ أثناء حذف المنتج",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const getCategoryName = (categoryId?: number) => {
    if (!categoryId || !Array.isArray(categories)) return ""; // Ensure categories is an array
    const category = categories.find((c: any) => c.id === categoryId);
    return category ? category.name : "";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead className="w-48"></TableHead>
                  <TableHead className="w-24"></TableHead>
                  <TableHead className="w-16"></TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-10 w-10 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-full max-w-[180px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-12" />
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-neutral-900">
          {t("dashboard.admin.tabs.products")}
        </h3>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          {t("dashboard.admin.addProduct")}
        </Button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead className="text-right">
                  {t("dashboard.admin.productName")}
                </TableHead>
                <TableHead className="text-right">
                  {t("dashboard.admin.productCategory")}
                </TableHead>
                <TableHead className="text-right">
                  {t("dashboard.admin.productPrice")}
                </TableHead>
                <TableHead className="text-right">
                  {t("dashboard.admin.productStatus")}
                </TableHead>
                <TableHead className="text-right">
                  {t("dashboard.admin.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products && products.length > 0 ? (
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex-shrink-0 h-10 w-10 bg-neutral-100 rounded-md overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.title}
                    </TableCell>
                    <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                    <TableCell>
                      {product.discountPrice ? (
                        <div>
                          <span className="text-neutral-500 line-through text-xs block">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-primary">
                            {formatCurrency(product.discountPrice)}
                          </span>
                        </div>
                      ) : (
                        formatCurrency(product.price)
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          product.active
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-neutral-100 text-neutral-800 hover:bg-neutral-100"
                        }
                      >
                        {product.active
                          ? t("dashboard.admin.active")
                          : t("dashboard.admin.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 space-x-reverse">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setEditProductId(product.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    لا توجد منتجات لعرضها
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("dashboard.admin.addProduct")}</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSuccess={() => setIsAddDialogOpen(false)}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog
        open={editProductId !== null}
        onOpenChange={(open) => {
          if (!open) setEditProductId(null);
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("dashboard.admin.editProduct")}</DialogTitle>
          </DialogHeader>
          {editProductId !== null && (
            <ProductForm
              productId={editProductId}
              onSuccess={() => setEditProductId(null)}
              onCancel={() => setEditProductId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("dashboard.admin.deleteProduct")}</DialogTitle>
          </DialogHeader>
          <p>
            {t("dashboard.admin.confirmDelete")}
            <br />
            <span className="font-bold">{productToDelete?.title}</span>
          </p>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("dashboard.admin.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending
                ? "جاري الحذف..."
                : t("dashboard.admin.deleteProduct")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
