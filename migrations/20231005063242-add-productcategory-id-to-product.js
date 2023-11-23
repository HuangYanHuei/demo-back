'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Products', 'productcategory_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Productcategories',
        key: 'id'
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Products', 'productcategory_id')
  }
}
