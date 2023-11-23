const orderServices = require('../../services/order-services')
const orderController = {
  getOrder: (req, res, next) => {
    orderServices.getOrder(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  },
  putOrder: (req, res, next) => {
    orderServices.putOrder(req, (err, data) => err ? next(err) : res.json({ status: 'success', data }))
  }
}
module.exports = orderController
