'use strict'
const faker = require('faker')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 以下三行，查詢現在 Categories 的 id 有哪些
    const restaurants = await queryInterface.sequelize.query(
      'SELECT id FROM Restaurants;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    const productcategories = await queryInterface.sequelize.query(
      'SELECT id FROM Productcategories;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Products',
      Array.from({ length: 100 }, () => ({
        name: faker.name.findName(),
        image: `https://loremflickr.com/320/240/food,restaurant/?random=${Math.random() * 100}`,
        price: faker.datatype.number({ min: 20, max: 300 }),
        description: faker.lorem.text(),
        created_at: new Date(),
        updated_at: new Date(),
        restaurant_id: restaurants[Math.floor(Math.random() * restaurants.length)].id,
        productcategory_id: productcategories[Math.floor(Math.random() * productcategories.length)].id
      }))
    )
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Products', null, {})
  }
}
