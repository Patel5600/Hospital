const express = require('express');
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
    .route('/me')
    .get(getProfile)
    .put(updateProfile);

module.exports = router;
