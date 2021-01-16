//Creating the Item model
module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define("Recipe", {
    //Item name cannot be null
    recipe_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Recipe.associate = models => {
    Recipe.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Recipe;
};
