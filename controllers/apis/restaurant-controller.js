const restaurantServices = require('../../services/restaurant-services')
const restaurantController = {
  getRestaurants: (req, res, next) => {
    restaurantServices.getRestaurants(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getRestaurant: (req, res, next) => {
    restaurantServices.getRestaurant(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getSearch: (req, res, next) => {
    restaurantServices.getSearch(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  getAddress: (req, res, next) => {
    restaurantServices.getAddress(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  postAddress: (req, res, next) => {
    restaurantServices.postAddress(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = restaurantController
