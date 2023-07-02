const express = require('express');
const orderController = require('../controllers/orders.controller');
const authmiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(authmiddleware.protect);
router.post('/', orderController.createOrder);

router
  .route('/:id')
  .patch(orderController.updateOrder)
  .delete(orderController.deleteOrder);

router.route('/me').get(orderController.findMyOrder);

module.exports = router;
