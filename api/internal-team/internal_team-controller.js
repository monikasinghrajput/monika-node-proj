const InternalTeam = require("./internal_team"); // Ensure the correct path
const REST_API = require("../../util/api-util");

// Define the createClient controller function
const createInternalTeam = async (req, res) => {
  const response = await REST_API._add(req, res, InternalTeam);
  res.status(200).json(response);
};

const getInternalTeamList = async (req, res) => {
  const response = await REST_API._getAll(req, res, InternalTeam);
  res.status(200).json(response);
};

const getInternalTeamById = async (req, res) => {
  const { internalTeamId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    InternalTeam,
    "id",
    internalTeamId
  );
  res.status(201).json(response);
};
const updateInternalTeam = async (req, res) => {
  const response = await REST_API._update(req, res, InternalTeam);
  res.status(201).json(response);
};

const deleteInternalTeam = async (req, res) => {
  const response = await REST_API._delete(req, res, InternalTeam);
  res.status(201).json(response);
};

exports.createInternalTeam = createInternalTeam;
exports.getInternalTeamList = getInternalTeamList;
exports.getInternalTeamById = getInternalTeamById;
exports.updateInternalTeam = updateInternalTeam;
exports.deleteInternalTeam = deleteInternalTeam;
