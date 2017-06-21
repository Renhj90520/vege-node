/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('addresses', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Area: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    City: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    OpenId: {
      type: DataTypes.STRING(28),
      allowNull: true
    },
    Phone: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    Province: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Street: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'addresses'
  });
};
