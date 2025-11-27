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

// notifications/notificationService.js
// Serviço mínimo: grava (se tiver model) e emite (se tiver socket) ou apenas loga.
// Não altera nada no resto do projeto, apenas fornece a função send().

let io = null;
try {
  // tenta pegar um export io se você criar '/sos-saude-node/src/io.js' (opcional)
  io = require('../sos-saude-node/src/io');
} catch (e) {
  io = null;
}

let NotificationModel = null;
try {
  NotificationModel = require('./notificationModel'); // se não existir, ok
} catch (e) {
  NotificationModel = null;
}

async function send({ type, title, message, payload = {} }) {
  try {
    const createdAt = new Date();
    // tenta gravar no modelo (se existir)
    if (NotificationModel && typeof NotificationModel.create === 'function') {
      try {
        await NotificationModel.create({ type, title, message, payload, seen: false, createdAt });
      } catch (err) {
        console.warn('NotificationModel.create falhou:', err.message);
      }
    }

    // Emite via socket.io se existir
    if (io && typeof io.emit === 'function') {
      io.emit('notification', { type, title, message, payload, createdAt });
    } else {
      // fallback: só loga (isso já prova que o fluxo foi chamado)
      console.log('[NOTIFICATION]', { type, title, message, payload, createdAt });
    }

    return true;
  } catch (err) {
    console.error('Erro em notificationService.send:', err);
    return false;
  }
}

module.exports = { send };
