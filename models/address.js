'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Address.belongsTo(models.User, { foreignKey: 'userId' })
      Address.hasMany(models.Order, { foreignKey: 'addressId' })
    }
  };
  Address.init({
    city: DataTypes.STRING,
    detail: DataTypes.STRING,
    receiver: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Address',
    tableName: 'Addresses',
    underscored: true
  })
  return Address
}
