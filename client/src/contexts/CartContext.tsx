import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CartItem } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  const totalItems = cartItems.length;
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data from localStorage', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(cartItem => cartItem.productId === item.productId);
    
    if (existingItem) {
      toast({
        title: "المنتج موجود بالفعل في العربة",
        description: "هذا المنتج موجود بالفعل في عربة التسوق الخاصة بك.",
        variant: "default",
      });
      return;
    }
    
    setCartItems(prevItems => [...prevItems, item]);
    setIsCartOpen(true);
    
    toast({
      title: "تمت الإضافة إلى العربة",
      description: "تمت إضافة المنتج إلى عربة التسوق بنجاح.",
      variant: "default",
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
    
    toast({
      title: "تمت إزالة المنتج",
      description: "تمت إزالة المنتج من عربة التسوق.",
      variant: "default",
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
