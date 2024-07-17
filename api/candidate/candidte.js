const { DataTypes, Model } = require("sequelize");
const sequelize = require("../../config/data-source"); // Import the sequelize instance
const CandidteAddress = require("../candidate-address/candidate-address");
const CandidateCIBL = require("../candidate-cibil/candidte-cibil");
const CandidteDocs = require("../candidate-docs/candidte-docs");
const CandidteEduction = require("../candidate-eduction/candidte-eduction");
const CandidteReference = require("../candidate-reference/candidte-reference");
const CandidteVerification = require("../candidate-verification/candidte-verification");

class Candidte extends Model {}
Candidte.init(
  {
    notify_candidate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    notify_client: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    notify_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    form_field_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    father_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mobile_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applicant_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    client_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    client_process: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    candidate_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    process: {
      type: DataTypes.STRING,
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
    modelName: "Candidte", // Choose the model name
    tableName: "candidate",
  }
);

Candidte.hasMany(CandidteAddress, { foreignKey: 'candidate_id' });
Candidte.hasMany(CandidateCIBL, { foreignKey: 'candidate_id' });
Candidte.hasMany(CandidteDocs, { foreignKey: 'candidate_id' });
Candidte.hasMany(CandidteEduction, { foreignKey: 'candidate_id' });
Candidte.hasMany(CandidteReference, { foreignKey: 'candidate_id' });
Candidte.hasMany(CandidteVerification, { foreignKey: 'candidate_id' });

module.exports = Candidte; // Use module.exports for consistency
