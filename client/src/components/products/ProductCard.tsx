import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency, getProductBadge, truncateText } from "@/lib/utils";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  categoryName?: string;
}

export default function ProductCard({ product, categoryName }: ProductCardProps) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const badge = getProductBadge(product);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      title: product.title,
      price: product.discountPrice || product.price,
      imageUrl: product.imageUrl,
      categoryName: categoryName,
    });
  };

  return (
    <div className="bg-white overflow-hidden shadow-sm rounded-lg border border-neutral-200 hover:shadow-md transition-shadow duration-300">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {badge && (
            <div className={`absolute top-2 left-2 ${badge.color} text-xs font-bold px-2 py-1 rounded`}>
              {badge.text}
            </div>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-neutral-900 mb-2">{product.title}</h3>
        </Link>
        <p className="text-neutral-600 text-sm mb-4">
          {truncateText(product.description, 80)}
        </p>
        <div className="flex justify-between items-center">
          <div>
            {product.discountPrice ? (
              <>
                <span className="text-neutral-500 line-through text-sm mr-2">
                  {formatCurrency(product.price)}
                </span>
                <span className="text-primary font-bold">
                  {formatCurrency(product.discountPrice)}
                </span>
              </>
            ) : (
              <span className="text-primary font-bold">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            className="text-sm"
            size="sm"
          >
            {t("product.addToCart")}
          </Button>
        </div>
      </div>
    </div>
  );
}
