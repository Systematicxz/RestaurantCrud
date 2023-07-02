const Orders = require('../models/orders.model');
const catchAsync = require('../utils/catchAsync');
const Users = require('../models/users.model');
const Meal = require('../models/meals.model');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { mealId, quantity } = req.body;
  const { sessionUser } = req;

  //* Buscar si existe la comida (meal)
  const meals = await Meal.findAll({ where: { id: mealId } });
  if (meals.length === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'La comida no existe.',
    });
  }

  const meal = meals[0]; //* Toma la primera comida encontrada

  //* Calcular el precio para el usuario
  const price = meal.price * quantity;

  //* Crear una nueva orden
  const order = await Orders.create({
    mealId: meal.id,
    quantity,
    price,
    userId: sessionUser.id,
  });

  return res.status(201).json({
    status: 'success',
    order,
  });
});

exports.findMyOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Orders.findAll({
    where: {
      userId: sessionUser.id,
      status: ['active', 'cancelled', 'completed'],
    },
    include: [
      {
        model: Users,
        attributes: ['id', 'name'],
      },
      {
        model: Meal,
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;

  if (order.status !== 'active') {
    return res.status(400).json({
      status: 'error',
      message: 'La orden no está activa.',
    });
  }

  await Orders.update(
    { status: 'completed' },
    {
      where: {
        id: order.id,
      },
    }
  );

  return res.status(200).json({
    status: 'success',
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  if (order.status !== 'active') {
    return res.status(400).json({
      status: 'error',
      message: 'La orden no está activa.',
    });
  }

  await Orders.update(
    { status: 'cancelled' },
    {
      where: {
        id: order.id,
      },
    }
  );

  return res.status(200).json({
    status: 'success',
  });
});
