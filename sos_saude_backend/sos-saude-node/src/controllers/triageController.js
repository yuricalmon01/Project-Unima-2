// Project-Unima-2/sos-saude-node/src/controllers/triageController.js

const notificationService = require('../../../notifications/notificationService');
const { success, error } = require('../utils/response');
const triageService = require('../services/triageService'); // ajuste se seu service tiver outro nome/path

const TriageController = {
  // exemplo de listar triagens (mantenha suas funções se já existirem)
  async getAll(req, res) {
    try {
      const list = await triageService.getAll(req.query);
      return success(res, { list });
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao listar triagens', 500);
    }
  },

  async getById(req, res) {
    try {
      const triage = await triageService.getById(req.params.id);
      if (!triage) return error(res, 'Triagem não encontrada', 404);
      return success(res, { triage });
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao buscar triagem', 500);
    }
  },

  // função principal: muda status da triagem
  async changeStatus(req, res) {
    try {
      const newStatus = req.body.status;
      const triage = await triageService.changeStatus(req.params.id, newStatus);

      if (!triage) return error(res, 'Triagem não encontrada', 404);

      // Quando virar "em atendimento" disparamos notificação
      if (newStatus === 'em atendimento' || newStatus === 'em_atendimento' || newStatus === 'em_atend') {
        try {
          await notificationService.send({
            type: 'triage.status',
            title: 'Paciente em atendimento',
            message: `Paciente ${triage.patientName || triage.patient_id || 'Paciente'} está em atendimento.`,
            payload: { triageId: triage.id || null, patientId: triage.patient_id || triage.patientId || null, status: newStatus },
          });
        } catch (notifyErr) {
          console.warn('Falha ao enviar notificação (triage.changeStatus):', notifyErr && notifyErr.message ? notifyErr.message : notifyErr);
        }
      }

      return success(res, { triage }, 'Status atualizado com sucesso');
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao mudar status', 500);
    }
  },

  // se tiver outras funções (create, remove) mantenha ou adicione aqui
};

module.exports = TriageController;
