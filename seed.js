require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/userModel");
const Order = require("./src/models/orderModel");

const MONGO_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/Cleanovy";
const PASSWORD = "Test@1234";

const clients = [
  { fullName: "خالد العتيبي",    username: "khaled_otaibi",    email: "khaled@cleanovytest.com",    phone: "01012340001", national_id: "2990000001" },
  { fullName: "نورة القحطاني",   username: "noura_qahtani",    email: "noura@cleanovytest.com",     phone: "01012340002", national_id: "2990000002" },
  { fullName: "عبدالله الغامدي", username: "abdullah_ghamdi",  email: "abdullah@cleanovytest.com",  phone: "01012340003", national_id: "2990000003" },
  { fullName: "ريم الدوسري",     username: "reem_dosari",      email: "reem@cleanovytest.com",      phone: "01012340004", national_id: "2990000004" },
  { fullName: "فهد المطيري",     username: "fahad_mutairi",    email: "fahad@cleanovytest.com",     phone: "01012340005", national_id: "2990000005" },
  { fullName: "سارة الشهري",     username: "sara_shahri",      email: "sara2@cleanovytest.com",     phone: "01012340006", national_id: "2990000006" },
  { fullName: "محمد الزهراني",   username: "mohammed_zahrani", email: "mohammed@cleanovytest.com",  phone: "01012340007", national_id: "2990000007" },
  { fullName: "لطيفة العنزي",    username: "latifa_anazi",     email: "latifa@cleanovytest.com",    phone: "01012340008", national_id: "2990000008" },
  { fullName: "يوسف الحربي",     username: "yousef_harbi",     email: "yousef@cleanovytest.com",    phone: "01012340009", national_id: "2990000009" },
  { fullName: "أمل السبيعي",     username: "amal_subaie",      email: "amal@cleanovytest.com",      phone: "01012340010", national_id: "2990000010" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to DB");

    await User.deleteMany({ email: { $regex: "@cleanovytest\\.com$" } });
    console.log("🧹 Cleared old dummy clients");

    const hashedPassword = await bcrypt.hash(PASSWORD, 12);

    const clientDocs = clients.map((c) => ({
      ...c,
      role: "client",
      password: hashedPassword,
      authProvider: "local",
      isVerified: true,
      isActive: true,
      isBanned: false,
    }));

    let createdUsers = [];
    try {
      createdUsers = await User.insertMany(clientDocs, { timestamps: true });
      console.log(`👥 Created ${createdUsers.length} clients`);
    } catch (e) {
      console.error("⚠️ فشل إنشاء الكلاينتس:", e.message);
    }

    if (createdUsers.length >= 2) {
      const fakeProvider = new mongoose.Types.ObjectId();
      const fakeAddress  = new mongoose.Types.ObjectId();
      const u0 = createdUsers[0]._id;
      const u1 = createdUsers[1]._id;

      const orders = [
        { client: u0, provider_price: 100, shipping_price: 20, discount: 0,  total_price: 120, platform_commission: 10, payment_status: "paid",    status: "delivered", pickup_time: new Date(), delivery_time: new Date() },
        { client: u0, provider_price: 200, shipping_price: 25, discount: 10, total_price: 215, platform_commission: 20, payment_status: "paid",    status: "delivered", pickup_time: new Date(), delivery_time: new Date() },
        { client: u0, provider_price: 80,  shipping_price: 15, discount: 0,  total_price: 95,  platform_commission: 8,  payment_status: "pending", status: "pending",   pickup_time: new Date() },
        { client: u1, provider_price: 150, shipping_price: 20, discount: 0,  total_price: 170, platform_commission: 15, payment_status: "paid",    status: "delivered", pickup_time: new Date(), delivery_time: new Date() },
      ].map((o) => ({
        ...o,
        provider: fakeProvider,
        address: fakeAddress,
        delivery_type: "delivery",
        payment_method: "cash",
        notes: "dummy order",
      }));

      try {
        await Order.insertMany(orders);
        console.log(`🧾 Created ${orders.length} dummy orders`);
        console.log(`\nℹ️  يوزر بأوردرات (stats): ${u0}`);
        console.log(`ℹ️  يوزر من غير أوردرات:   ${createdUsers[2]?._id}`);
      } catch (e) {
        console.error("⚠️ فشل إنشاء الأوردرات:", e.message);
      }
    }

    console.log(`\n🎉 Done! باسورد كل اليوزرز: ${PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();