require("dotenv").config();
const mongoose = require("mongoose");
const Review = require("./src/models/reviewModel");
const Order = require("./src/models/orderModel");
const User = require("./src/models/userModel");
const LaundryShop = require("./src/models/laundryShopModel");

const comments = [
  "خدمة ممتازة جداً ملابسي رجعت نظيفة وريحتها حلوة. أكيد هستخدم الخدمة تاني.",
  "الخدمة جيدة بشكل عام والتوصيل كان في الوقت.",
  "كويسة بس التوصيل اتأخر شوية عن الموعد.",
  "أفضل مغسلة تعاملت معاها، أنصح بيها بشدة.",
  "مش راضية عن النتيجة، فيه بقع لسه موجودة.",
  "تعامل محترم وأسعار مناسبة جداً.",
  "سرعة في التنفيذ وجودة عالية، شكراً ليكم.",
  "الأسعار غالية شوية بس الخدمة تستاهل.",
  "ملابسي اتلخبطت مع طلب تاني، تجربة سيئة.",
  "نظافة ممتازة والكوي مرتب جداً.",
  "خدمة عملاء رائعة وردهم سريع.",
  "متوسطة، مفيش حاجة مميزة.",
  "التغليف كان احترافي والملابس محمية كويس.",
  "تأخير في التسليم لكن النتيجة كويسة.",
  "أنصح أي حد يجرب، تجربة ممتازة من الأول للآخر.",
];

async function seed() {
  await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/Cleanovy");
  console.log("✅ Connected");

  const clients   = await User.find({ role: "client" }).limit(8).lean();
  const laundries = await LaundryShop.find({ is_verified: true }).limit(3).lean();

  if (clients.length === 0 || laundries.length === 0) {
    console.error("❌ محتاجة عملاء ومغاسل معتمدة في الـ DB الأول");
    process.exit(1);
  }

  // نمسح ريفيوز الدمي القديمة + الأوردرات بتاعتها
  const oldReviews = await Review.find({ comment: { $regex: "seed_rev" } }).select("order").lean();
  const oldOrderIds = oldReviews.map((r) => r.order);
  await Review.deleteMany({ comment: { $regex: "seed_rev" } });
  await Order.deleteMany({ _id: { $in: oldOrderIds } });

  const fakeAddress = new mongoose.Types.ObjectId();
  const reviews = [];

  for (let i = 0; i < 20; i++) {
    const client  = clients[i % clients.length];
    const laundry = laundries[i % laundries.length];
    const rating  = (i % 5) + 1; // توزيع النجوم من 1 لـ 5

    // أوردر دمي لكل ريفيو (شرط unique على order)
    const order = await Order.create({
      client: client._id,
      provider: laundry._id,
      address: fakeAddress,
      delivery_type: "delivery",
      provider_price: 100,
      shipping_price: 20,
      discount: 0,
      total_price: 120,
      platform_commission: 10,
      payment_method: "cash",
      payment_status: "paid",
      status: "delivered",
      pickup_time: new Date(),
      delivery_time: new Date(),
      notes: "seed_rev_order",
    });

    reviews.push({
      client: client._id,
      provider: laundry._id,
      order: order._id,
      rating,
      comment: `${comments[i % comments.length]} [seed_rev]`,
      is_hidden: i % 7 === 0, // نخلي شوية منهم مخفيين عشان نتست الفلتر
    });
  }

  const created = await Review.insertMany(reviews);
  console.log(`⭐ Created ${created.length} reviews`);

  // إحصائية سريعة للتوزيع
  const byRating = {};
  created.forEach((r) => { byRating[r.rating] = (byRating[r.rating] || 0) + 1; });
  console.log("توزيع النجوم:", byRating);
  console.log(`مخفيين: ${created.filter((r) => r.is_hidden).length}`);

  process.exit(0);
}

seed().catch((e) => { console.error("❌", e.message); process.exit(1); });