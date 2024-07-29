const WorkExperience = require("./work-experience"); // Ensure the correct path
const REST_API = require("../../util/api-util");
const Candidte = require("../candidate/candidte");

// Define the createWorkExperience controller function
// const createWorkExperience = async (req, res) => {
//   let response = await WorkExperience.bulkCreate(req.body);
//   res.status(200).json(response);
// };

const createWorkExperience = async (req, res) => {
  try {
    let response = await WorkExperience.bulkCreate(req.body);
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating work experiences:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating work experiences." });
  }
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
  let response;
  for (let experence of req.body) {
    response = await WorkExperience.update(experence, {
      where: {
        candidate_id: experence.candidate_id,
        id: experence.id,
      },
    });
  }
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
