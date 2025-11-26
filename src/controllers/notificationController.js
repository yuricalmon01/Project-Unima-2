const { sendEmail } = require('../services/emailService');
const { sendSMS } = require('../services/smsService');

// POST /notifications/send
// body: { type: 'email'|'sms'|'both', payload: {...} }
async function sendNotification(req, res) {
  try {
    const { type, payload } = req.body;
    if (!type || !payload) return res.status(400).json({ error: 'type and payload required' });

    const results = {};

    if (type === 'email' || type === 'both') {
      if (!payload.to || !payload.subject) {
        return res.status(400).json({ error: 'email payload must include to and subject' });
      }
      results.email = await sendEmail({
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html
      });
    }

    if (type === 'sms' || type === 'both') {
      if (!payload.to || !payload.body) {
        return res.status(400).json({ error: 'sms payload must include to and body' });
      }
      results.sms = await sendSMS({
        to: payload.to,
        body: payload.body
      });
    }

    return res.json({ success: true, results });
  } catch (err) {
    console.error('[notificationController] error', err);
    return res.status(500).json({ error: 'internal' });
  }
}

module.exports = { sendNotification };
