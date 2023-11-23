'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM Users;',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    )
    await queryInterface.bulkInsert('Addresses',
      Array.from({ length: 40 }, () => ({
        city: faker.address.city(),
        detail: faker.address.streetAddress(),
        receiver: faker.name.findName(),
        phone: faker.phone.phoneNumber(),
        user_id: users[Math.floor(Math.random() * users.length)].id,
        created_at: faker.date.recent(),
        updated_at: faker.date.recent()
      })))
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Addresses', null, {})
  }
}
