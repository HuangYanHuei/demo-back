'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Productcategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Productcategory.hasMany(models.Product, { foreignKey: 'productcategoryId' }) // 新增這裡
    }
  };
  Productcategory.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Productcategory',
    tableName: 'Productcategories', // 別忘了這行
    underscored: true
  })
  return Productcategory
}
