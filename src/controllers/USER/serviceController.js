// controllers/serviceController.js
const Service = require("../../models/serviceModel.js");
const { CATEGORY_NAMES } = require("../../data/serviceCatalog");

const getServices = async (req, res) => {
  try {
    const categories = await Service.find({
      parent: null,
      provider: null,
      is_active: true,
      name: { $in: CATEGORY_NAMES },
    }).sort({ name: 1 });

    const categoryIds = categories.map((c) => c._id);
    const children = await Service.find({
      parent: { $in: categoryIds },
      provider: null,
      is_active: true,
    }).populate("parent", "name icon");

    const result = categories.map((cat) => ({
      ...cat.toObject(),
      children: children.filter(
        (s) => s.parent && s.parent._id.toString() === cat._id.toString()
      ),
    }));

    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createService = async (req, res) => {
  try {
    const { name, parent, unit, icon } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });

    if (parent) {
      const parentCat = await Service.findOne({ _id: parent, parent: null, provider: null });
      if (!parentCat) {
        return res.status(400).json({ message: "Invalid parent category" });
      }
    } else if (!CATEGORY_NAMES.includes(name)) {
      return res.status(400).json({ message: "Top-level entries must be catalog categories" });
    }

    const service = await Service.create({
      name,
      parent: parent || null,
      unit: unit || "per_piece",
      icon: icon || "",
      provider: null,
    });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getServices, createService, deleteService };
