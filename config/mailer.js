const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "live.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "api",
    pass: "f9f05dca0e3c3c1918179103fc71b7c1"
  }
});
module.exports = transporter;