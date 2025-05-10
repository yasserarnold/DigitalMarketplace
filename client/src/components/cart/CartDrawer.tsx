import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { X, AlertTriangle } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { t } = useTranslation();
  const { cartItems, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();

  return (
    <div
      className={`fixed inset-y-0 right-0 transform transition-transform duration-300 ease-in-out z-50 w-full sm:w-96 bg-white shadow-lg ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-5 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-neutral-900">
              {t("cart.cart")}{" "}
              {cartItems.length > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full ml-2">
                  {cartItems.length}
                </span>
              )}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-700"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-neutral-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="mt-4 text-neutral-500 text-center">
                {t("cart.emptyCart")}
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex py-5 border-b border-neutral-200"
              >
                <div className="h-24 w-24 flex-shrink-0 rounded-md border border-neutral-200 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="mr-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-neutral-900">
                      <h3>{item.title}</h3>
                      <p className="mr-4">{formatCurrency(item.price)}</p>
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">
                      {item.categoryName}
                    </p>
                  </div>
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <div className="flex">
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        className="font-medium text-destructive hover:text-red-500"
                      >
                        {t("cart.remove")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-neutral-200 px-4 py-6">
            <div className="flex justify-between text-base font-medium text-neutral-900">
              <p>{t("cart.total")}</p>
              <p>{formatCurrency(totalPrice)}</p>
            </div>
            <p className="mt-0.5 text-sm text-neutral-500">
              {t("cart.taxes")}
            </p>
            
            {!user ? (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-amber-800">
                      يجب تسجيل الدخول لإتمام عملية الشراء
                    </p>
                    <p className="mt-1 text-sm text-amber-700">
                      من فضلك قم بتسجيل الدخول أو إنشاء حساب جديد للاستمرار في عملية الشراء.
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    onClick={onClose}
                    className="flex-1"
                    variant="outline"
                    asChild
                  >
                    <Link href="/auth">{t("common.login")}</Link>
                  </Button>
                  <Button
                    onClick={onClose}
                    className="flex-1"
                    asChild
                  >
                    <Link href="/auth">{t("common.register")}</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <Button
                  onClick={onClose}
                  className="w-full flex items-center justify-center"
                  asChild
                >
                  <Link href="/checkout">{t("cart.checkout")}</Link>
                </Button>
              </div>
            )}
            
            <div className="mt-6 flex justify-center text-center text-sm text-neutral-500">
              <p>
                <button
                  type="button"
                  onClick={onClose}
                  className="font-medium text-primary hover:text-blue-600"
                >
                  {t("cart.continueShopping")}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
