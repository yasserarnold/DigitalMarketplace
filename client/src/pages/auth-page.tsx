import { useState } from 'react';
import { useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, User } from 'lucide-react';

// Login schema
const loginSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
});

// Registration schema
const registerSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم مطلوب'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('login');
  const [, setLocation] = useLocation();
  const { user, login, register } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    setLocation('/');
    return null;
  }

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Submit login form
  const onLoginSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      toast({
        title: 'تم تسجيل الدخول بنجاح',
        description: 'مرحبًا بعودتك!',
      });
      setLocation('/');
    } catch (error: any) {
      toast({
        title: 'فشل تسجيل الدخول',
        description: error.message || 'حدث خطأ أثناء تسجيل الدخول',
        variant: 'destructive',
      });
    }
  };

  // Submit register form
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    try {
      // Remove confirmPassword before sending
      const { confirmPassword, ...registerData } = data;
      await register(registerData);
      toast({
        title: 'تم التسجيل بنجاح',
        description: 'مرحبًا بك في متجرنا!',
      });
      setLocation('/');
    } catch (error: any) {
      toast({
        title: 'فشل التسجيل',
        description: error.message || 'حدث خطأ أثناء التسجيل',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50">
      <div className="max-w-7xl w-full space-y-8 flex flex-col-reverse md:flex-row gap-8">
        {/* Auth Forms */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">{t('auth.loginTitle')}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.registerTitle')}</TabsTrigger>
            </TabsList>
            
            {/* Login Form */}
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>{t('auth.loginTitle')}</CardTitle>
                  <CardDescription>
                    {t('auth.hasAccount')} {t('auth.loginNow')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.username')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  className="pl-3 pr-10" 
                                  placeholder={t('auth.username')} 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.password')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  className="pl-3 pr-10" 
                                  type="password" 
                                  placeholder={t('auth.password')} 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={loginForm.formState.isSubmitting}>
                        {loginForm.formState.isSubmitting ? 'جاري تسجيل الدخول...' : t('auth.loginButton')}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-muted-foreground">
                    {t('auth.noAccount')}{' '}
                    <Button 
                      variant="link" 
                      className="px-0" 
                      onClick={() => setActiveTab('register')}
                    >
                      {t('auth.registerNow')}
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Register Form */}
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>{t('auth.registerTitle')}</CardTitle>
                  <CardDescription>
                    {t('auth.noAccount')} {t('auth.registerNow')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.username')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  className="pl-3 pr-10" 
                                  placeholder={t('auth.username')} 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.email')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  className="pl-3 pr-10" 
                                  type="email" 
                                  placeholder={t('auth.email')} 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.password')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  className="pl-3 pr-10" 
                                  type="password" 
                                  placeholder={t('auth.password')} 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                <Input 
                                  className="pl-3 pr-10" 
                                  type="password" 
                                  placeholder={t('auth.confirmPassword')} 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={registerForm.formState.isSubmitting}>
                        {registerForm.formState.isSubmitting ? 'جاري التسجيل...' : t('auth.registerButton')}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-muted-foreground">
                    {t('auth.hasAccount')}{' '}
                    <Button 
                      variant="link" 
                      className="px-0" 
                      onClick={() => setActiveTab('login')}
                    >
                      {t('auth.loginNow')}
                    </Button>
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark p-8 rounded-lg text-white">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold mb-6">{t('auth.welcome')}</h1>
            <p className="mb-6 text-primary-foreground">
              اكتشف مجموعتنا من المنتجات الرقمية عالية الجودة. قم بإنشاء حساب للاستمتاع بتجربة تسوق سهلة وآمنة.
            </p>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold text-lg">منتجات متنوعة</h3>
                <p className="text-sm mt-2">كتب إلكترونية، دورات، قوالب، وأكثر</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold text-lg">تنزيل فوري</h3>
                <p className="text-sm mt-2">استلم منتجك فورًا بعد الشراء</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold text-lg">دعم مستمر</h3>
                <p className="text-sm mt-2">نحن هنا لمساعدتك على مدار الساعة</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-bold text-lg">تحديثات منتظمة</h3>
                <p className="text-sm mt-2">منتجات جديدة تضاف باستمرار</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}