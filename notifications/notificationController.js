const notificationService = require('./notificationService');

exports.sendNotification = async (req, res) => {
  const { type, to, subject, message } = req.body || {};
  try {
    if (!type || !to) return res.status(400).json({ error: 'Parâmetros insuficientes' });

    if (type === 'email') {
      await notificationService.sendEmailNotification(to, subject || '', message || '');
    } else if (type === 'sms') {
      await notificationService.sendSmsNotification(to, message || '');
    } else {
      return res.status(400).json({ error: 'Tipo inválido' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('(notificationController) Erro:', err);
    res.status(500).json({ error: 'Erro ao enviar notificação' });
  }
};
