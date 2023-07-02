const express = require('express');

//*controllers/middlewares
const userController = require('../controllers/users.controller');
const authController = require('../controllers/auth.controller');
const userMiddleware = require('../middlewares/users.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const validationMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router
  .route('/login')
  .post(validationMiddleware.createUserValidation, authController.login);
router.route('/signup').post(authController.signup);

//!protection at continue
router.use(authMiddleware.protect);

router.get('/', userController.findAll);

router
  .route('/orders')
  .get(userMiddleware.validUser, userController.findUserOrders);

router
  .route('/orders/:id')
  .get(userMiddleware.validUser, userController.findOneOrder);

router
  .route('/:id', userMiddleware.validUser)
  .patch(authMiddleware.protectAccountOwner, userController.updateUser)
  .delete(authMiddleware.protectAccountOwner, userController.deleteUser);

module.exports = router;
