const Restaurant = require('../models/restaurants.model');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/reviews.model');

exports.findAllRestaurant = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.findAll({
    where: {
      status: 'active',
    },
  });
  return res.status(200).json({
    results: restaurants.length,
    message: 'find all restaurants',
    restaurants,
  });
});

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;

  const restaurant = await Restaurant.create({
    name: name.toLowerCase(),
    address: address.toLowerCase(),
    rating,
  });
  return res.status(201).json({
    message: 'created restaurant',
    restaurant,
  });
});

exports.updateRestaurantId = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, address } = req.body;

  const restaurant = await Restaurant.findOne({
    where: {
      id,
      status: 'active',
    },
  });

  if (!restaurant) {
    return res.status(404).json({
      status: 'error',
      message: `The restaurant with id ${id} not found!`,
    });
  }

  await restaurant.update({ name, address });

  return res.status(200).json({
    status: 'success',
    restaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  //* traer el usuario a eliminar
  const { id } = req.params;

  //* buscar usuario
  const restaurant = await Restaurant.findOne({
    where: {
      id,
      status: 'active',
    },
  });
  //* verificar si el usuario existe
  if (!restaurant) {
    return res.status(404).json({
      status: 'error',
      message: `The restaurant with id ${id} not found!`,
    });
  }

  //* remover el user encontrado y cambiar status parcial
  await restaurant.update({
    status: 'disabled',
  });
  //* enviar R= al usuario
  return res.status(200).json({
    message: 'restaurant deleted',
  });
});

exports.findRestaurantIdDelete = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await Restaurant.update({ status: 'disabled' });

  return res.status(200).json({
    status: 'success',
  });
});

exports.findOneRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;

  await Restaurant.findOne({
    where: {
      restaurantId: id,
      status: 'active',
    },
    include: [
      {
        model: Restaurant,
        attributes: ['id', 'name', 'address', 'rating'],
      },
    ],
  });

  if (!restaurant) {
    return res.status(404).json({
      status: 'error',
      message: `The restaurant with id ${id} not found!`,
    });
  }

  return res.status(200).json({
    message: 'restaurant finded',
    restaurant,
  });
});

exports.updateRestaurantIdReview = catchAsync(async (req, res, next) => {
  const { review } = req;
  const { rating, comment } = req.body;

  await Review.findOne({
    where: {
      id,
      restaurantId,
    },
  });

  await review.update({ rating, comment });

  return res.status(200).json({
    status: 'success review updated',
    review,
    comment,
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { id } = req.params;
  const uid = req.sessionUser.id;

  const review = await Review.create({
    comment,
    rating,
    restaurantId: +id,
    userId: +uid,
  });

  return res.status(201).json({
    status: 'success',
    message: 'Review created',
    review,
  });
});

exports.deleteReviewidRestaurant = catchAsync(async (req, res, next) => {
  const { review } = req;

  await review.findOne({
    where: {
      id,
      restaurantId,
    },
  });

  if (!review) {
    return res.status(404).json({
      status: 'error',
      message: `The review with id ${id} not found!`,
    });
  }

  await review.update({ status: 'false' });

  return res.status(200).json({
    status: 'review deleted',
  });
});
