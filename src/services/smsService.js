const { smsConfig } = require('../config/notificationConfig');

let client = null;
if (smsConfig.provider === 'twilio' && smsConfig.accountSid && smsConfig.authToken) {
  const twilio = require('twilio');
  client = twilio(smsConfig.accountSid, smsConfig.authToken);
}

async function sendSMS({ to, body, from }) {
  if (client) {
    return client.messages.create({
      body,
      from: from || smsConfig.from,
      to
    });
  } else {
    console.log('[smsService] no SMS provider configured. Mock send to', to, 'body:', body);
    return { sid: 'mock-' + Date.now(), to, body };
  }
}

module.exports = { sendSMS };
