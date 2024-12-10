'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jam_operasional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      jam_operasional.belongsTo(models.jam_operasional_group,{
        foreignKey:"jam_operasional_group_id"
      });
    }
  }
  jam_operasional.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    jam_operasional_group_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    jam_masuk: DataTypes.TIME,
    jam_pulang: DataTypes.TIME,
    keterangan: DataTypes.STRING,
    code: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'jam_operasional',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    underscored: true,
  });
  return jam_operasional;
};