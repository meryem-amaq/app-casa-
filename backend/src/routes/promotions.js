const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const requireStaff = require('../middleware/requireStaff');
const promotionCtrl = require('../controllers/promotionController');
const { apiLimiter } = require('../middleware/rateLimiter');

router.use(apiLimiter);

router.get('/', auth, promotionCtrl.getAll);
router.post('/', auth, requireStaff, promotionCtrl.create);
router.delete('/:id', auth, requireStaff, promotionCtrl.delete);

module.exports = router;
