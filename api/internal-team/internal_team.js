const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source"); // Import the sequelize instance

class InternalTeam extends Model {}
InternalTeam.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    updatedAt: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    sequelize, // Pass the sequelize instance here
    modelName: "InternalTeam", // Choose the model name
    tableName: "internal_team",
  }
);

module.exports = InternalTeam; // Use module.exports for consistency
