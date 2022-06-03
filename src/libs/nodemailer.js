const nodemailer = require('nodemailer');

const {
  config: { Mail },
} = require('../app/config/config');

async function sendEmail(email, subject, text, html) {
  const transporter = nodemailer.createTransport({
    host: Mail.host,
    port: Mail.port,
    secure: false,
    auth: {
      user: Mail.user,
      pass: Mail.password,
    },
    tls: {
      tls: {
        ciphers: 'SSLv3',
      },
    },
  });

  await transporter.sendMail({
    from: Mail.user,
    to: email,
    subject: subject,
    text: text,
    html: html,
  });

  return 'e-mail sended';
}

module.exports = sendEmail;
