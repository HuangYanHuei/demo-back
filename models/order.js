'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Order.belongsTo(models.User, { foreignKey: 'userId' })
      Order.belongsTo(models.Restaurant, { foreignKey: 'restaurantId' })
      Order.belongsTo(models.Address, { foreignKey: 'addressId' })
      Order.hasMany(models.Orderitem, { foreignKey: 'orderId' })
    }
  };
  Order.init({
    status: DataTypes.STRING,
    total: DataTypes.INTEGER,
    shopname: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders',
    underscored: true
  })
  return Order
}
