import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Order } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersList() {
  const { t } = useTranslation();
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20"></TableHead>
                  <TableHead className="w-36"></TableHead>
                  <TableHead className="w-24"></TableHead>
                  <TableHead className="w-32"></TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
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
          {t("dashboard.admin.tabs.orders")}
        </h3>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">{t("dashboard.admin.orderNumber")}</TableHead>
                <TableHead className="text-right">{t("dashboard.admin.customer")}</TableHead>
                <TableHead className="text-right">{t("dashboard.admin.orderTotal")}</TableHead>
                <TableHead className="text-right">{t("dashboard.admin.orderDate")}</TableHead>
                <TableHead className="text-right">{t("dashboard.admin.orderStatus")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>{order.userId}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                        {order.status === "completed" ? "مكتمل" : order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    لا توجد طلبات لعرضها
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
