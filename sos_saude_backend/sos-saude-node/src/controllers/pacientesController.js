import { success, error } from "../utils/response.js";
import PacientesService from "../services/pacientesService.js";

const PacientesController = {
  async getAll(req, res) {
    try {
      const { search } = req.query;
      const pacientes = await PacientesService.getAll({ search });
      return success(res, pacientes);
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao listar pacientes", 500);
    }
  },

  async getById(req, res) {
    try {
      const paciente = await PacientesService.getById(req.params.id);
      if (!paciente) return error(res, "Paciente não encontrado", 404);
      return success(res, paciente);
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao buscar paciente", 500);
    }
  },

  async getByUserId(req, res) {
    try {
      const paciente = await PacientesService.getByUserId(req.params.userId);
      if (!paciente) return error(res, "Paciente não encontrado", 404);
      return success(res, paciente);
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao buscar paciente", 500);
    }
  },

  async create(req, res) {
    try {
      const newPaciente = await PacientesService.create(req.body);
      return success(
        res,
        newPaciente,
        "Paciente criado com sucesso",
        201
      );
    } catch (err) {
      console.error(err);
      return error(res, err.message || "Erro ao criar paciente", 500);
    }
  },

  async update(req, res) {
    try {
      const updated = await PacientesService.update(req.params.id, req.body);
      if (!updated) return error(res, "Paciente não encontrado", 404);
      return success(res, {}, "Paciente atualizado com sucesso");
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao atualizar paciente", 500);
    }
  },

  async remove(req, res) {
    try {
      const deleted = await PacientesService.remove(req.params.id);
      if (!deleted) return error(res, "Paciente não encontrado", 404);
      return success(res, {}, "Paciente removido com sucesso");
    } catch (err) {
      console.error(err);
      return error(res, "Erro ao remover paciente", 500);
    }
  },
};

export default PacientesController;
