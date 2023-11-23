const { Order, Orderitem, Product } = require('../models')
const orderServices = {
  getOrder: (req, callback) => {
    const { id } = req.params
    Order.findAll({
      where: { userId: id },
      include: [
        {
          model: Orderitem,
          include: [
            { model: Product }
          ]
        }
      ],
      nest: true
    })
      .then(order => {
        return callback(null, {
          orders: order
        })
      })
      .catch(err => callback(err))
  },
  putOrder: async (req, cb) => {
    // 1. 解析前端提供的数据
    const {
      userId,
      addressId,
      restaurantId,
      shopname,
      status,
      total,
      items
    } = req.query
    if (!(userId && addressId && total && status && restaurantId && shopname)) {
      return console.log('訂單資料不齊全')
    }
    // 2. 创建订单
    const order = await Order.create({
      userId: userId,
      restaurantId: restaurantId,
      addressId: addressId,
      shopname: shopname,
      total: total,
      status: JSON.parse(status)
    })

    // 3. 创建订单项
    for (const item of JSON.parse(items)) {
      if (!(item.productId && item.quantity)) {
        return console.log('訂單項不齊全')
      }
      await Orderitem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity
      })
    }
    return cb(null, {
      message: '訂單已創建'
    })
  }
}
module.exports = orderServices
