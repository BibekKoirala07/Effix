const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_SENDING_EMAIL_FROM,
    pass: process.env.NODEMAILER_SENDING_EMAIL_APPPASSWORD,
  },
});

const sendEmail = async (emailData) => {
  const mailOptions = {
    from: "www.culturalarcher2058@gmail.com", // Sender address
    to: emailData.to, // Recipient address
    subject: emailData.subject, // Subject line
    html: emailData.html, // Email content in HTML format
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
