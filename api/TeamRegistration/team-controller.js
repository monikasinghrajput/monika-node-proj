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
      role: roleId,
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
      role: roleId,
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

    // Create user and send email in parallel
    const [userResponse] = await Promise.all([
      User.create(userObj),
      sendWelcomeEmail(teamEmail, teamResponse.id, mobile_number),
    ]);

    res.status(200).json(teamResponse);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal server error", isError: "true" });
  }
};

const sendWelcomeEmail = (email, teamId, password) => {
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

module.exports = {
  createTeam,
};
