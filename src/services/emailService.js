const nodemailer = require('nodemailer');
const { emailConfig } = require('../config/notificationConfig');

// cria transporte SMTP por padrão
function createTransport() {
  if (!emailConfig.transport || emailConfig.transport === 'smtp') {
    return nodemailer.createTransport({
      host: emailConfig.host,
      port: Number(emailConfig.port) || 587,
      secure: emailConfig.secure === 'true',
      auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
      }
    });
  }
  throw new Error('Unsupported email transport: ' + emailConfig.transport);
}

const transport = createTransport();

async function sendEmail({ to, subject, text, html, from }) {
  const msg = {
    from: from || emailConfig.from,
    to,
    subject,
    text,
    html
  };
  const result = await transport.sendMail(msg);
  return result;
}

module.exports = { sendEmail };
