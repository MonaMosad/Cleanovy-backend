// routes/addressRoutes.js
import { Router } from "express";
import { getMyAddresses, createAddress, deleteAddress } from "../controllers/addressController.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.use(protect);
router.get("/",       getMyAddresses);
router.post("/",      createAddress);
router.delete("/:id", deleteAddress);
export default router;
