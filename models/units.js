/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('units', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Name: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    Step: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'units'
  });
};
