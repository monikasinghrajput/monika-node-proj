const Team = require("./team"); // Ensure the correct path
const REST_API = require("../../util/api-util");

// Define the createTeam controller function
const createTeam = async (req, res) => {
  const response = await REST_API._add(req, res, Team);
  res.status(200).json(response);
};

// Define the getTeamList controller function
const getTeamList = async (req, res) => {
  const response = await REST_API._getAll(req, res, Team);
  res.status(200).json(response);
};

// Define the getTeamById controller function
const getTeamById = async (req, res) => {
  const { id } = req.params;
  const response = await REST_API._getDataListById(req, res, Team, "id", id);
  res.status(200).json(response);
};

// Define the updateTeam controller function
const updateTeam = async (req, res) => {
  const response = await REST_API._update(req, res, Team);
  res.status(200).json(response);
};

// Define the deleteTeam controller function
const deleteTeam = async (req, res) => {
  const { id } = req.params;
  const response = await REST_API._delete(req, res, Team, id);
  res.status(200).json(response);
};

module.exports = {
  createTeam,
  getTeamList,
  getTeamById,
  updateTeam,
  deleteTeam,
};
