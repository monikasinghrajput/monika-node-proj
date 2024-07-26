const CandidteAddress = require("./candidate-address"); // Ensure the correct path
const REST_API = require("../../util/api-util");
const Candidte = require("../candidate/candidte");

// Define the createCandidate controller function
const createCandidateAddress = async (req, res) => {
  let response = await CandidteAddress.bulkCreate(req.body);
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
  let response;
  for (let address of req.body) {
    response = await CandidteAddress.update(address, {
      where: {
        candidate_id: address.candidate_id,
        id: address.id,
      },
    });
  }
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
