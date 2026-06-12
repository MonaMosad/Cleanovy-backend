const express = require("express");
const router = express.Router();
const usersController = require("../../controllers/admin/users.controller");

router.get("/", usersController.getUsers);                 // لستة + سيرش + pagination
router.get("/:id", usersController.getUserById);           // عرض يوزر + إحصائياته
router.delete("/:id", usersController.deleteUser);         // soft delete
router.patch("/:id/restore", usersController.restoreUser); // اختياري: إعادة تفعيل

module.exports = router;