const CandidteEduction = require("./candidte-eduction"); // Ensure the correct path
const REST_API = require("../../util/api-util");
const Candidte = require("../candidate/candidte");

// Define the createCandidate controller function
const createCandidateEduction = async (req, res) => {
  try {
      const canEdu = req.body;
      if (Array.isArray(canEdu)) {
        // Bulk create
        const canEdu = addressData.map((canEdu) => ({
          ...canEdu,
          address_proof_file: null, // We can't handle multiple file uploads in this setup
        }));
        response = await CandidteAddress.bulkCreate(canEdu);
      } else {
        let response = await CandidteEduction.bulkCreate(req.body);
        res.status(200).json(response);
      }
  } catch (error) {
     console.error("Error creating candidate education:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating candidate education." });
  }
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
  let response;

  for (let education of req.body) {
    response = await CandidteEduction.update(education, {
      where: {
        candidate_id: education.candidate_id,
        id: education.id,
      },
    });
  }
  res.status(201).json(response);

  // const response = await REST_API._update(req, res, CandidteEduction);
  // res.status(201).json(response);
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
