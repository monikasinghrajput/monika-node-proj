const Candidte = require("./candidte"); // Ensure the correct path
const CandidateAddress = require("../candidate-address/candidate-address");
const CandidateCIBL = require("../candidate-cibil/candidte-cibil");
const CandidteDocs = require("../candidate-docs/candidte-docs");
const CandidteEduction = require("../candidate-eduction/candidte-eduction");
const CandidteReference = require("../candidate-reference/candidte-reference");
const CandidteVerification = require("../candidate-verification/candidte-verification");
const FathersDocuments = require("../fatherdoc/fathers-documents");
const WorkingExperiance = require("../WorkingExperiance/work-experience");

const REST_API = require("../../util/api-util");
const mailer = require("../../config/mailer");
const User = require("../user/user");

// Define the createCandidate controller function
const createCandidate = async (req, res) => {
  try {
    const candidateEmail = req.body.email_id;
    if (!candidateEmail) {
      return res
        .status(400)
        .json({ msg: "Email ID is required", isError: true });
    }

    if (req.body.id) {
      return res.status(400).json({ msg: "Invalid request", isError: true });
    }

    const candidateList = await Candidte.findAll({
      where: { email_id: candidateEmail },
    });

    if (candidateList.length > 0) {
      return res
        .status(200)
        .json({ msg: "Email already exists", isError: true });
    }

    const userList = await User.findAll({
      where: { email: candidateEmail },
    });

    if (userList.length > 0) {
      return res
        .status(200)
        .json({ msg: "User already exists", isError: true });
    }

    const candidateResponse = await Candidte.create({
      ...req.body,
      persent_completed: 15,
    });
    const userResponse = await User.create({
      username: candidateEmail,
      password: req.body.mobile_no,
      user_role: 3,
      email: candidateEmail,
      user_source_id: candidateResponse.id,
    });

    await CandidteVerification.create({
      status: 0,
      candidate_id: candidateResponse.id,
      created_by: null,
      updated_by: null,
    });

    if (Object.keys(userResponse).length > 0) {
      await Candidte.update(
        { user_id: userResponse.id },
        {
          where: { id: candidateResponse.id },
        }
      );

      const mailOptions = {
        from: "info@vitsinco.com",
        to: candidateEmail,
        subject: "Please fill your Form",
        html: `UserName: ${userResponse.username} <br>
               Password: ${userResponse.password} <br>
               <a href="https://dashboard.vitsinco.com/auth/login?id=${candidateResponse.id}">Login</a>`,
      };

      mailer.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send(error.toString());
        }
        console.log("Message sent: %s", info.messageId);
        res.status(200).send("Email sent successfully");
      });
    }
    res.status(200).json(candidateResponse);
  } catch (error) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCandidteList = async (req, res) => {
  try {
    const response = await Candidte.findAll({
      include: CandidateAddress,
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching candidate list:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCandidteById = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const response = await Candidte.findOne({
      where: { id: candidateId },
      include: [
        CandidateAddress,
        CandidateCIBL,
        CandidteDocs,
        CandidteEduction,
        CandidteReference,
        CandidteVerification,
        FathersDocuments,
        WorkingExperiance,
      ],
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching candidate by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCandidte = async (req, res) => {
  try {
    const response = await REST_API._update(req, res, Candidte);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const response = await REST_API._delete(req, res, Candidte);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createCandidate = createCandidate;
exports.getCandidteList = getCandidteList;
exports.getCandidteById = getCandidteById;
exports.updateCandidte = updateCandidte;
exports.deleteCandidate = deleteCandidate;
