// Project-Unima-2/sos-saude-node/src/controllers/appointmentsController.js

const notificationService = require('../../../notifications/notificationService');
const { success, error } = require('../utils/response');
const AppointmentsService = require("../services/appointmentsService");

const AppointmentsController = {
  async getAll(req, res) {
    try {
      const appointments = await AppointmentsService.getAll(req.query);
      return success(res, { appointments });
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao listar agendamentos", 500);
    }
  },

  async getById(req, res) {
    try {
      const appointment = await AppointmentsService.getById(req.params.id);
      if (!appointment) return error(res, "Consulta não encontrada", 404);
      return success(res, { appointment });
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao buscar consulta", 500);
    }
  },

  async create(req, res) {
    try {
      const newAppointment = await AppointmentsService.create(req.body);

      // Notificação: consulta criada
      try {
        await notificationService.send({
          type: 'appointment.created',
          title: 'Consulta agendada',
          message: `Consulta de ${newAppointment.patientName || req.body.patientName || 'paciente'} para ${newAppointment.date || req.body.date}`,
          payload: { appointmentId: newAppointment.id || null, patientId: newAppointment.patientId || req.body.patientId || null },
        });
      } catch (notifyErr) {
        console.warn('Falha ao enviar notificação (create):', notifyErr.message || notifyErr);
      }

      return success(res, { appointment: newAppointment }, 'Consulta criada com sucesso', 201);
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao criar consulta", 500);
    }
  },

  async update(req, res) {
    try {
      const updated = await AppointmentsService.update(req.params.id, req.body);
      if (!updated) return error(res, "Consulta não encontrada", 404);

      // Notificação: consulta atualizada
      try {
        await notificationService.send({
          type: 'appointment.updated',
          title: 'Consulta atualizada',
          message: `Consulta #${updated.id || req.params.id} atualizada.`,
          payload: { appointmentId: updated.id || req.params.id },
        });
      } catch (notifyErr) {
        console.warn('Falha ao enviar notificação (update):', notifyErr.message || notifyErr);
      }

      return success(res, { appointment: updated }, 'Consulta atualizada com sucesso');
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao atualizar consulta", 500);
    }
  },

  async remove(req, res) {
    try {
      const deleted = await AppointmentsService.remove(req.params.id);
      if (!deleted) return error(res, "Consulta não encontrada", 404);
      return success(res, {}, 'Consulta excluída com sucesso');
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao excluir consulta", 500);
    }
  }
};

module.exports = AppointmentsController;
