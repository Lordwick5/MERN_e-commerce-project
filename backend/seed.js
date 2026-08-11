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

    const sampleProducts = [
      {
        name: "Spectra Pro Mechanical Keyboard",
        image:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%230b111e'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300f2fe'/%3E%3Cstop offset='100%25' stop-color='%234facfe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='150' y='160' width='500' height='180' rx='15' fill='%23172237' stroke='url(%23g)' stroke-width='4'/%3E%3Cpath d='M 180 200 H 620 M 180 240 H 620 M 180 280 H 620 M 180 320 H 620' stroke='%23384f73' stroke-width='4' stroke-dasharray='25 10'/%3E%3Ctext x='400' y='110' fill='%23f3f4f6' font-family='sans-serif' font-size='32' font-weight='bold' text-anchor='middle'%3ESPECTRA PRO%3C/text%3E%3Ctext x='400' y='400' fill='%2300f2fe' font-family='sans-serif' font-size='18' letter-spacing='4' text-anchor='middle'%3EMECHANICAL KEYBOARD%3C/text%3E%3C/svg%3E",
        description:
          "Hot-swappable mechanical keyboard featuring high-fidelity linear switches, premium double-shot PBT keycaps, and custom dynamic RGB matrix.",
        category: "Keyboards",
        price: 189.99,
        countInStock: 15,
      },
      {
        name: "Aether Pro Wireless Headset",
        image:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%230b111e'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f857a6'/%3E%3Cstop offset='100%25' stop-color='%23ff5858'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M 250 250 A 150 150 0 0 1 550 250' fill='none' stroke='url(%23g)' stroke-width='12' stroke-linecap='round'/%3E%3Crect x='220' y='220' width='60' height='100' rx='15' fill='%23172237' stroke='url(%23g)' stroke-width='3'/%3E%3Crect x='520' y='220' width='60' height='100' rx='15' fill='%23172237' stroke='url(%23g)' stroke-width='3'/%3E%3Ctext x='400' y='110' fill='%23f3f4f6' font-family='sans-serif' font-size='32' font-weight='bold' text-anchor='middle'%3EAETHER PRO%3C/text%3E%3Ctext x='400' y='400' fill='%23f857a6' font-family='sans-serif' font-size='18' letter-spacing='4' text-anchor='middle'%3EWIRELESS STUDIO HEADSET%3C/text%3E%3C/svg%3E",
        description:
          "Hi-Res wireless audio headset featuring custom-tuned 50mm drivers, active noise cancellation, and a sleek modern design with memory foam earcups.",
        category: "Audio",
        price: 249.99,
        countInStock: 8,
      },
      {
        name: "Apex Precision Gaming Mouse",
        image:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%230b111e'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300f2fe'/%3E%3Cstop offset='100%25' stop-color='%234facfe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='320' y='150' width='160' height='260' rx='80' fill='%23172237' stroke='url(%23g)' stroke-width='4'/%3E%3Cpath d='M 400 150 V 230 M 320 230 H 480' stroke='url(%23g)' stroke-width='2'/%3E%3Crect x='385' y='170' width='30' height='40' rx='15' fill='%2300f2fe' opacity='0.8'/%3E%3Ctext x='400' y='100' fill='%23f3f4f6' font-family='sans-serif' font-size='32' font-weight='bold' text-anchor='middle'%3EAPEX PRECISION%3C/text%3E%3Ctext x='400' y='460' fill='%2300f2fe' font-family='sans-serif' font-size='18' letter-spacing='4' text-anchor='middle'%3EWIRELESS GAMING MOUSE%3C/text%3E%3C/svg%3E",
        description:
          "Ultralight 58g wireless mouse with a flawless 26k DPI sensor, optical mouse switches, and zero-latency wireless connectivity.",
        category: "Mice",
        price: 89.99,
        countInStock: 25,
      },
      {
        name: "Opal Horizon Curved OLED Display",
        image:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%230b111e'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fce38a'/%3E%3Cstop offset='100%25' stop-color='%23f38181'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='100' y='140' width='600' height='220' rx='10' fill='%23172237' stroke='url(%23g)' stroke-width='4'/%3E%3Cpath d='M 350 360 L 320 430 H 480 L 450 360 Z' fill='%23172237' stroke='url(%23g)' stroke-width='2'/%3E%3Ctext x='400' y='90' fill='%23f3f4f6' font-family='sans-serif' font-size='32' font-weight='bold' text-anchor='middle'%3EOPAL HORIZON%3C/text%3E%3Ctext x='400' y='480' fill='%23fce38a' font-family='sans-serif' font-size='18' letter-spacing='4' text-anchor='middle'%3ECURVED OLED DISPLAY%3C/text%3E%3C/svg%3E",
        description:
          "34-inch curved OLED monitor, 240Hz refresh rate, 0.03ms response time, with a sleek metal stand and addressable ambient RGB backglow.",
        category: "Displays",
        price: 599.99,
        countInStock: 5,
      },
      {
        name: "GlowGrid Addressable RGB Desk Mat",
        image:
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 500' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%230b111e'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f857a6'/%3E%3Cstop offset='100%25' stop-color='%23ff5858'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='120' y='160' width='560' height='220' rx='10' fill='%23172237' stroke='url(%23g)' stroke-width='4'/%3E%3Cpath d='M 120 200 H 680 M 120 240 H 680 M 120 280 H 680 M 120 320 H 680' stroke='rgba(248, 87, 166, 0.1)' stroke-width='2'/%3E%3Cpath d='M 200 160 V 380 M 300 160 V 380 M 400 160 V 380 M 500 160 V 380 M 600 160 V 380' stroke='rgba(248, 87, 166, 0.1)' stroke-width='2'/%3E%3Ctext x='400' y='110' fill='%23f3f4f6' font-family='sans-serif' font-size='32' font-weight='bold' text-anchor='middle'%3EGLOWGRID%3C/text%3E%3Ctext x='400' y='430' fill='%23ff5858' font-family='sans-serif' font-size='18' letter-spacing='4' text-anchor='middle'%3EADDRESSABLE RGB DESK MAT%3C/text%3E%3C/svg%3E",
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
