const InternalTeam = require("./internal_team");
const User = require("../user/user");
const mailer = require("../../config/mailer");

const createInternalTeam = async (req, res) => {
  try {
    const { email_id, mobile_number, user_role } = req.body;

    // Check if internal team member already exists
    const existingMember = await InternalTeam.findOne({ where: { email_id } });
    if (existingMember) {
      return res.status(200).json({
        msg: "Email already exists",
        isError: true,
      });
    }

    // Create internal team member
    const internalTeamResponse = await InternalTeam.create(req.body);

    // Create user
    const userResponse = await User.create({
      username: email_id,
      password: mobile_number, // Consider hashing this password
      user_role,
      email: email_id,
      user_source_id: internalTeamResponse.id,
    });

    // Prepare and send email
    await sendWelcomeEmail(
      email_id,
      userResponse.username,
      userResponse.password,
      user_role,
      internalTeamResponse.id
    );

    return res.status(200).json({
      msg: "Internal team member created successfully",
      data: internalTeamResponse,
      isError: false,
    });
  } catch (error) {
    console.error("Error in createInternalTeam:", error);
    return res.status(500).json({
      message: "Error creating internal team member",
      error: error.message,
      isError: true,
    });
  }
};

const getInternalTeamList = async (req, res) => {
  try {
    const response = await InternalTeam.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.error("Error in getInternalTeamList:", error);
    res.status(500).json({
      message: "Error fetching internal team list",
      error: error.message,
      isError: true,
    });
  }
};

const getInternalTeamById = async (req, res) => {
  try {
    const { internalTeamId } = req.params;
    const response = await InternalTeam.findByPk(internalTeamId);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(404).json({
        message: "Internal team member not found",
        isError: true,
      });
    }
  } catch (error) {
    console.error("Error in getInternalTeamById:", error);
    res.status(500).json({
      message: "Error fetching internal team member",
      error: error.message,
      isError: true,
    });
  }
};

const updateInternalTeam = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "ID is missing in the request body",
        isError: true,
      });
    }

    const [updated] = await InternalTeam.update(updateData, {
      where: { id: id },
    });

    if (updated) {
      const updatedInternalTeam = await InternalTeam.findByPk(id);
      res.status(200).json(updatedInternalTeam);
    } else {
      res.status(404).json({
        message: "Internal team member not found",
        isError: true,
      });
    }
  } catch (error) {
    console.error("Error in updateInternalTeam:", error);
    res.status(500).json({
      message: "Error updating internal team member",
      error: error.message,
      isError: true,
    });
  }
};
const deleteInternalTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await InternalTeam.destroy({
      where: { id: id },
    });
    if (deleted) {
      res
        .status(200)
        .json({ message: "Internal team member deleted successfully" });
    } else {
      res.status(404).json({
        message: "Internal team member not found",
        isError: true,
      });
    }
  } catch (error) {
    console.error("Error in deleteInternalTeam:", error);
    res.status(500).json({
      message: "Error deleting internal team member",
      error: error.message,
      isError: true,
    });
  }
};

const loginInternalTeam = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const internalTeamMember = await InternalTeam.findOne({
      where: { email_id, mobile_number: password },
    });

    if (!internalTeamMember) {
      return res.status(404).json({
        message: "Invalid credentials or user not found",
        isError: true,
      });
    }

    const roleNumber = getRoleNumber(internalTeamMember.user_role);

    res.status(200).json({
      message: "Login successful",
      isError: false,
      user: {
        id: internalTeamMember.id,
        name: internalTeamMember.name,
        email_id: internalTeamMember.email_id,
        user_role: internalTeamMember.user_role,
        roleNumber,
        client_id: internalTeamMember.client_id,
        candidate_id: internalTeamMember.candidate_id,
      },
    });
  } catch (error) {
    console.error("Error in loginInternalTeam:", error);
    res.status(500).json({
      message: "Error during login",
      error: error.message,
      isError: true,
    });
  }
};

const getRoleNumber = (user_role) => {
  const roleMap = {
    GenInfo: 1,
    EducationInfo: 2,
    AddressInfo: 3,
    CibilInfo: 4,
    ReferenceInfo: 5,
    ExperienceInfo: 6,
  };
  return roleMap[user_role] || 0;
};

const sendWelcomeEmail = async (email, username, password, role, id) => {
  const mailOptions = {
    from: "info@vitsinco.com",
    to: email,
    subject: "Welcome to Internal Team",
    html: `
      <p>Dear ${email},</p>
      <p>Your account has been created successfully as an internal team member.</p>
      <p>Username: ${username}</p>
      <p>Password: ${password}</p>
      <p>Role: ${role}</p>
      <p><a href="https://dashboard.vitsinco.com/auth/login?id=${id}">Login</a></p>
    `,
  };

  try {
    await mailer.sendMail(mailOptions);
    console.log("Message sent");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {
  createInternalTeam,
  getInternalTeamList,
  getInternalTeamById,
  updateInternalTeam,
  deleteInternalTeam,
  loginInternalTeam,
};
