module.exports = {
  sendEmailNotification: async (to, subject, body) => {
    // Implementar integração com serviço de email (ex: nodemailer, SendGrid)
    console.log(`(notificationService) Enviando email para ${to} — ${subject}`);
    // Simula envio
    return { success: true, method: 'email', to, subject };
  },

  sendSmsNotification: async (to, message) => {
    // Implementar integração com SMS (ex: Twilio)
    console.log(`(notificationService) Enviando SMS para ${to} — ${message}`);
    return { success: true, method: 'sms', to };
  }
};
