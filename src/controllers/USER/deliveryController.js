// controllers/deliveryController.js
const Delivery = require("../../models/deliveryModel.js");
const LaundryShop = require("../../models/laundryShopModel.js");

// GET /api/delivery  – provider sees their delivery agents
const getDeliveries = async (req, res) => {
  try {
    const shop = await LaundryShop.findOne({ user: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    res.json(await Delivery.find({ provider: shop._id }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/delivery  – provider adds a delivery agent
const createDelivery = async (req, res) => {
  try {
    const shop = await LaundryShop.findOne({ user: req.user._id });
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    const { name, phone } = req.body;
    if (!name || !phone) return res.status(400).json({ message: "name and phone required" });

    const delivery = await Delivery.create({ provider: shop._id, name, phone });
    res.status(201).json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/delivery/:id/status
const updateDeliveryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const delivery = await Delivery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!delivery) return res.status(404).json({ message: "Delivery agent not found" });
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getDeliveries, createDelivery, updateDeliveryStatus };
