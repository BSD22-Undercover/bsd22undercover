'use strict';
const fs = require('fs').promises
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = JSON.parse(await fs.readFile('./data/users.json', 'utf-8'))
    const result = users.map(user => {
      delete user.id

      user.createdAt = user.updatedAt = new Date()
      return user
    })
    await queryInterface.bulkInsert('Users', result)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null)
  }
};
