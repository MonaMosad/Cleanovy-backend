require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

async function seedAdmin() {
  try {
    console.log("🔗 جاري الاتصال بقاعدة البيانات...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ تم الاتصال بـ MongoDB");

    const email = "tasneemtawfeek410@gmail.com";
    const password = "admintasneem12345";

    // تحقق إن المستخدم مش موجود بالفعل
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== "admin") {
        // لو موجود بدور تاني خليه admin
        await User.collection.updateOne(
          { _id: existing._id },
          { $set: { role: "admin", isVerified: true, isActive: true, isBanned: false } }
        );
        console.log("✅ تم تحديث المستخدم الموجود إلى admin");
      } else {
        console.log("⏭️  المستخدم موجود بالفعل كـ admin");
      }
      await mongoose.disconnect();
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    await User.collection.insertOne({
      _id: new mongoose.Types.ObjectId(),
      role: "admin",
      fullName: "Tasneem Tawfeek",
      phone: "01000000000",
      email,
      password: hashedPassword,
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

    console.log("✅ تم إنشاء حساب الأدمن بنجاح");
    console.log(`   البريد: ${email}`);
    console.log(`   كلمة المرور: ${password}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ خطأ:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedAdmin();
