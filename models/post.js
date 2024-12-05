'use strict';

const { Op } = require('sequelize')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsToMany(models.Tag, { through: 'TagPost', foreignKey: 'PostId'})
      Post.belongsTo(models.User, { foreignKey: 'UserId' })
      Post.belongsTo(models.Profile, { foreignKey: 'ProfileId' })
    }

    static async searchCaption({ caption }) {
      try {
        const search = {};
        
        console.log("masuk nih bro");
        
        if (caption) {
          search.caption = {
            [Op.iLike]: `%${caption}%`,
          };
          console.log(caption);
        }
        
        return await Post.findAll({
          where: search
        });

      } catch (error) {
        throw error;
      }
    }
    
  }
  Post.init({
    caption: DataTypes.STRING,
    image: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    ProfileId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};