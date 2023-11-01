const router = require('express').Router();
const shelterRoutes = require('./shelterRoutes');
const catRoutes = require('./catRoutes'); // Uncomment this line to include cat routes

router.use('/shelter', shelterRoutes);
router.use('/cat', catRoutes); // Use the appropriate path for cat routes

module.exports = router;