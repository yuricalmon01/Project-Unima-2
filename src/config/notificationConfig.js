const dotenv = require('dotenv');
dotenv.config();

const emailConfig = {
  transport: process.env.EMAIL_TRANSPORT || 'smtp',
  host: process.env.SMTP_HOST || '',
  port: process.env.SMTP_PORT || '587',
  secure: process.env.SMTP_SECURE || 'false',
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.EMAIL_FROM || 'no-reply@example.com'
};

const smsConfig = {
  provider: process.env.SMS_PROVIDER || '', // 'twilio'
  accountSid: process.env.TWILIO_ACCOUNT_SID || '',
  authToken: process.env.TWILIO_AUTH_TOKEN || '',
  from: process.env.TWILIO_FROM || ''
};

module.exports = { emailConfig, smsConfig };
