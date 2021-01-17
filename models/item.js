//Creating the Item model
module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define("Item", {
    //Item name cannot be null
    item_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Item.associate = function(models) {
    Item.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Item;
};
