const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "restaurantapp.in",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "info@restaurantapp.in",
    pass: "bgVerification!@#45",
  },
  tls: {
    rejectUnauthorized: false  // Allow self-signed certificates
  }
});
module.exports = transporter;