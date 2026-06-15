require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const LaundryShop = require("../models/laundryShopModel");
const ProviderService = require("../models/providerServiceModel");
const Service = require("../models/serviceModel");

// ─── بيانات المغاسل العشر ────────────────────────────────────────────────────
const LAUNDRIES = [
  {
    name: "مغسلة النجوم",
    phone: "01012345001",
    email: "najoom@cleanovy.test",
    address: "القاهرة، مصر الجديدة، شارع ليبيا",
    description: "متخصصون في غسيل الملابس بالبخار والكوي الاحترافي",
  },
  {
    name: "مغسلة الفردوس",
    phone: "01012345002",
    email: "ferdos@cleanovy.test",
    address: "الجيزة، المهندسين، شارع جامعة الدول",
    description: "خدمة غسيل سريعة وتوصيل للمنزل في 24 ساعة",
  },
  {
    name: "مغسلة الأصيل",
    phone: "01012345003",
    email: "aseel@cleanovy.test",
    address: "الإسكندرية، سيدي بشر، كورنيش الإسكندرية",
    description: "تنظيف جاف واحترافي للملابس الفاخرة والبدل",
  },
  {
    name: "مغسلة الوطن",
    phone: "01012345004",
    email: "watan@cleanovy.test",
    address: "القاهرة، مدينة نصر، شارع عباس العقاد",
    description: "غسيل الستائر والسجاد والملابس بأعلى جودة",
  },
  {
    name: "مغسلة الشروق",
    phone: "01012345005",
    email: "shoroq@cleanovy.test",
    address: "القاهرة، التجمع الخامس، طريق التسعين الجنوبي",
    description: "تنظيف شامل للملابس والمفروشات مع ضمان الجودة",
  },
  {
    name: "مغسلة الريحان",
    phone: "01012345006",
    email: "rihan@cleanovy.test",
    address: "الجيزة، العجوزة، شارع النيل",
    description: "استخدام أحدث تقنيات الغسيل الصديق للبيئة",
  },
  {
    name: "مغسلة الياسمين",
    phone: "01012345007",
    email: "yasmin@cleanovy.test",
    address: "القاهرة، المعادي، شارع 9",
    description: "خبرة 15 سنة في تنظيف الملابس الحساسة والفاخرة",
  },
  {
    name: "مغسلة البدر",
    phone: "01012345008",
    email: "badr@cleanovy.test",
    address: "الإسكندرية، المنتزه، شارع الجيش",
    description: "تنظيف جاف ورطب لجميع أنواع الأقمشة والملابس",
  },
  {
    name: "مغسلة السلام",
    phone: "01012345009",
    email: "salam@cleanovy.test",
    address: "القاهرة، شبرا، شارع كوبري الليمون",
    description: "أسعار منافسة وجودة عالية مع خدمة استلام وتوصيل",
  },
  {
    name: "مغسلة القمر",
    phone: "01012345010",
    email: "qamar@cleanovy.test",
    address: "الجيزة، فيصل، شارع الهرم",
    description: "متخصصون في غسيل البدل الرجالية وفساتين السهرة",
  },
];

// ─── خدمات أساسية للمغاسل ────────────────────────────────────────────────────
const BASE_SERVICES = [
  { name: "غسيل ملابس", unit: "per_piece" },
  { name: "كوي", unit: "per_piece" },
  { name: "تنظيف جاف", unit: "per_piece" },
  { name: "غسيل سجاد", unit: "per_kg" },
  { name: "غسيل ستائر", unit: "per_set" },
];

async function getOrCreateServices() {
  const existing = await Service.find({ name: { $in: BASE_SERVICES.map((s) => s.name) } }).lean();
  const existingNames = new Set(existing.map((s) => s.name));

  const toCreate = BASE_SERVICES.filter((s) => !existingNames.has(s.name));
  let created = [];
  if (toCreate.length > 0) {
    created = await Service.insertMany(toCreate);
    console.log(`✅ تم إنشاء ${created.length} خدمة جديدة`);
  }

  return [...existing, ...created];
}

async function seed() {
  try {
    console.log("🔗 جاري الاتصال بقاعدة البيانات...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ تم الاتصال بـ MongoDB");

    const services = await getOrCreateServices();

    let created = 0;
    let skipped = 0;

    for (const data of LAUNDRIES) {
      // تحقق إن المغسلة مش موجودة بالفعل
      const existingShop = await LaundryShop.findOne({ name: data.name });
      if (existingShop) {
        console.log(`⏭️  موجودة بالفعل: ${data.name}`);
        skipped++;
        continue;
      }

      // إنشاء يوزر صاحب المغسلة (insertOne لتجاوز الـ pre-save hook)
      const hashedPassword = await bcrypt.hash("Test@1234", 12);
      const userId = new mongoose.Types.ObjectId();
      const now = new Date();
      await User.collection.insertOne({
        _id: userId,
        fullName: `صاحب ${data.name}`,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        role: "laundry_owner",
        authProvider: "local",
        isVerified: true,
        isActive: true,
        isBanned: false,
        avatar: null,
        address: null,
        googleId: null,
        facebookId: null,
        createdAt: now,
        updatedAt: now,
      });

      // إنشاء المغسلة (is_verified: false = قيد الانتظار)
      const shopId = new mongoose.Types.ObjectId();
      await LaundryShop.collection.insertOne({
        _id: shopId,
        user: userId,
        name: data.name,
        phone: data.phone,
        address: data.address,
        description: data.description,
        is_verified: false,
        is_suspended: false,
        is_active: true,
        avg_rating: 0,
        total_reviews: 0,
        images: [],
        working_hours: [],
        logo: null,
        createdAt: now,
        updatedAt: now,
      });
      const shop = { _id: shopId };

      // إضافة 2-3 خدمات عشوائية للمغسلة
      const shuffled = services.sort(() => 0.5 - Math.random());
      const picked = shuffled.slice(0, 2 + Math.floor(Math.random() * 2));
      const providerServices = picked.map((s) => ({
        provider: shop._id,
        service: s._id,
        price: 20 + Math.floor(Math.random() * 80),
        unit: s.unit,
        is_active: true,
      }));
      await ProviderService.insertMany(providerServices);

      console.log(`✅ تمت إضافة: ${data.name} (${picked.map((s) => s.name).join("، ")})`);
      created++;
    }

    console.log("\n─────────────────────────────────────────");
    console.log(`✅ تم إنشاء ${created} مغسلة جديدة قيد الانتظار`);
    if (skipped > 0) console.log(`⏭️  تم تخطي ${skipped} مغسلة موجودة مسبقاً`);
    console.log("─────────────────────────────────────────\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ خطأ:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
