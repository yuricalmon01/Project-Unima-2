const fs = require('fs');

let AppointmentsService = null;
try {
  AppointmentsService = require('../services/appointmentsService');
} catch (e) {
  AppointmentsService = {
    _data: [],
    async getAll() { return this._data; },
    async getById(id) { return this._data.find(x => String(x.id) === String(id)) || null; },
    async create(payload) {
      const id = this._data.length + 1;
      const item = { id, ...payload };
      this._data.push(item);
      return item;
    },
    async update(id, payload) {
      const idx = this._data.findIndex(x => String(x.id) === String(id));
      if (idx === -1) return null;
      this._data[idx] = { ...this._data[idx], ...payload };
      return this._data[idx];
    },
    async remove(id) {
      const idx = this._data.findIndex(x => String(x.id) === String(id));
      if (idx === -1) return false;
      this._data.splice(idx, 1);
      return true;
    }
  };
}

const notificationService = (() => {
  try { return require('../../../notifications/notificationService'); } catch (e) {
    try { return require('../../notifications/notificationService'); } catch (e2) {
      return { send: async () => { console.log('[NOTIFICATION] fallback - nenhuma implementation encontrada'); return true; } };
    }
  }
})();

const { success, error } = (() => {
  try { return require('../utils/response'); } catch (e) {
    return {
      success: (res, data = {}, message = '', status = 200) => res.status(status).json({ success: true, data, message }),
      error: (res, err = 'Erro', status = 400) => res.status(status).json({ success: false, error: err })
    };
  }
})();

const AppointmentsController = {
  async getAll(req, res) {
    try {
      const list = await AppointmentsService.getAll(req.query);
      return success(res, { appointments: list });
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao listar agendamentos', 500);
    }
  },

  async getById(req, res) {
    try {
      const appointment = await AppointmentsService.getById(req.params.id);
      if (!appointment) return error(res, 'Consulta não encontrada', 404);
      return success(res, { appointment });
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao buscar consulta', 500);
    }
  },

  async create(req, res) {
    try {
      const newAppointment = await AppointmentsService.create(req.body);

      try {
        await notificationService.send({
          type: 'appointment.created',
          title: 'Consulta agendada',
          message: `Consulta de ${newAppointment.patientName || req.body.patientName || 'paciente'} para ${newAppointment.date || req.body.date}`,
          payload: { appointmentId: newAppointment.id || null, patientId: newAppointment.patientId || req.body.patientId || null },
        });
      } catch (notifyErr) {
        console.warn('Falha ao enviar notificação (create):', notifyErr && notifyErr.message ? notifyErr.message : notifyErr);
      }

      return success(res, { appointment: newAppointment }, 'Consulta criada com sucesso', 201);
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao criar consulta', 500);
    }
  },

  async update(req, res) {
    try {
      const updated = await AppointmentsService.update(req.params.id, req.body);
      if (!updated) return error(res, 'Consulta não encontrada', 404);

      try {
        await notificationService.send({
          type: 'appointment.updated',
          title: 'Consulta atualizada',
          message: `Consulta #${updated.id || req.params.id} atualizada.`,
          payload: { appointmentId: updated.id || req.params.id },
        });
      } catch (notifyErr) {
        console.warn('Falha ao enviar notificação (update):', notifyErr && notifyErr.message ? notifyErr.message : notifyErr);
      }

      return success(res, { appointment: updated }, 'Consulta atualizada com sucesso');
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao atualizar consulta', 500);
    }
  },

  async remove(req, res) {
    try {
      const deleted = await AppointmentsService.remove(req.params.id);
      if (!deleted) return error(res, 'Consulta não encontrada', 404);
      return success(res, {}, 'Consulta excluída com sucesso');
    } catch (err) {
      console.error(err);
      return error(res, 'Erro ao excluir consulta', 500);
    }
  }
};

module.exports = AppointmentsController;
