const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source"); // Import the sequelize instance

class WorkExperience extends Model {}
WorkExperience.init(
  {
    experience_type: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    companyLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    salarySlip: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    reasonForLeaving: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    relievingLetter: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    experienceLetter: {
      type: DataTypes.BLOB,
      allowNull: true,
    },
    candidateId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updatedBy: {
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
    modelName: "WorkExperience", // Choose the model name
    tableName: "work_experiences",
  }
);

module.exports = WorkExperience; // Use module.exports for consistency
