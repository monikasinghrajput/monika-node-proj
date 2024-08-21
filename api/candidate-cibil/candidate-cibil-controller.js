const CandidteCibil = require("./candidte-cibil"); // Ensure the correct path
const REST_API = require("../../util/api-util");

// Define the createCandidate controller function
const createCandidateCibil = async (req, res) => {
  const response = await REST_API._add(req, res, CandidteCibil);
  res.status(200).json(response);
};

const getCandidteListCibil = async (req, res) => {
  const response = await REST_API._getAll(req, res, CandidteCibil);
  res.status(200).json(response);
};

const getCibilByCandidteId = async (req, res) => {
  const { candidateId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    CandidteCibil,
    "candidate_id",
    candidateId
  );
  res.status(201).json(response);
};
const updateCandidteCibil = async (req, res) => {
  // const response = await REST_API._update(req, res, CandidteCibil);
  // res.status(201).json(response);

  let response;
  const { candidate_id, id, ...updateData } = req.body;

  console.log("updateData");
  const existEdu = await CandidteCibil.findOne({
    where: { candidate_id, id },
  });
  console.log(existEdu, "data");

  if (!existEdu) {
    return res.status(404).json({ error: "Education not found" });
  }

  const [updatedRows] = await CandidteCibil.update(updateData, {
    where: { candidate_id, id },
  });
  console.log(id);
  response = { id, updated: updatedRows > 0 };
  res.status(200).json(response);

};

const deleteCandidateCibil = async (req, res) => {
  const response = await REST_API._delete(req, res, CandidteCibil);
  res.status(201).json(response);
};

exports.createCandidateCibil = createCandidateCibil;
exports.getCandidteListCibil = getCandidteListCibil;
exports.getCibilByCandidteId = getCibilByCandidteId;
exports.updateCandidteCibil = updateCandidteCibil;
exports.deleteCandidateCibil = deleteCandidateCibil;
