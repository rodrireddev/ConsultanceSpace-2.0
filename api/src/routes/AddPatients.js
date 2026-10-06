const { Router } = require("express");
const { Profesional, Paciente } = require("../db");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = Router();

// Siempre opera sobre el profesional autenticado (ignora el `email` que mande el cliente).
const findWithPatients = (profesionalId) =>
  Profesional.findOne({
    attributes: ["id", "usuarioEmail"],
    where: { id: profesionalId },
    include: { model: Paciente },
  });

router.post(
  "/add-patients",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    await req.me.profesional.addPacientes(req.body.idPatients);
    res.send(await findWithPatients(req.me.profesional.id));
  })
);

router.get(
  "/my-patients",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    res.send(await findWithPatients(req.me.profesional.id));
  })
);

module.exports = router;
