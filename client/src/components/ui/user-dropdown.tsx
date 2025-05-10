import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";

export default function UserDropdown() {
  const { t } = useTranslation();
  const { user, isAdmin, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <span className="sr-only">{t("common.myAccount")}</span>
        <div className="h-8 w-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
          {user?.username.charAt(0).toUpperCase()}
        </div>
      </button>

      {isDropdownOpen && (
        <div
          className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
          style={{ top: "40px", left: "0px", zIndex: 100 }}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            <div className="px-4 py-2 text-sm text-neutral-500 border-b border-neutral-100">
              {user?.username}
            </div>
            <Link
              href="/user-dashboard"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              role="menuitem"
              onClick={() => setIsDropdownOpen(false)}
            >
              {t("common.dashboard")}
            </Link>
            <Link
              href="/user-dashboard"
              className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              role="menuitem"
              onClick={() => setIsDropdownOpen(false)}
            >
              {t("common.orders")}
            </Link>
            {isAdmin && (
              <Link
                href="/admin-dashboard"
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                role="menuitem"
                onClick={() => setIsDropdownOpen(false)}
              >
                {t("common.adminDashboard")}
              </Link>
            )}
            <div className="border-t border-neutral-100">
              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-right px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                role="menuitem"
              >
                {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
