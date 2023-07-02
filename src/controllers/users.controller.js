const Users = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');
const Orders = require('../models/orders.model');

exports.findAll = catchAsync(async (req, res, next) => {
  const users = await Users.findAll({
    where: {
      status: 'active',
    },
    include: [
      {
        model: Orders,
        attributes: ['id', 'mealId', 'totalPrice'],
      },
    ],
    limit: 10,
  });
  return res.status(200).json({
    results: users.length,
    message: 'find all users',
    users,
  });
});

exports.create = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);

  //* crear producto con el modelo
  const user = await Users.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });
  //* se espera el token
  const token = await generateJWT(user.id);
  //* enviar R= al usuario
  return res.status(201).json({
    message: 'created user',
    token,
    user: {
      id: user.id,
      name: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  });
});

exports.findUser = catchAsync(async (req, res, next) => {
  //* traer id de la Req del usuario
  const { id } = req.params;
  //* buscar usuario en bd
  const user = await Users.findOne({
    where: {
      id,
      status: 'active',
    },
    include: [
      {
        model: Orders,
        attributes: ['id', 'mealId', 'totalPrice'],
      },
    ],
  });
  //* verificar si el usuario existe
  if (!user) {
    return res.status(404).json({
      status: 'error',
      message: `The user with id ${id} not found!`,
    });
  }

  //* R= al cliente
  return res.status(200).json({
    message: 'user finded',
    user,
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, email } = req.body;

  await user.update({ name, email });
  return res.status(200).json({
    status: 'update user',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  await user.update({ status: 'disabled' });
  return res.status(200).json({
    status: 'user deleted',
  });
});

exports.findUserOrders = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const orders = await Orders.findAll({
    where: {
      userId: id,
      status: ['active', 'cancelled', 'completed'],
    },
    include: [
      {
        model: Orders,
        attributes: { exclude: ['totalPrice', 'quantity', 'status'] },
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    results: orders.length,
    orders,
  });
});

exports.findOneOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Orders.findOne({
    where: {
      userId: id,
      status: ['active', 'cancelled', 'completed'],
    },
    include: [
      {
        model: Orders,
        attributes: { exclude: ['totalPrice', 'quantity', 'status'] },
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    results: order.length,
    order,
  });
});
