'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TagPost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // TagPost.belongsTo(models.Tag, { foreignKey: "TagId" })
      // TagPost.belongsTo(models.Post, { foreignKey: "PostId" })
    }
  }
  TagPost.init({
    TagId: DataTypes.INTEGER,
    PostId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TagPost',
  });
  return TagPost;
};