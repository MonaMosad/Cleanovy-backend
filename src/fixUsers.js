require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.DATABASE_URL || "mongodb://localhost:27017/Cleanovy";

async function run() {
  try {
    await mongoose.connect(MONGO_URI);

    // بنشتغل على الـ collection مباشرة (raw) عشان الـ $rename يتنفّذ زي ما هو
    const result = await mongoose.connection.db.collection("users").updateMany(
      { name: { $exists: true } },
      { $rename: { name: "fullName", is_active: "isActive" } }
    );

    console.log(`✅ تم تعديل ${result.modifiedCount} يوزر`);
    process.exit(0);
  } catch (err) {
    console.error("❌", err.message);
    process.exit(1);
  }
}

run();