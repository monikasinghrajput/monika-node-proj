const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source");

class CandidteEduction extends Model {}
CandidteEduction.init(
  {
    education_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    course_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    university_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    passing_year: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    roll_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    gpa_percentage: {
      type: DataTypes.STRING,
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
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    certificate_number: {
      type: DataTypes.STRING,
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
