const CandidteEduction = require("./candidte-eduction"); // Ensure the correct path
const REST_API = require("../../util/api-util");
const Candidte = require("../candidate/candidte");

// Define the createCandidate controller function
const createCandidateEduction = async (req, res) => {
  try {
    const canEdu = req.body;
    if (Array.isArray(canEdu)) {
      // Bulk create
      const canEdur = canEdu.map((canEdu) => ({
        ...canEdu,
        // address_proof_file: null, // We can't handle multiple file uploads in this setup
      }));
      console.log("done");
      responses = await CandidteEduction.bulkCreate(canEdur);
      res.status(200).json(responses);
    } 
    else {
      let response = await CandidteEduction.bulkCreate(req.body);
      res.status(200).json(response);
    }

  } catch (error) {
    console.error("Error creating candidate education:", error);
    res.status(500).json({
      message: "An error occurred while creating candidate education.",
    });
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
  try {
    let eduData = req.body;
    let response;

    if (Array.isArray(eduData)) {
      // Bulk update
      response = await Promise.all(
        eduData.map(async (edu) => {
          const [updatedRows] = await CandidteEduction.update(edu, {
            where: {
              candidate_id: edu.candidate_id,
              id: edu.id,
            },
          });
          return { id: edu.id, updated: updatedRows > 0 };
        })
      );
    } else {
      // Single update
      const { candidate_id, id, ...updateData } = eduData;

      const existEdu = await CandidteEduction.findOne({
        where: { candidate_id, id },
      });

      if (!existEdu) {
        return res.status(404).json({ error: "Education not found" });
      }

      //  updateData.address_proof_file = await handleFileUpload(
      //    req,
      //    existEdu.address_proof_file
      //  );

      const [updatedRows] = await CandidteEduction.update(updateData, {
        where: { candidate_id, id },
      });

      response = { id, updated: updatedRows > 0 };
    }
    res.status(200).json(response);
  } catch (error) {}
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
