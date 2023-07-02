const Meals = require('../models/meals.model');
const catchAsync = require('../utils/catchAsync');
const Restaurants = require('../models/restaurants.model');

exports.createMeal = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { restaurantId } = req.params;
  const { sessionUser } = req;

  const meal = await Meals.create({
    name,
    price,
    restaurantId,
    userId: sessionUser.id,
  });

  return res.status(201).json({
    status: 'success',
    meal,
  });
});
//!duda aqui
exports.findAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meals.findAll({
    where: {
      status: 'active',
    },
    include: [
      {
        model: Restaurants,
        attributes: ['id', 'name', 'address', 'rating'],
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    results: meals.length,
    meals,
  });
});
//! aqui tambien
exports.getMealById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const meal = await Meals.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: Restaurants,
        attributes: ['id', 'name', 'address', 'rating'],
      },
    ],
  });

  if (!meal) return next(new AppError(`meal with id: ${id} not found`, 404));

  req.user = meal.user;
  req.meal = meal;
  next();
});

exports.updateMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;
  const { name, price } = req.body;

  const mealUpdate = await Meals.update(
    { name, price },
    {
      where: { id: meal.id },
    }
  );

  return res.status(200).json({
    status: 'success',
    meal: mealUpdate,
  });
});

exports.deleteMeal = catchAsync(async (req, res, next) => {
  const { meal } = req;

  await Meals.update(
    { status: 'disabled' },
    {
      where: {
        id: meal.id,
      },
    }
  );

  return res.status(200).json({
    status: 'success',
  });
});
