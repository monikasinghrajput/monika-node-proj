const CandidteEduction = require("./candidte-eduction"); // Ensure the correct path
const REST_API = require("../../util/api-util");

// Define the createCandidate controller function
const createCandidateEduction = async (req, res) => {
  const response = await REST_API._add(req, res, CandidteEduction);
  res.status(200).json(response);
};

const getCandidteListEduction = async (req, res) => {
  const response = await REST_API._getAll(req, res, CandidteEduction);
  res.status(200).json(response);
};

const getEductionByCandidteId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    CandidteEduction,
    "candidate_id",
    candidateId
  );
  res.status(201).json(response);
};
const updateCandidteEduction = async (req, res) => {
  const response = await REST_API._update(req, res, CandidteEduction);
  res.status(201).json(response);
};

const deleteCandidateEduction = async (req, res) => {
  const response = await REST_API._delete(req, res, CandidteEduction);
  res.status(201).json(response);
};

exports.createCandidateEduction = createCandidateEduction;
exports.getCandidteListEduction = getCandidteListEduction;
exports.getEductionByCandidteId = getEductionByCandidteId;
exports.updateCandidteEduction = updateCandidteEduction;
exports.deleteCandidateEduction = deleteCandidateEduction;
