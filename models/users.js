/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    Password: {
      type: DataTypes.STRING(32),
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
    Sex: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    UserName: {
      type: DataTypes.STRING(20),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'users'
  });
};
