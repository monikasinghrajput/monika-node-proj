const WorkExperience = require("./work-experience"); // Ensure the correct path
const REST_API = require("../../util/api-util");

// Define the createWorkExperience controller function
const createWorkExperience = async (req, res) => {
  const response = await REST_API._add(req, res, WorkExperience);
  res.status(200).json(response);
};

const getWorkExperienceList = async (req, res) => {
  const response = await REST_API._getAll(req, res, WorkExperience);
  res.status(200).json(response);
};

const getWorkExperienceByCandidateId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    WorkExperience,
    "candidate_id",
    candidateId
  );
  res.status(201).json(response);
};

const updateWorkExperience = async (req, res) => {
  const response = await REST_API._update(req, res, WorkExperience);
  res.status(201).json(response);
};

const deleteWorkExperience = async (req, res) => {
  const response = await REST_API._delete(req, res, WorkExperience);
  res.status(201).json(response);
};

exports.createWorkExperience = createWorkExperience;
exports.getWorkExperienceList = getWorkExperienceList;
exports.getWorkExperienceByCandidateId = getWorkExperienceByCandidateId;
exports.updateWorkExperience = updateWorkExperience;
exports.deleteWorkExperience = deleteWorkExperience;
