const Contact = require("../../models/contactModel");

exports.submitContact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ status: "fail", message: "جميع الحقول مطلوبة" });
    }
    const doc = await Contact.create({ name, email, message });
    res.status(201).json({ status: "success", data: doc });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: contacts });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.deleteContact = async (req, res) => {
  try {
    const doc = await Contact.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ status: "fail", message: "الرسالة غير موجودة" });
    res.status(200).json({ status: "success", message: "تم الحذف" });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const doc = await Contact.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!doc) return res.status(404).json({ status: "fail", message: "الرسالة غير موجودة" });
    res.status(200).json({ status: "success", data: doc });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
