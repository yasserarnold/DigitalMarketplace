import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Arabic translations
const arTranslations = {
  common: {
    store: 'متجر الرقمي',
    home: 'الرئيسية',
    products: 'المنتجات',
    about: 'من نحن',
    contact: 'اتصل بنا',
    search: 'بحث',
    login: 'تسجيل الدخول',
    register: 'إنشاء حساب',
    logout: 'تسجيل الخروج',
    myAccount: 'حسابي',
    dashboard: 'لوحة التحكم',
    adminDashboard: 'لوحة الإدارة',
    orders: 'طلباتي',
    downloads: 'تنزيلاتي',
    settings: 'الإعدادات'
  },
  cart: {
    cart: 'عربة التسوق',
    checkout: 'إتمام الشراء',
    continueShopping: 'متابعة التسوق',
    emptyCart: 'عربة التسوق فارغة',
    total: 'المجموع',
    remove: 'حذف',
    subtotal: 'المجموع الفرعي',
    taxes: 'الضرائب تحسب عند الدفع',
    summary: 'ملخص الطلب',
    confirmOrder: 'تأكيد الطلب'
  },
  product: {
    new: 'جديد',
    bestSeller: 'الأكثر مبيعًا',
    sale: 'خصم',
    addToCart: 'أضف إلى السلة',
    category: 'الفئة',
    price: 'السعر',
    discountPrice: 'سعر الخصم',
    details: 'التفاصيل',
    description: 'الوصف',
    relatedProducts: 'منتجات ذات صلة',
    download: 'تنزيل'
  },
  checkout: {
    title: 'إتمام الطلب',
    subtitle: 'قم بإكمال عملية الشراء',
    billingInfo: 'معلومات الدفع',
    firstName: 'الاسم الأول',
    lastName: 'الاسم الأخير',
    email: 'البريد الإلكتروني',
    paymentNote: 'سيتم إضافة طرق الدفع لاحقًا.',
    orderSummary: 'ملخص الطلب',
    subtotal: 'المجموع الفرعي',
    tax: 'الضريبة',
    total: 'الإجمالي',
    backToCart: 'العودة إلى عربة التسوق'
  },
  auth: {
    welcome: 'مرحبًا بك في متجر الرقمي',
    loginTitle: 'تسجيل الدخول',
    registerTitle: 'إنشاء حساب جديد',
    username: 'اسم المستخدم',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    confirmPassword: 'تأكيد كلمة المرور',
    loginButton: 'تسجيل الدخول',
    registerButton: 'إنشاء حساب',
    noAccount: 'ليس لديك حساب؟',
    hasAccount: 'لديك حساب بالفعل؟',
    registerNow: 'سجل الآن',
    loginNow: 'تسجيل الدخول',
    rememberMe: 'تذكرني'
  },
  dashboard: {
    user: {
      title: 'لوحة تحكم المستخدم',
      subtitle: 'إدارة منتجاتك الرقمية وتنزيلها',
      purchases: 'مشترياتي',
      noProducts: 'لا توجد منتجات لعرضها',
      purchaseDate: 'تاريخ الشراء',
      downloadAction: 'تنزيل'
    },
    admin: {
      title: 'لوحة تحكم الإدارة',
      subtitle: 'إدارة المنتجات والطلبات',
      tabs: {
        products: 'المنتجات',
        orders: 'الطلبات',
        customers: 'العملاء'
      },
      addProduct: 'إضافة منتج',
      editProduct: 'تعديل المنتج',
      deleteProduct: 'حذف المنتج',
      confirmDelete: 'هل أنت متأكد من حذف هذا المنتج؟',
      productDetails: 'تفاصيل المنتج',
      productName: 'اسم المنتج',
      productCategory: 'فئة المنتج',
      productPrice: 'سعر المنتج',
      productStatus: 'حالة المنتج',
      active: 'نشط',
      inactive: 'غير نشط',
      actions: 'الإجراءات',
      orderNumber: 'رقم الطلب',
      orderTotal: 'إجمالي الطلب',
      orderDate: 'تاريخ الطلب',
      orderStatus: 'حالة الطلب',
      customer: 'العميل',
      customerEmail: 'البريد الإلكتروني',
      customerRegisteredDate: 'تاريخ التسجيل',
      purchaseCount: 'عدد المشتريات',
      productFormTitle: 'معلومات المنتج',
      productTitle: 'عنوان المنتج',
      productDescription: 'وصف المنتج',
      productImage: 'صورة المنتج',
      productFile: 'ملف المنتج',
      productDiscount: 'سعر الخصم (اختياري)',
      isFeatured: 'منتج مميز',
      isPopular: 'شائع',
      save: 'حفظ',
      cancel: 'إلغاء'
    }
  },
  home: {
    hero: {
      title: 'منتجات رقمية',
      titleColored: 'عالية الجودة',
      description: 'اكتشف مجموعتنا من الكتب الإلكترونية، البرامج، والدورات التعليمية. منتجات رقمية مصممة لمساعدتك على التعلم والنمو.',
      browseProducts: 'تصفح المنتجات',
      readMore: 'اقرأ المزيد'
    },
    featured: {
      title: 'منتجاتنا المميزة',
      subtitle: 'اكتشف أحدث المحتوى الرقمي',
      description: 'منتجات رقمية عالية الجودة مصممة لمساعدتك على تحقيق أهدافك وتطوير مهاراتك.'
    },
    categories: {
      title: 'الفئات',
      subtitle: 'استكشف حسب الفئات',
      ebooks: 'كتب إلكترونية',
      courses: 'دورات برمجية',
      templates: 'قوالب ومستندات',
      resources: 'موارد تصميمية'
    },
    testimonials: {
      title: 'شهادات العملاء',
      subtitle: 'ماذا يقول عملاؤنا'
    },
    cta: {
      title: 'استعد للارتقاء بمهاراتك',
      description: 'اشترك في نشرتنا البريدية واحصل على خصم 10% على أول عملية شراء.',
      placeholder: 'أدخل بريدك الإلكتروني',
      button: 'اشترك الآن',
      privacy: 'نحن نحترم خصوصيتك. لن نشارك بريدك الإلكتروني مع أي جهة أخرى.'
    }
  },
  footer: {
    about: 'منصة متخصصة لبيع وشراء المنتجات الرقمية عالية الجودة.',
    quickLinks: 'روابط سريعة',
    customerService: 'خدمات العملاء',
    contact: 'اتصل بنا',
    faq: 'الأسئلة الشائعة',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الاستخدام',
    returns: 'سياسة الإرجاع',
    copyright: 'جميع الحقوق محفوظة.'
  },
  notFound: {
    title: '404 الصفحة غير موجودة',
    message: 'الصفحة التي تبحث عنها غير موجودة.',
    backToHome: 'العودة إلى الرئيسية'
  }
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arTranslations // Need to nest inside "translation" namespace
      }
    },
    lng: 'ar', // Default language
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

// Set RTL direction for the document
document.documentElement.dir = 'rtl';
document.documentElement.lang = 'ar';

export default i18n;
