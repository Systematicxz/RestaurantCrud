const User = require('../models/users.model');
const Review = require('../models/reviews.model');
const Restaurant = require('../models/restaurants.model');
const Meal = require('../models/meals.model');
const Order = require('../models/orders.model');

const initModel = () => {
  User.hasMany(Review);
  Review.belongsTo(User);

  User.hasMany(Order);
  Order.belongsTo(User);

  Restaurant.hasMany(Review);
  Review.belongsTo(Restaurant);

  Restaurant.hasMany(Meal);
  Meal.belongsTo(Restaurant);

  Meal.hasOne(Order);
  Order.belongsTo(Meal);
};

module.exports = initModel;
