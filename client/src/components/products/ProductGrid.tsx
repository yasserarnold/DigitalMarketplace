import { useQuery } from "@tanstack/react-query";
import ProductCard from "./ProductCard";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  queryKey: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

export default function ProductGrid({
  queryKey,
  title,
  subtitle,
  description,
}: ProductGridProps) {
  const { data: products, isLoading, isError } = useQuery<Product[]>({
    queryKey: [queryKey],
  });

  // Create an array of 6 skeletons for loading state
  const skeletons = Array.from({ length: 6 }, (_, index) => (
    <div key={index} className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-5">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
      </div>
    </div>
  ));

  if (isError) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-500">حدث خطأ أثناء تحميل المنتجات</p>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle || description) && (
          <div className="lg:text-center mb-10">
            {subtitle && (
              <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
                {subtitle}
              </h2>
            )}
            {title && (
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                {title}
              </p>
            )}
            {description && (
              <p className="mt-4 max-w-2xl text-xl text-neutral-600 lg:mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="product-grid">
          {isLoading
            ? skeletons
            : products?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
