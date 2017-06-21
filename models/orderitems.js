/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orderitems', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Count: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    OrderId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'orders',
        key: 'Id'
      }
    },
    Price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    ProductId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'orderitems'
  });
};
