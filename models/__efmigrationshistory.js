/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('__efmigrationshistory', {
    MigrationId: {
      type: DataTypes.STRING(150),
      allowNull: false,
      primaryKey: true
    },
    ProductVersion: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  }, {
    timestamps: false,
    tableName: '__efmigrationshistory'
  });
};
