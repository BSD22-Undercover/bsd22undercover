'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    get usernameWithRole() {
      return `${this.username} ${this.role}`
    }
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User, { foreignKey: 'UserId' })
      Profile.hasMany(models.Post, { foreignKey: 'ProfileId' })
    }

    static async notificationBar(userId) {
      try {
        const result = await Profile.findByPk(userId)
                
        return result.username
      } catch (error) {
        throw error
      }
    }


  }
  Profile.init({
    username: DataTypes.STRING,
    bio: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    profilePicture: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};