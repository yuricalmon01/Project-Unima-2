// Project-Unima-2/sos-saude-node/src/controllers/passwordController.js

const notificationService = require('../../../notifications/notificationService');
const { success, error } = require('../utils/response');
const authService = require('../services/authService'); // ajuste se seu service tiver outro nome/path

const PasswordController = {
  async requestRecovery(req, res) {
    try {
      const { email } = req.body;
      if (!email) return error(res, 'Email é obrigatório', 400);

      // supondo que authService.generateRecovery exista e gere token + envie email
      const result = await authService.generateRecovery(email);

      // registra notificação (log/emit) para demonstrar o fluxo
      try {
        await notificationService.send({
          type: 'password.recovery_requested',
          title: 'Recuperação de senha',
          message: `Solicitação de recuperação de senha para ${email}`,
          payload: { email },
        });
      } catch (notifyErr) {
        console.warn('Falha ao enviar notificação (password.requestRecovery):', notifyErr && notifyErr.message ? notifyErr.message : notifyErr);
      }

      return success(res, {}, 'Email de recuperação enviado, verifique sua caixa');
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao solicitar recuperação de senha', 500);
    }
  },

  // se você tiver rota para confirmar token/alterar senha, pode notificar também:
  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      const updated = await authService.resetPassword(token, newPassword);
      if (!updated) return error(res, 'Token inválido ou expirado', 400);

      try {
        await notificationService.send({
          type: 'password.recovered',
          title: 'Senha alterada',
          message: `Senha alterada para usuário ${updated.email || updated.userId || '---'}`,
          payload: { userId: updated.userId || null, email: updated.email || null },
        });
      } catch (notifyErr) {
        console.warn('Falha ao enviar notificação (password.resetPassword):', notifyErr && notifyErr.message ? notifyErr.message : notifyErr);
      }

      return success(res, {}, 'Senha alterada com sucesso');
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao resetar senha', 500);
    }
  },
};

module.exports = PasswordController;
