const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/error.controller');
//*routes
const userRouter = require('./routes/users.routes');
const restaurantRouter = require('./routes/restaurants.routes');
const mealsRouter = require('./routes/meals.routes');
const ordersRouter = require('./routes/orders.routes');
const app = express();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV !== 'development') {
  app.use(morgan('dev'));
}

//routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/restaurants', restaurantRouter);
app.use('/api/v1/meals', mealsRouter);
app.use('/api/v1/orders', ordersRouter);

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Cant find ${req.originalUrl} on this server!`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
