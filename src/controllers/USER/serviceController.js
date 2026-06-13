// controllers/serviceController.js
const Service = require("../../models/serviceModel.js");

const getServices = async (req, res) => {
  try {
    // Return tree: top-level categories with their children
    const all = await Service.find().populate("parent", "name");
    const categories = all.filter((s) => !s.parent);
    const result = categories.map((cat) => ({
      ...cat.toObject(),
      children: all.filter((s) => s.parent && s.parent._id.toString() === cat._id.toString()),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createService = async (req, res) => {
  try {
    const { name, parent } = req.body;
    if (!name) return res.status(400).json({ message: "name required" });
    const service = await Service.create({ name, parent: parent || null });
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
