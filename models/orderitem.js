'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Orderitem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Orderitem.belongsTo(models.Product, { foreignKey: 'productId' })
      Orderitem.belongsTo(models.Order, { foreignKey: 'orderId' })
    }
  };
  Orderitem.init({
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Orderitem',
    tableName: 'Orderitems',
    underscored: true
  })
  return Orderitem
}
