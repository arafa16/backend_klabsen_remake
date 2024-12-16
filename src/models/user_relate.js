'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_relate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user_relate.belongsTo(models.user,{
        as: "user", foreignKey:"user_id"
      });
      user_relate.belongsTo(models.user,{
        as: "user_relates", foreignKey:"user_relate_id"
      });
    }
  }
  user_relate.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: DataTypes.INTEGER,
    user_relate_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user_relate',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  });
  return user_relate;
};