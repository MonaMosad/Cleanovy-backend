// routes/addressRoutes.js
const { Router } = require("express");
const { getMyAddresses, createAddress, deleteAddress } = require("../../controllers/USER/addressController.js");
const { protect } = require("../../middleware/authMiddleware.js");

const router = Router();
router.use(protect);
router.get("/",       getMyAddresses);
router.post("/",      createAddress);
router.delete("/:id", deleteAddress);
module.exports = router;
