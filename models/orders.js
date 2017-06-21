/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('orders', {
    Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    AddressId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    CancelReason: {
      type: DataTypes.STRING(160),
      allowNull: true
    },
    CancelTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    CreateTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    DeliveryCharge: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: '0'
    },
    FinishTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    OpenId: {
      type: DataTypes.STRING(28),
      allowNull: true
    },
    State: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: 'orders'
  });
};
