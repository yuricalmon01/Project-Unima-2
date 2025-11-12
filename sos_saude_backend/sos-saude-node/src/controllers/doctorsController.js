const DoctorsService = require("../services/doctorsService");

const DoctorsController = {
  async getAll(req, res) {
    try {
      const doctors = await DoctorsService.getAll();
      res.json(doctors);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar médicos" });
    }
  },

  async getById(req, res) {
    try {
      const doctor = await DoctorsService.getById(req.params.id);
      if (!doctor) return res.status(404).json({ error: "Médico não encontrado" });
      res.json(doctor);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar médico" });
    }
  },

  async create(req, res) {
    try {
      const newDoctor = await DoctorsService.create(req.body);
      res.status(201).json(newDoctor);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao cadastrar médico" });
    }
  },

  async update(req, res) {
    try {
      const updated = await DoctorsService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Médico não encontrado" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar médico" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await DoctorsService.remove(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Médico não encontrado" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir médico" });
    }
  },

  async getStats(req, res) {
    try {
      const stats = await DoctorsService.getStats(req.params.id);
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar estatísticas do médico" });
    }
  }
};

module.exports = DoctorsController;