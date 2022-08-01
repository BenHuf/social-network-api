const router = require('express').Router();
const apiRoutes = require('./api');

router.use('/api', apiRoutes);

// sends error if invalid route
router.use((req, res) => {
  res.status(404).send("<h1> Umm...? I think you're lost. <h1>");
});

module.exports = router;