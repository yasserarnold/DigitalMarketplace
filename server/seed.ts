import { db } from './db';
import { users, categories, products } from '@shared/schema';
import { storage } from './storage';
import { eq } from 'drizzle-orm';

/**
 * Seeds the database with initial data
 */
export async function seedDatabase() {
  console.log('Seeding database...');
  
  try {
    // Check if there are any users
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length > 0) {
      console.log('Database already seeded, skipping...');
      return;
    }

    // Create admin user
    const adminUser = await storage.createUser({
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      email: "admin@example.com",
      isAdmin: true,
    });
    console.log(`Created admin user: ${adminUser.username}`);
    
    // Create regular user
    const regularUser = await storage.createUser({
      username: "user",
      password: "user123", // In a real app, this would be hashed
      email: "user@example.com",
      isAdmin: false,
    });
    console.log(`Created regular user: ${regularUser.username}`);

    // Create categories
    const categoryData = [
      { name: "كتب إلكترونية", slug: "ebooks" },
      { name: "دورات برمجية", slug: "programming-courses" },
      { name: "قوالب ومستندات", slug: "templates" },
      { name: "موارد تصميمية", slug: "design-resources" }
    ];
    
    const categoryMap = new Map<string, number>();
    
    for (const category of categoryData) {
      const newCategory = await storage.createCategory(category);
      categoryMap.set(category.slug, newCategory.id);
      console.log(`Created category: ${category.name}`);
    }

    // Create products
    const productsData = [
      {
        title: "تعلم تطوير الويب",
        description: "دليل شامل لتعلم تطوير مواقع الويب من الصفر إلى الاحتراف.",
        price: 29.99,
        imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        fileUrl: "/downloads/web-development-guide.pdf",
        categoryId: categoryMap.get("ebooks")!,
        featured: true,
        popular: false,
        active: true
      },
      {
        title: "دليل الذكاء الاصطناعي",
        description: "كورس شامل في مجال الذكاء الاصطناعي وتطبيقاته العملية.",
        price: 49.99,
        imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        fileUrl: "/downloads/ai-guide.zip",
        categoryId: categoryMap.get("programming-courses")!,
        featured: true,
        popular: true,
        active: true
      },
      {
        title: "قوالب عرض تقديمي",
        description: "مجموعة من قوالب العروض التقديمية الاحترافية لمختلف المجالات.",
        price: 19.99,
        imageUrl: "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        fileUrl: "/downloads/presentation-templates.zip",
        categoryId: categoryMap.get("templates")!,
        featured: true,
        popular: false,
        active: true
      },
      {
        title: "أساسيات التسويق الرقمي",
        description: "دليل شامل للتسويق الرقمي ووسائل التواصل الاجتماعي.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        fileUrl: "/downloads/digital-marketing.pdf",
        categoryId: categoryMap.get("ebooks")!,
        featured: false,
        popular: false,
        active: true
      },
      {
        title: "برنامج اللياقة البدنية",
        description: "برنامج تدريبي متكامل للياقة البدنية يناسب جميع المستويات.",
        price: 34.99,
        imageUrl: "https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        fileUrl: "/downloads/fitness-program.pdf",
        categoryId: categoryMap.get("ebooks")!,
        featured: false,
        popular: false,
        active: true
      },
      {
        title: "كتاب وصفات الطبخ",
        description: "مجموعة من ألذ وصفات الطبخ العالمية مع شرح تفصيلي للتحضير.",
        price: 24.99,
        imageUrl: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
        fileUrl: "/downloads/recipes-book.pdf",
        categoryId: categoryMap.get("ebooks")!,
        featured: false,
        popular: false,
        discountPrice: 19.99,
        active: true
      }
    ];
    
    for (const productData of productsData) {
      const product = await storage.createProduct(productData);
      console.log(`Created product: ${product.title}`);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}