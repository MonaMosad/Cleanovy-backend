const express = require("express");
const router = express.Router();
const { submitContact, getAllContacts, deleteContact, markAsRead } = require("../controllers/USER/contactController");

router.post("/", submitContact);
router.get("/", getAllContacts);
router.patch("/:id/read", markAsRead);
router.delete("/:id", deleteContact);

module.exports = router;
