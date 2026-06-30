import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const seedData = async () => {
  try {
    // Clear all existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Database cleared.");

    // Create Admin and Regular User
    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      isAdmin: true,
    });

    const regularUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      isAdmin: false,
    });

    console.log("Sample Users seeded:");
    console.log("- Admin: admin@example.com (password123)");
    console.log("- User: john@example.com (password123)");

    // Sample Premium Products
    const sampleProducts = [
      {
        name: "Spectra Pro Mechanical Keyboard",
        image:
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
        description:
          "Hot-swappable mechanical keyboard featuring high-fidelity linear switches, premium double-shot PBT keycaps, and custom dynamic RGB matrix.",
        category: "Keyboards",
        price: 189.99,
        countInStock: 15,
      },
      {
        name: "Aether Pro Wireless Headset",
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
        description:
          "Hi-Res wireless audio headset featuring custom-tuned 50mm drivers, active noise cancellation, and a sleek modern design with memory foam earcups.",
        category: "Audio",
        price: 249.99,
        countInStock: 8,
      },
      {
        name: "Apex Precision Gaming Mouse",
        image:
          "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop",
        description:
          "Ultralight 58g wireless mouse with a flawless 26k DPI sensor, optical mouse switches, and zero-latency wireless connectivity.",
        category: "Mice",
        price: 89.99,
        countInStock: 25,
      },
      {
        name: "Opal Horizon Curved OLED Display",
        image:
          "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop",
        description:
          "34-inch curved OLED monitor, 240Hz refresh rate, 0.03ms response time, with a sleek metal stand and addressable ambient RGB backglow.",
        category: "Displays",
        price: 599.99,
        countInStock: 5,
      },
      {
        name: "GlowGrid Addressable RGB Desk Mat",
        image:
          "https://images.unsplash.com/photo-1632292224971-0d45778bd364?q=80&w=600&auto=format&fit=crop",
        description:
          "Soft premium micro-woven water-resistant fabric with 12-zone addressable RGB edges for standard high-end desktop aesthetics.",
        category: "Accessories",
        price: 39.99,
        countInStock: 40,
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log("Sample Products seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error(`Error with data seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();
