const express = require('express');
const restauranController = require('../controllers/restaurant.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validateRestaurant = require('../middlewares/validations.middleware');
const restaurantMiddleware = require('../middlewares/restaurant.middleware');
const reviewMiddleware = require('../middlewares/review.middleware');
const router = express.Router();

router.route('/').get(restauranController.findAllRestaurant);
router
  .route('/:id', restaurantMiddleware.existRestaurant)
  .get(restauranController.findOneRestaurant);

//!         PROTECCION CON TODO LO DE ABAJO
router.use(authMiddleware.protect);

router
  .route('/')
  .post(
    authMiddleware.restrictTo('admin'),
    validateRestaurant.createRestaurant,
    restauranController.createRestaurant
  );

router
  .route('/:id', restaurantMiddleware.existRestaurant)
  .patch(
    authMiddleware.restrictTo('admin'),
    restauranController.updateRestaurantId
  )
  .delete(
    authMiddleware.restrictTo('admin'),
    restauranController.deleteRestaurant
  );

router
  .route('/reviews/:id')
  .post(restaurantMiddleware.existRestaurant, restauranController.createReview);

router
  .route(
    '/reviews/:restaurantId/:id',
    reviewMiddleware.existReview,
    restaurantMiddleware.existRestaurant
  )
  .patch(
    authMiddleware.protectAccountOwner,
    restauranController.updateRestaurantIdReview
  )
  .delete(
    authMiddleware.protectAccountOwner,
    restauranController.deleteReviewidRestaurant
  );

module.exports = router;
