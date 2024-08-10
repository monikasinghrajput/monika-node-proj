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
  // ... (existing createTeam function unchanged)
};

const getAllTeams = async (req, res) => {
  try {
    const response = await REST_API._getAll(req, res, Team);
    response.forEach((team) => {
      if (team.process_list) {
        team.process_list = team.process_list.split(",");
      }
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
