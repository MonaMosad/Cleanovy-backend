// controllers/regionController.js
import Region from "../models/regionModel.js";

// 1. جلب كل المناطق مرتبة بالاسم
export const getRegions = async (_req, res) => {
  try {
    res.json(await Region.find().sort("name"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. جلب منطقة واحدة بالـ ID (الدالة دي اللي كانت ناقصة ومسببة المشكلة ✅)
export const getRegionById = async (req, res) => {
  try {
    const { id } = req.params;
    const region = await Region.findById(id);

    if (!region) {
      return res.status(404).json({ message: "المنطقة غير موجودة" });
    }

    res.status(200).json(region);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. إنشاء منطقة جديدة
export const createRegion = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });
    res.status(201).json(await Region.create({ name }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. حذف منطقة
export const deleteRegion = async (req, res) => {
  try {
    await Region.findByIdAndDelete(req.params.id);
    res.json({ message: "Region deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};