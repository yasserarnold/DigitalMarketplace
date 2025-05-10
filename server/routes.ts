import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertProductSchema, 
  insertOrderSchema, 
  insertOrderItemSchema,
  cartItemSchema
} from "@shared/schema";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

// Setup session store
const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session middleware
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "your-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production" },
      store: new SessionStore({ checkPeriod: 86400000 }) // prune expired entries every 24h
    })
  );

  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) { // In a real app, compare with hashed password
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const isAdmin = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && (req.user as any)?.isAdmin) {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  // Auth routes
  app.post("/api/auth/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          id: user.id,
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin
        });
      });
    })(req, res, next);
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      // Create new user
      const newUser = await storage.createUser(userData);
      
      // Auto login after registration
      req.logIn(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error during login after registration" });
        }
        return res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          isAdmin: newUser.isAdmin
        });
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid user data" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as any;
      return res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      });
    }
    res.status(401).json({ message: "Not authenticated" });
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products" });
    }
  });

  app.get("/api/products/featured", async (req, res) => {
    try {
      const featuredProducts = await storage.getFeaturedProducts();
      res.json(featuredProducts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching featured products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product" });
    }
  });

  app.post("/api/products", isAdmin, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid product data" });
    }
  });

  app.put("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const productData = insertProductSchema.partial().parse(req.body);
      
      const updatedProduct = await storage.updateProduct(id, productData);
      
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid product data" });
    }
  });

  app.delete("/api/products/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  });

  // Category routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  });

  app.get("/api/categories/:id/products", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const products = await storage.getProductsByCategory(id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products by category" });
    }
  });

  // Order routes
  app.get("/api/orders", isAdmin, async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching orders" });
    }
  });

  app.get("/api/user/orders", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const orders = await storage.getOrdersByUser(userId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user orders" });
    }
  });

  app.get("/api/orders/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Check if user is admin or the order belongs to the user
      const user = req.user as any;
      if (!user.isAdmin && order.userId !== user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const orderItems = await storage.getOrderItems(id);
      
      res.json({
        ...order,
        items: orderItems
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching order" });
    }
  });

  app.post("/api/orders", isAuthenticated, async (req, res) => {
    try {
      const cartItems = req.body.items;
      if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }
      
      // Validate cart items
      const validatedItems = [];
      for (const item of cartItems) {
        try {
          const validItem = cartItemSchema.parse(item);
          validatedItems.push(validItem);
        } catch (error) {
          return res.status(400).json({ message: "Invalid cart item" });
        }
      }
      
      // Calculate total amount
      const totalAmount = validatedItems.reduce((sum, item) => sum + item.price, 0);
      
      // Create order
      const orderData = {
        userId: (req.user as any).id,
        totalAmount,
        status: "completed"
      };
      
      const order = await storage.createOrder(orderData);
      
      // Create order items
      for (const item of validatedItems) {
        const orderItemData = {
          orderId: order.id,
          productId: item.productId,
          price: item.price
        };
        
        await storage.createOrderItem(orderItemData);
      }
      
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : "Invalid order data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
