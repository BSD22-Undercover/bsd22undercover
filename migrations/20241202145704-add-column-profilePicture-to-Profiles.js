'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Profiles', 'profilePicture', { 
      type: Sequelize.STRING,
      defaultValue: "https://i.pinimg.com/280x280_RS/55/96/4e/55964ebb02710d6b9ce1c26f1d857906.jpg"
    });
    
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Profiles', 'profilePicture');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
