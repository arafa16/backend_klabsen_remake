'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class overtime_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      overtime_history.belongsTo(models.user,{
        foreignKey:"user_id"
      });
      overtime_history.belongsTo(models.overtime_task,{
        foreignKey:"overtime_task_id"
      });
    }
  }
  overtime_history.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: DataTypes.INTEGER,
    overtime_task_id: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'overtime_history',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  });
  return overtime_history;
};