const express = require("express");
const router = express.Router();
const userController = require("./user-controller");
const passport = require("../../config/auth"); // Adjust path if necessary
const REST_API = require("../../util/api-util");
const User = require("./user");
// Define a route for creating a user
router.post("/", userController.createUser);
router.put("/", userController.updateUser);
router.get("/", userController.getUsers);
router.get("/:userId", userController.getUserById);
router.delete("/", userController.deleteUser);

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userController.verifyUser(username, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const obj = {
      token: user.token,
      user_role: user.user_role,
    };
    // Generate a token for the user (use your method to generate a token)
    if (user.user_role === 3) {
      obj.candidate_id = user.user_source_id;
    } else if (user.user_role === 2) {
      obj.client_id = user.user_source_id;
    } else if (user.user_role === 4) {
      // Role 4 (EducationTeam) specific action
      obj.education_team_id = user.user_source_id;
    } else if (user.user_role === 5) {
      // Role 5 (AddressTeam) specific action
      obj.address_team_id = user.user_source_id;
    } else if (user.user_role === 6) {
      // Role 6 (ExperienceTeam) specific action
      obj.experience_team_id = user.user_source_id;
    } else {
      // Default action for undefined roles
      console.log("Undefined role");
    }

    res.json(obj);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Protect routes with Bearer strategy
router.use("/protected", passport.authenticate("bearer", { session: false }));

module.exports = router;
