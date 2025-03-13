'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class overtime_report extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  overtime_report.init({
    uuid: DataTypes.STRING,
    overtime_task_id: DataTypes.INTEGER,
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
    modelName: 'overtime_report',
    underscored: true,
  });
  return overtime_report;
};