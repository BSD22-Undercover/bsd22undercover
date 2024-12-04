'use strict';
const fs = require('fs').promises
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      const profiles = JSON.parse(await fs.readFile('./data/profile.json', 'utf-8'))
      const result = profiles.map(profile => {
  
        profile.createdAt = profile.updatedAt = new Date()
        return profile
      })
      await queryInterface.bulkInsert('Profiles', result)

  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Profiles', null)
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
