require("dotenv").config();
const mongoose = require("mongoose");
const Order = require("./src/models/orderModel");
const OrderItem = require("./src/models/orderItemModel");
const User = require("./src/models/userModel");
const LaundryShop = require("./src/models/laundryShopModel");
const Service = require("./src/models/serviceModel");
const Address = require("./src/models/addressModel");

async function seed() {
  await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/Cleanovy");
  console.log("✅ Connected");

  // نجيب عملاء + مغاسل معتمدة + خدمات موجودين
  const clients   = await User.find({ role: "client" }).limit(5).lean();
  const laundries = await LaundryShop.find({ is_verified: true }).limit(3).lean();
  let services    = await Service.find().limit(5).lean();

  if (clients.length === 0 || laundries.length === 0) {
    console.error("❌ محتاجة عملاء ومغاسل معتمدة في الـ DB الأول");
    process.exit(1);
  }
  if (services.length === 0) {
    console.error("⚠️ مفيش services — هعمل أوردرات من غير items");
  }

  // عنوان دمي (لو مفيش عناوين)
  let address = await Address.findOne().lean();
  if (!address) {
    const region = new mongoose.Types.ObjectId();
    address = await Address.create({
      user: clients[0]._id,
      region,
      address: "شارع التحرير، القاهرة",
    });
  }

  // نمسح أوردرات الدمي القديمة
  const oldOrders = await Order.find({ notes: "seed_full" }).select("_id").lean();
  const oldIds = oldOrders.map((o) => o._id);
  await OrderItem.deleteMany({ order: { $in: oldIds } });
  await Order.deleteMany({ notes: "seed_full" });

  const statuses = ["pending", "accepted", "in_progress", "ready", "out_for_delivery", "delivered", "cancelled"];
  const payments = ["paid", "pending"];

  let createdCount = 0;

  for (let i = 0; i < 12; i++) {
    const client   = clients[i % clients.length];
    const laundry  = laundries[i % laundries.length];
    const status   = statuses[i % statuses.length];
    const providerPrice = (i + 1) * 30;
    const shipping = 20;
    const total = providerPrice + shipping;

    const order = await Order.create({
      client: client._id,
      provider: laundry._id,
      address: address._id,
      delivery_type: "delivery",
      provider_price: providerPrice,
      shipping_price: shipping,
      discount: 0,
      total_price: total,
      platform_commission: providerPrice * 0.1,
      payment_method: "cash",
      payment_status: status === "delivered" ? "paid" : payments[i % payments.length],
      status,
      pickup_time: new Date(),
      delivery_time: status === "delivered" ? new Date() : null,
      notes: "seed_full",
    });

    // نضيف 1-2 item للأوردر لو فيه services
    if (services.length > 0) {
      const items = [];
      const count = (i % 2) + 1;
      for (let j = 0; j < count; j++) {
        const service = services[(i + j) % services.length];
        items.push({
          order: order._id,
          service: service._id,
          quantity: j + 1,
          unit_price: 30,
          total_price: 30 * (j + 1),
        });
      }
      await OrderItem.insertMany(items);
    }

    createdCount++;
  }

  console.log(`🧾 Created ${createdCount} orders (مع items)`);
  console.log("\nالحالات اتوزعت على: pending / accepted / in_progress / ready / out_for_delivery / delivered / cancelled");
  process.exit(0);
}

seed().catch((e) => { console.error("❌", e.message); process.exit(1); });