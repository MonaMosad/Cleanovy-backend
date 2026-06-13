// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import LaundryShop from "../models/laundryShopModel.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "secret", { expiresIn: "30d" });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, username, email, password, phone, national_id, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email and password are required" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, username, email,
      password: hashed,
      phone, national_id,
      role: role === "provider" ? "provider" : "client",
    });

    res.status(201).json({
      token: signToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      token: signToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const me = async (req, res) => {
  try {
    const user = req.user;
    let shop = null;
    if (user.role === "provider") {
      shop = await LaundryShop.findOne({ user: user._id }).select("-__v");
    }
    res.json({ user, shop });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
