import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import UserDropdown from "@/components/ui/user-dropdown";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation links
  const navLinks = [
    { href: "/", label: t("common.home"), isActive: location === "/" },
    { href: "/#products", label: t("common.products"), isActive: false },
    { href: "/#about", label: t("common.about"), isActive: false },
    { href: "/#contact", label: t("common.contact"), isActive: false },
  ];

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-primary font-bold text-xl">
                  {t("common.store")}
                </Link>
              </div>
              <div className="hidden sm:mr-6 sm:flex sm:space-x-8 sm:space-x-reverse">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${
                      link.isActive
                        ? "border-primary text-neutral-900"
                        : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-700"
                    } border-b-2 px-1 pt-1 font-medium text-sm inline-flex items-center h-full`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  className="flex items-center focus:outline-none"
                  onClick={() => setIsCartOpen(true)}
                  aria-label={t("cart.cart")}
                >
                  <span className="sr-only">{t("cart.cart")}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-neutral-500 hover:text-neutral-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                      {totalItems}
                    </span>
                  )}
                </button>
              </div>

              {user ? (
                <UserDropdown />
              ) : (
                <div className="hidden sm:flex">
                  <Button
                    variant="outline"
                    className="px-4 py-2 text-sm font-medium text-primary"
                    asChild
                  >
                    <Link href="/login">{t("common.login")}</Link>
                  </Button>
                </div>
              )}

              <button
                className="sm:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-neutral-500" />
                ) : (
                  <Menu className="h-6 w-6 text-neutral-500" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${
                    link.isActive
                      ? "bg-neutral-50 border-primary text-primary"
                      : "border-transparent text-neutral-500 hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-700"
                  } block pl-3 pr-4 py-2 border-r-4 font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            {!user && (
              <div className="pt-4 pb-3 border-t border-neutral-200">
                <div className="flex items-center px-4">
                  <Button
                    className="w-full py-2 text-sm font-medium"
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href="/login">{t("common.login")}</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
