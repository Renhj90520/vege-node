/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('products', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    CategoryId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    Description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    State: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '1'
    },
    Step: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    TotalCount: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    UnitId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    UnitName: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'products'
  });
};
