const nodemailer = require("nodemailer");
const config = require("../config");

let transporter;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: config.mail,
    });
  }
  return transporter;
};

const sendMail = ({ to, subject, text, from, replyTo }) =>
  getTransporter().sendMail({
    from: from || `"Consultance Space" <${config.mail.user}>`,
    to,
    replyTo,
    subject,
    text,
  });

module.exports = { sendMail };
