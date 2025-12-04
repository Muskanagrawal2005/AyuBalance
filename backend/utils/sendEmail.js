const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create the Transporter (The Service Provider)
  console.log("DEBUG EMAIL_USER:", process.env.EMAIL_USER); 
  // Don't log the full password, just check if it exists
  console.log("DEBUG EMAIL_PASS exists?", !!process.env.EMAIL_PASS);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // This is NOT your login password, it's an App Password
    },
  });

  // 2. Define the Email
  const mailOptions = {
    from: `"AyurCare Admin" <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html, // We use HTML for nice formatting
  };

  // 3. Send It
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;