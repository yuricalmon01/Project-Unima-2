const AppointmentsService = require("../services/appointmentsService");

const AppointmentsController = {
  async getAll(req, res) {
    try {
      const appointments = await AppointmentsService.getAll(req.query);
      res.json(appointments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar agendamentos" });
    }
  },

  async getById(req, res) {
    try {
      const appointment = await AppointmentsService.getById(req.params.id);
      if (!appointment) return res.status(404).json({ error: "Consulta não encontrada" });
      res.json(appointment);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar consulta" });
    }
  },

  async create(req, res) {
    try {
      const newAppointment = await AppointmentsService.create(req.body);
      res.status(201).json(newAppointment);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar consulta" });
    }
  },

  async update(req, res) {
    try {
      const updated = await AppointmentsService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Consulta não encontrada" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar consulta" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await AppointmentsService.remove(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Consulta não encontrada" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir consulta" });
    }
  }
};

module.exports = AppointmentsController;