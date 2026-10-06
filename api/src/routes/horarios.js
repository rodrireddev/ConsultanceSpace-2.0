const { Router } = require("express");
const { Op } = require("sequelize");
const { Horario, Cita } = require("../db");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

const DAYS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

// Set horarios del profesional autenticado. Enviar:
//   days = { lunes: ["02:50", "04:50"], martes: [] }
// Solo se modifican los días pasados como keys, y se reemplaza todo el array.
router.post(
  "/horarios",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { days } = req.body;
    const horarios = await Horario.findOne({ where: { profesionalId: req.me.profesional.id } });
    if (!horarios) throw httpError(404, "Horario no encontrado");

    Object.keys(days || {})
      .filter((day) => DAYS.includes(day))
      .forEach((day) => {
        horarios[day] = days[day];
      });
    await horarios.save();
    res.send(horarios);
  })
);

// Devuelve las horas libres de un día (descontando las citas ya tomadas en `date`).
// Cualquier usuario verificado puede consultarlo: así los pacientes reservan.
router.get(
  "/horarios",
  asyncHandler(async (req, res) => {
    const { profesionalId, day, date } = req.query;
    if (!DAYS.includes(day)) throw httpError(400, "Día inválido");

    const horarios = await Horario.findOne({ where: { profesionalId } });
    if (!horarios) throw httpError(404, "Horario no encontrado");

    const citas = await Cita.findAll({
      where: { profesionalId, date: { [Op.like]: `%${date}%` } },
    });
    const free = horarios[day]
      ? horarios[day].filter((hora) => !citas.some((cita) => cita.date.includes(hora)))
      : horarios[day];
    res.send(free);
  })
);

module.exports = router;
