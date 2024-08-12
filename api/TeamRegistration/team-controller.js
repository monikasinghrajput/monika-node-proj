const Team = require("./team");
const REST_API = require("../../util/api-util");
const mailer = require("../../config/mailer");
const User = require("../user/user");

const roles = {
  4: "EducationTeam",
  5: "AddressTeam",
  6: "ExperienceTeam",
};

const createTeam = async (req, res) => {
  try {
    const {
      email_id: teamEmail,
      user_role: roleId,
      mobile_number,
      token,
      process_list,
    } = req.body;

    if (!teamEmail) {
      return res
        .status(400)
        .json({ msg: "Email is required", isError: "true" });
    }

    // Check if team already exists and create team in parallel
    const [existingTeam, teamResponse] = await Promise.all([
      Team.findOne({ where: { email_id: teamEmail } }),
      REST_API._add(req, res, Team),
    ]);

    if (existingTeam) {
      return res
        .status(400)
        .json({ msg: "Email already exists", isError: "true" });
    }

    // Prepare user object
    const userObj = {
      username: teamEmail,
      password: mobile_number,
      user_role: roleId,
      email: teamEmail,
      user_source_id: teamResponse.id,
    };

    // Add role-specific fields
    if (roleId >= 2 && roleId <= 6) {
      const fieldMap = {
        2: "client_id",
        3: "candidate_id",
        4: "education_team_id",
        5: "address_team_id",
        6: "experience_team_id",
      };
      userObj[fieldMap[roleId]] = teamResponse.id;
    }

    // Get the role name without modifying the user object
    const roleName = roles[roleId] || "";

    // Create user and send email in parallel
    const [userResponse] = await Promise.all([
      User.create(userObj),
      sendWelcomeEmail(teamEmail, teamResponse.id, mobile_number, roleName),
    ]);

    // Add role information to the response
    const responseWithRole = {
      ...teamResponse.toJSON(),
      role: roleName,
    };

    res.status(200).json(responseWithRole);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

const sendWelcomeEmail = (email, teamId, password, roleName) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "info@vitsinco.com",
      to: email,
      subject: "Welcome to Our Service",
      html: `
        <p>Dear ${email},</p>
        <p>Your team has been created successfully.</p>
        <p>Username: ${email}</p>
        <p>Password: ${password}</p>
        <p>Role: ${roleName}</p>
        <p><a href="dashboard.vitsinco.com/auth/login?id=${teamId}">Login</a></p>
      `,
    };

    mailer.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        reject(error);
      } else {
        console.log("Message sent: %s", info.messageId);
        resolve(info);
      }
    });
  });
};

const getAllTeams = async (req, res) => {
  try {
    const response = await REST_API._getAll(req, res, Team);
    response.forEach((team) => {
      if (team.process_list) {
        team.process_list = team.process_list.split(",");
      }
      team.role = roles[team.user_role] || "";
    });
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await REST_API._getDataListById(req, res, Team, "id", id);
    if (!response) {
      return res.status(404).json({ msg: "Team not found", isError: "true" });
    }
    if (response.process_list) {
      response.process_list = response.process_list.split(",");
    }
    response.role = roles[response.user_role] || "";
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ msg: "Team ID is required", isError: "true" });
    }

    if (req.body.process_list && Array.isArray(req.body.process_list)) {
      req.body.process_list = req.body.process_list.join(",");
    }

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ msg: "Team not found", isError: "true" });
    }

    const updatedTeam = await team.update(req.body);

    if (updatedTeam.process_list) {
      updatedTeam.process_list = updatedTeam.process_list.split(",");
    }
    updatedTeam.role = roles[updatedTeam.user_role] || "";

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ msg: "Team ID is required", isError: "true" });
    }

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ msg: "Team not found", isError: "true" });
    }

    await team.destroy();
    res.status(200).json({ msg: "Team deleted successfully" });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
