// controllers/addressController.js
import Address from "../models/addressModel.js";

export const getMyAddresses = async (req, res) => {
  try {
    res.json(await Address.find({ user: req.user._id }).populate("region", "name"));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createAddress = async (req, res) => {
  try {
    const { region, address } = req.body;
    if (!address) return res.status(400).json({ message: "address required" });
    const doc = await Address.create({ user: req.user._id, region, address });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const doc = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!doc) return res.status(404).json({ message: "Address not found" });
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
