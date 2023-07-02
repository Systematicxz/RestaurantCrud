const User = require('../models/users.model');
const catchAsync = require('./../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('./../utils/jwt');
const AppError = require('../utils/appError');

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, description } = req.body;

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.toLowerCase(),
    email: email.toLowerCase(),
    password: encryptedPassword,
    description,
  });

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    message: 'The user has been created',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      role: user.role,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { currentPassword, newPassword } = req.body;

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    return next(new AppError('Incorrect password', 401));
  }

  const salt = await bcrypt.genSalt(12);
  const encryptedPassword = await bcrypt.hash(newPassword, salt);

  await user.update({
    password: encryptedPassword,
    passwordChangedAt: new Date(),
  });

  return res.status(200).json({
    status: 'success',
    message: 'The user password was updated successfully',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  //* traer la info de la req.body

  const { email, password } = req.body;

  //* se busca el user y se revisa si existe
  //! no estoy seguro si es User o con S hay que checarlo
  const user = await User.findOne({
    where: {
      email: email.toLowerCase(),
      status: 'active',
    },
  });
  if (!user) {
    return next(new AppError(`user with the email ${email} not found `, 404));
  }

  //* validar si la contra coincide

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('incorrect email or password ', 404));
  }
  //* se genera el token
  const token = await generateJWT(user.id);

  //* enviar la R= al cliente
  res.status(200).json({
    status: 'success',
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      role: user.role,
    },
  });
});
