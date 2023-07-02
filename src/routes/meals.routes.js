const express = require('express');

const mealsController = require('../controllers/meals.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const validatorMiddleware = require('../middlewares/validations.middleware');

const router = express.Router();

router.get('/', mealsController.findAllMeals);
router.get('/:id', mealsController.getMealById);

//!         PROTECCION CON TODO LO DE ABAJO
router.use(authMiddleware.protect);

router
  .route('/:id')
  .post(
    authMiddleware.restrictTo('admin'),
    validatorMiddleware.createMealValid,
    mealsController.createMeal
  )
  .patch(authMiddleware.restrictTo('admin'), mealsController.updateMeal)
  .delete(authMiddleware.restrictTo('admin'), mealsController.deleteMeal);

module.exports = router;
