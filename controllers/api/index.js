const router = require('express').Router();
const shelterRoutes = require('./shelterRoutes');
// const catRoutes = require('./catRoutes');

router.use('/shelter', shelterRoutes);
// router.use('/cat', catRoutes);

module.exports = router;