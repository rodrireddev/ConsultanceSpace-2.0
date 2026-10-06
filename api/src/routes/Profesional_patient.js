const { Router } = require("express");
const { Profesional, Paciente, Horario } = require("../db");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = Router();

// Profesionales de un paciente. Un paciente solo puede consultar los suyos.
router.get(
  "/relation",
  requireRole("paciente"),
  asyncHandler(async (req, res) => {
    const relation = await Paciente.findOne({
      where: { id: req.me.paciente.id },
      include: { model: Profesional, include: Horario },
    });
    res.send(relation ? relation : "no encontrado");
  })
);

module.exports = router;
