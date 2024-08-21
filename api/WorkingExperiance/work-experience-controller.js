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
    let workExp = req.body;
    let response;
    if (Array.isArray(workExp)) {
      // Bulk create
      const workExpv = workExp.map((workExp) => ({
        ...workExp,
        // address_proof_file: null, // We can't handle multiple file uploads in this setup
      }));
      response = await WorkExperience.bulkCreate(workExpv);
    }
    else{
          response = await WorkExperience.create(workExp);
         
    }
     res.status(201).json(response);

  } catch (error) {
   res.status(500).json({error:error.message});
};
}

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
  

    try {
      let workExp = req.body;
      let response;
      if (Array.isArray(workExp)) {
        // Bulk update
        response = await Promise.all(
          workExp.map(async (edu) => {
            const [updatedRows] = await WorkExperience.update(edu, {
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

        const [updatedRows] = await WorkExperience.update(updateData, {
          where: { candidate_id, id },
        });

        response = { id, updated: updatedRows > 0 };
      }
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
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
