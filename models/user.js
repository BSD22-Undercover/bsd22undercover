'use strict';
const bcrypt = require('bcryptjs')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Profile, { foreignKey: 'UserId' })
      User.hasMany(models.Post, { foreignKey: 'UserId' })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: `Email is not available`
      },
      validate: {
        isEmail: {
          args: false,
          msg: `Wrong email format.`
        },
        isCreated(value) {
          if (value !== this.email) {
            throw new Error(`Email not registered`)
          }
        }
      }
      
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'User',
  });

  User.beforeCreate((user) => {
    const hashPassword = bcrypt.hashSync(user.password, 10)
    user.password = hashPassword
  })
  return User;
};