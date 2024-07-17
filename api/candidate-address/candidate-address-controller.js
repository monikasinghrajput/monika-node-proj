const CandidteAddress = require("./candidate-address"); // Ensure the correct path
const REST_API = require("../../util/api-util");
const Candidte = require("../candidate/candidte");

// Define the createCandidate controller function
const createCandidateAddress = async (req, res) => {
  const response = await REST_API._add(req, res, CandidteAddress);
   /* await Candidte.update({persent_completed:30}, {
    where: {
      id: req.body.candidate_id,
    },
  }); */
  res.status(200).json(response);
};

const getCandidteAddressList = async (req, res) => {
  const response = await REST_API._getAll(req, res, CandidteAddress);
  res.status(200).json(response);
};

const getAddressByCandidteId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    CandidteAddress,
    "candidate_id",
    candidateId
  );
  res.status(201).json(response);
};
const updateCandidteAddress = async (req, res) => {
  const response = await REST_API._update(req, res, CandidteAddress);
  res.status(201).json(response);
};

const deleteCandidateAddress = async (req, res) => {
  const response = await REST_API._delete(req, res, CandidteAddress);
  res.status(201).json(response);
};

exports.createCandidateAddress = createCandidateAddress;
exports.getCandidteAddressList = getCandidteAddressList;
exports.getAddressByCandidteId = getAddressByCandidteId;
exports.updateCandidteAddress = updateCandidteAddress;
exports.deleteCandidateAddress = deleteCandidateAddress;
