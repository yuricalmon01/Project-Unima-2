const nodemailer = require('nodemailer');

class NotificationService {
  constructor() {
    this.transporter = null;

    if (process.env.SMTP_HOST) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    }
  }

  async send(user, type, data = {}) {
    console.log('[NOTIFICATION]', type, user?.email, data);

    if (!this.transporter) {
      return { ok: true, mode: 'console' };
    }

    return this.transporter.sendMail({
      from: 'no-reply@unima.com',
      to: user.email,
      subject: this._subject(type),
      html: this._html(type, data)
    });
  }

  _subject(type) {
    const subjects = {
      appointment_created: 'Consulta criada!',
      appointment_updated: 'Consulta atualizada',
      triage_status_changed: 'Atualização na triagem',
      password_recovery: 'Recuperação de senha'
    };

    return subjects[type] || 'Notificação';
  }

  _html(type, data) {
    if (type === 'appointment_created') {
      return `
        <h3>Sua consulta foi criada!</h3>
        <p>Data: ${data.date}</p>
        <p>Médico: ${data.doctor}</p>
      `;
    }

    if (type === 'appointment_updated') {
      return `
        <h3>Sua consulta foi atualizada.</h3>
        <p>Novo horário: ${data.date}</p>
      `;
    }

    if (type === 'triage_status_changed') {
      return `
        <h3>Status atualizado!</h3>
        <p>Seu status agora é: <strong>${data.newStatus}</strong></p>
      `;
    }

    if (type === 'password_recovery') {
      return `
        <h3>Recuperação de senha</h3>
        <p>Seu código: <strong>${data.code}</strong></p>
      `;
    }

    return `<p>Você recebeu uma nova notificação.</p>`;
  }
}

module.exports = NotificationService;
