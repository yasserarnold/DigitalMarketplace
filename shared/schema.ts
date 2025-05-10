import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  isAdmin: true,
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  imageUrl: text("image_url").notNull(),
  fileUrl: text("file_url").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  featured: boolean("featured").default(false).notNull(),
  popular: boolean("popular").default(false).notNull(),
  discountPrice: doublePrecision("discount_price"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProductSchema = createInsertSchema(products).pick({
  title: true,
  description: true,
  price: true,
  imageUrl: true,
  fileUrl: true,
  categoryId: true,
  featured: true,
  popular: true,
  discountPrice: true,
  active: true,
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  totalAmount: doublePrecision("total_amount").notNull(),
  status: text("status").notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(orders).pick({
  userId: true,
  totalAmount: true,
  status: true,
});

// Order Items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  price: doublePrecision("price").notNull(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).pick({
  orderId: true,
  productId: true,
  price: true,
});

// Cart Items (temporary, not stored in DB)
export const cartItemSchema = z.object({
  productId: z.number(),
  title: z.string(),
  price: z.number(),
  imageUrl: z.string(),
  categoryName: z.string().optional(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof insertUserSchema._type;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof insertCategorySchema._type;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof insertProductSchema._type;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof insertOrderSchema._type;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof insertOrderItemSchema._type;

export type CartItem = z.infer<typeof cartItemSchema>;
