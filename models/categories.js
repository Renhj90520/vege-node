/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('categories', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    IconPath: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    Name: {
      type: DataTypes.STRING(10),
      allowNull: true
    }
  }, {
    timestamps: false,
    tableName: 'categories'
  });
};
