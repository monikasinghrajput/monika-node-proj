const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "email-smtp.ap-south-1.amazonaws.com",
  port: 465,
  secure: true,
  auth: {
    user: "AKIA5FTZAM6B6BVREUUG",
    pass: "BN9WORax6Pj0VXgtUcwDkmVLgkplDJoUpaquw+RyKzS4",
  },
  tls: {
    rejectUnauthorized: false  // Allow self-signed certificates
  }
});
module.exports = transporter;