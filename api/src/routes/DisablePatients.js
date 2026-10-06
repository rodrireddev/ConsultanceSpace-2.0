const { Router } = require("express");
const { ProfesionalPaciente } = require("../db");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

// Cambia el estado disable de los pacientes del profesional autenticado (por defecto false)
// Enviar: pacienteIds(array[int]), disable(bool)
router.post(
  "/disablePatients",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { pacienteIds, disable } = req.body;
    if (!Array.isArray(pacienteIds)) throw httpError(400, "pacienteIds debe ser un array");

    await ProfesionalPaciente.update(
      { disable },
      { where: { profesionalId: req.me.profesional.id, pacienteId: pacienteIds } }
    );
    res.send("Disable cambiado");
  })
);

module.exports = router;
