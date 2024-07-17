const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source"); // Import the sequelize instance

class CandidteCibil extends Model {}
CandidteCibil.init(
  {
    pan_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pan_card: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    candidate_id: {
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
    modelName: "CandidteCibil", // Choose the model name
    tableName: "candidate_cibil",
  }
);

module.exports = CandidteCibil; // Use module.exports for consistency
