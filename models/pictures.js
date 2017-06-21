/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pictures', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Path: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    ProductId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'products',
        key: 'Id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'pictures'
  });
};
