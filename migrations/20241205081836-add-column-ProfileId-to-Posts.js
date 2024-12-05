'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Posts', 'ProfileId', {
      type: Sequelize.INTEGER
    })
  },
  // a

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Posts', 'ProfileId')
  }
};
