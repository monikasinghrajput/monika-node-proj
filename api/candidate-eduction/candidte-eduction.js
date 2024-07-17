const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source"); // Import the sequelize instance

class CandidteEduction extends Model {}
CandidteEduction.init(
  {
    name_of_certificate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    institution_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    institution_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    university_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passing_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    roll_number: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    marks: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    certificate: {
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
    modelName: "CandidteEduction", // Choose the model name
    tableName: "candidate_education",
  }
);

module.exports = CandidteEduction; // Use module.exports for consistency
