const Team = require("./team");
const REST_API = require("../../util/api-util");
const mailer = require("../../config/mailer");
const User = require("../user/user");

const roles = {
  2: "ClientTeam",
  3: "CandidateTeam",
  4: "EducationTeam",
  5: "AddressTeam",
  6: "ExperienceTeam",
};

const getRoleName = (roleId) => {
  const userRole = Number(roleId);
  return !isNaN(userRole)
    ? roles[userRole] || `Role${userRole}`
    : "Undefined Role";
};

const createTeam = async (req, res) => {
  try {
    const {
      email_id: teamEmail,
      user_role,
      role,
      mobile_number,
      token,
      process_list,
    } = req.body;

    // Use user_role if available, otherwise use role
    const roleId = user_role || role;

    if (!teamEmail) {
      return res
        .status(400)
        .json({ msg: "Email is required", isError: "true" });
    }

    if (!roleId) {
      return res
        .status(400)
        .json({ msg: "User role is required", isError: "true" });
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

    const roleName = getRoleName(roleId);

    // Create user and send email in parallel
    const [userResponse] = await Promise.all([
      User.create(userObj),
      sendWelcomeEmail(teamEmail, teamResponse.id, mobile_number, roleName),
    ]);

    // Add role information to the response
    const responseWithRole = {
      ...teamResponse.toJSON(),
      role: roleName,
      user_role: roleId,
    };

    res.status(200).json(responseWithRole);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

const sendWelcomeEmail = (email, teamId, password, roleName) => {
  // This function remains unchanged
};

const getAllTeams = async (req, res) => {
  try {
    const response = await REST_API._getAll(req, res, Team);
    const teamsWithRoles = response.map((team) => {
      const teamData = team.toJSON ? team.toJSON() : team;
      if (teamData.process_list) {
        teamData.process_list = teamData.process_list.split(",");
      }
      teamData.role = getRoleName(teamData.user_role);
      return teamData;
    });
    res.status(200).json(teamsWithRoles);
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
    const teamData = response.toJSON ? response.toJSON() : response;
    if (teamData.process_list) {
      teamData.process_list = teamData.process_list.split(",");
    }
    teamData.role = getRoleName(teamData.user_role);
    res.status(200).json(teamData);
  } catch (error) {
    console.error("Error fetching team:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

const updateTeam = async (req, res) => {
  try {
    const { id, user_role, role, process_list } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ msg: "Team ID is required", isError: "true" });
    }

    // Use user_role if available, otherwise use role
    const roleId = user_role || role;

    const updateData = { ...req.body };
    if (roleId) {
      updateData.user_role = roleId;
    }

    if (process_list && Array.isArray(process_list)) {
      updateData.process_list = process_list.join(",");
    }

    const team = await Team.findByPk(id);
    if (!team) {
      return res.status(404).json({ msg: "Team not found", isError: "true" });
    }

    const updatedTeam = await team.update(updateData);
    const teamData = updatedTeam.toJSON();

    if (teamData.process_list) {
      teamData.process_list = teamData.process_list.split(",");
    }
    teamData.role = getRoleName(teamData.user_role);

    res.status(200).json(teamData);
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

const deleteTeam = async (req, res) => {
  // This function remains unchanged
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  deleteTeam,
};
