

// في كل route file
// router.use(authMiddleware);        // التحقق من التوكن
// router.use(providerOnlyMiddleware); // التحقق إنه provider مش client




const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the provider dashboard!" });
});

module.exports = router;
