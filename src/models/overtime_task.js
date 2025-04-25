'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class overtime_task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      overtime_task.belongsTo(models.overtime_task_status,{
        foreignKey:"overtime_task_status_id"
      });
      overtime_task.belongsTo(models.user,{
        foreignKey:"user_id"
      });
      overtime_task.belongsTo(models.user, {
        as: 'assignor', foreignKey: 'assignor_id'
      });
      overtime_task.belongsTo(models.user, {
        as: 'superior', foreignKey: 'superior_id'
      });
      overtime_task.hasOne(models.overtime_report);
      overtime_task.hasMany(models.overtime_history);
    }
  }
  overtime_task.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    assignor_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    number: DataTypes.STRING,
    time_start: DataTypes.DATE,
    time_finised: DataTypes.DATE,
    note: DataTypes.TEXT,
    superior_id: DataTypes.INTEGER,
    overtime_task_status_id: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'overtime_task',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  });
  return overtime_task;
};