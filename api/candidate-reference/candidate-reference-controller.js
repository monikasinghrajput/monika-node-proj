const CandidteReference = require("./candidte-reference"); // Ensure the correct path
const REST_API = require("../../util/api-util");

// Define the createCandidate controller function
const createCandidateReference = async (req, res) => {
  const response = await REST_API._add(req, res, CandidteReference);
  res.status(200).json(response);
};

const getCandidteListReference = async (req, res) => {
  const response = await REST_API._getAll(req, res, CandidteReference);
  res.status(200).json(response);
};

const getReferenceByCandidteId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    CandidteReference,
    "candidate_id",
    candidateId
  );
  res.status(201).json(response);
};
const updateCandidteReference = async (req, res) => {
  const response = await REST_API._update(req, res, CandidteReference);
  res.status(201).json(response);
};

const deleteCandidateReference = async (req, res) => {
  const response = await REST_API._delete(req, res, CandidteReference);
  res.status(201).json(response);
};

exports.createCandidateReference = createCandidateReference;
exports.getCandidteListReference = getCandidteListReference;
exports.getReferenceByCandidteId = getReferenceByCandidteId;
exports.updateCandidteReference = updateCandidteReference;
exports.deleteCandidateReference = deleteCandidateReference;
