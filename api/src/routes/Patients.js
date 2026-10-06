const { Router } = require("express");
const { Paciente, ProfesionalPaciente } = require("../db");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

//filter patients by full name (solo profesionales: así buscan a quién agregar)
router.get(
  "/patients",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const nombre = String(req.query.nombre || "").toUpperCase();
    const patients = await Paciente.findAll();
    res.json(patients.filter((p) => p.fullName.includes(nombre)));
  })
);

//delete mypatients: send idPatients (array). Solo toca los pacientes del profesional autenticado.
router.delete(
  "/del-mypatients",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { idPatients } = req.body;
    if (!Array.isArray(idPatients)) throw httpError(400, "idPatients debe ser un array");

    await ProfesionalPaciente.destroy({
      where: { pacienteId: idPatients, profesionalId: req.me.profesional.id },
    });
    res.sendStatus(200);
  })
);

module.exports = router;
