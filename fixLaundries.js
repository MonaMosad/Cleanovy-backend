require("dotenv").config();
const mongoose = require("mongoose");

async function run() {
  await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/Cleanovy");
  
  const result = await mongoose.connection.db
    .collection("laundryshops")
    .updateMany(
      { is_suspended: { $exists: false } },
      { $set: { is_suspended: false, suspension_reason: null } }
    );
  
  console.log(`✅ تم تعديل ${result.modifiedCount} مغسلة`);
  process.exit(0);
}

run();