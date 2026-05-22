// seed.js – run with: node seed.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

import User from "./models/userModel.js";
import LaundryShop from "./models/laundryShopModel.js";
import Service from "./models/serviceModel.js";
import ProviderService from "./models/providerServiceModel.js";
import Region from "./models/regionModel.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/natheef";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Clear
  await Promise.all([
    User.deleteMany(), LaundryShop.deleteMany(),
    Service.deleteMany(), ProviderService.deleteMany(), Region.deleteMany(),
  ]);

  // Regions
  const [riyadh, jeddah] = await Region.insertMany([
    { name: "Riyadh" }, { name: "Jeddah" },
  ]);

  // Services (categories + children)
  const [washCategory, dryClean, carpetCat, shoes] = await Service.insertMany([
    { name: "غسيل ملابس" },  // Clothes Washing
    { name: "تنظيف جاف" },  // Dry Cleaning
    { name: "غسيل سجاد" },  // Carpet Washing
    { name: "حقائب وأحذية" }, // Bags & Shoes
  ]);

  await Service.insertMany([
    { name: "غسيل عادي",  parent: washCategory._id },
    { name: "غسيل بالبخار", parent: washCategory._id },
    { name: "كوي",         parent: washCategory._id },
  ]);

  // Users
  const hashed = await bcrypt.hash("password123", 10);

  const admin = await User.create({
    name: "Admin", email: "admin@natheef.com",
    password: hashed, role: "admin",
  });

  const providers = await User.insertMany([
    { name: "أحمد محمد", email: "shop1@natheef.com", password: hashed, role: "provider", phone: "0501111111" },
    { name: "خالد سالم",  email: "shop2@natheef.com", password: hashed, role: "provider", phone: "0502222222" },
    { name: "فاطمة علي",  email: "shop3@natheef.com", password: hashed, role: "provider", phone: "0503333333" },
  ]);

  await User.create({
    name: "Client Test", email: "client@natheef.com",
    password: hashed, role: "client", phone: "0509999999",
  });

  // Shops (Riyadh coords)
  const shops = await LaundryShop.insertMany([
    {
      user: providers[0]._id,
      name: "مغسلة السحاب الفاخرة",
      description: "أفضل مغسلة فاخرة في الرياض",
      address: "حي الملقا، الرياض",
      lat: 24.774265, lng: 46.738586,
      is_verified: true,
    },
    {
      user: providers[1]._id,
      name: "مغاسل الجودة الحديثة",
      description: "جودة عالية بأسعار معقولة",
      address: "حي النرجس، الرياض",
      lat: 24.810850, lng: 46.635200,
      is_verified: true,
    },
    {
      user: providers[2]._id,
      name: "مغسلة النقاء السريع",
      description: "توصيل سريع في أقل من ساعة",
      address: "حي الياسمين، الرياض",
      lat: 24.774000, lng: 46.740000,
      is_verified: true,
    },
  ]);

  // Provider services
  await ProviderService.insertMany([
    // Shop 1 – luxury prices
    { provider: shops[0]._id, service: washCategory._id, price: 80 },
    { provider: shops[0]._id, service: dryClean._id,     price: 120 },
    { provider: shops[0]._id, service: carpetCat._id,    price: 200 },
    { provider: shops[0]._id, service: shoes._id,        price: 60 },
    // Shop 2 – medium prices
    { provider: shops[1]._id, service: washCategory._id, price: 40 },
    { provider: shops[1]._id, service: dryClean._id,     price: 65 },
    // Shop 3 – economy prices
    { provider: shops[2]._id, service: washCategory._id, price: 20 },
    { provider: shops[2]._id, service: carpetCat._id,    price: 50 },
  ]);

  console.log("✅ Seed complete");
  console.log("Admin:    admin@natheef.com  / password123");
  console.log("Client:   client@natheef.com / password123");
  console.log("Provider: shop1@natheef.com  / password123");
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
