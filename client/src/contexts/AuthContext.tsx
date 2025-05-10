import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  // Check if user is already logged in
  const { isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        
        if (!res.ok) {
          if (res.status !== 401) {
            throw new Error('Failed to fetch user');
          }
          return null;
        }
        
        const userData = await res.json();
        setUser(userData);
        return userData;
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    },
    staleTime: Infinity,
    retry: false
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await apiRequest('POST', '/api/auth/login', data);
      return res.json();
    },
    onSuccess: (userData) => {
      setUser(userData);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحبًا ${userData.username}`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الدخول",
        description: error.message || "يرجى التحقق من اسم المستخدم وكلمة المرور",
        variant: "destructive",
      });
    }
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest('POST', '/api/auth/register', data);
      return res.json();
    },
    onSuccess: (userData) => {
      setUser(userData);
      toast({
        title: "تم إنشاء الحساب بنجاح",
        description: `مرحبًا ${userData.username}`,
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل إنشاء الحساب",
        description: error.message || "يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/auth/logout', {});
      return res.json();
    },
    onSuccess: () => {
      setUser(null);
      toast({
        title: "تم تسجيل الخروج بنجاح",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
    onError: (error: Error) => {
      toast({
        title: "فشل تسجيل الخروج",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const login = async (data: LoginData) => {
    await loginMutation.mutateAsync(data);
  };

  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAdmin: user?.isAdmin || false,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
