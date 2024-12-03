'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const posts = JSON.parse(await fs.readFile('./data/posts.json', 'utf-8'))
    const result = posts.map(post => {

      post.createdAt = post.updatedAt = new Date()
      return post
    })
    await queryInterface.bulkInsert('Posts', result)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Posts', null)
  }
};
