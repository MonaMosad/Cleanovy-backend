const express = require('express');
const router = express.Router();
const { submitContactRequest } = require('../controllers/contactUsController');

// Public route - anyone can submit
router.post('/submit', submitContactRequest);

module.exports = router;