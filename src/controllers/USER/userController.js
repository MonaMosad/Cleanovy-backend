// controllers/userController.js
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

// GET /api/users/profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, username, phone, national_id, password } = req.body;
    const user = req.user;

    if (name) user.name = name;
    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (national_id) user.national_id = national_id;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
