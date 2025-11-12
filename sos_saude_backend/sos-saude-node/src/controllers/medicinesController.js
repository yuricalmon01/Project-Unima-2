const MedicalRecordsService = require("../services/medicalRecordsService");

const MedicalRecordsController = {
  async getAll(req, res) {
    try {
      const records = await MedicalRecordsService.getAll();
      res.json(records);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar prontuários" });
    }
  },

  async getById(req, res) {
    try {
      const record = await MedicalRecordsService.getById(req.params.id);
      if (!record) return res.status(404).json({ error: "Prontuário não encontrado" });
      res.json(record);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar prontuário" });
    }
  },

  async getByPatient(req, res) {
    try {
      const records = await MedicalRecordsService.getByPatientId(req.params.id);
      res.json(records);
    } catch (err) {
      res.status(500).json({ error: "Erro ao buscar registros do paciente" });
    }
  },

  async create(req, res) {
    try {
      const newRecord = await MedicalRecordsService.create(req.body);
      res.status(201).json(newRecord);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao criar prontuário" });
    }
  },

  async update(req, res) {
    try {
      const updated = await MedicalRecordsService.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Prontuário não encontrado" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao atualizar prontuário" });
    }
  },

  async remove(req, res) {
    try {
      const deleted = await MedicalRecordsService.remove(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Prontuário não encontrado" });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro ao excluir prontuário" });
    }
  }
};

module.exports = MedicalRecordsController;