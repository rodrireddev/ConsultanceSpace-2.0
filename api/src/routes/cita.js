const { Router } = require("express");
const { Cita, Paciente, Profesional, Tratamientos } = require("../db");
const { loadOwnCita, sameId } = require("../utils/access");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

// Usar de la siguiente manera
// Post => mandar date, profesionalId y pacienteId (y note opcional)
// Post(get) => enviar get(true) + profesionalId o pacienteId y trae array
// Delete => enviar Id de la cita
// Put => enviar id y parametro a modificar (pueden ser varios)
// Solo participan de una cita su profesional y su paciente.

router.post(
  "/cita",
  asyncHandler(async (req, res) => {
    const { profesionalId, pacienteId, date, get, note } = req.body;
    const { me } = req;
    const isOwnProfesional = me.profesional && sameId(profesionalId, me.profesional.id);
    const isOwnPaciente = me.paciente && sameId(pacienteId, me.paciente.id);

    if (get) {
      if (profesionalId) {
        if (!isOwnProfesional) throw httpError(403, "No tenés acceso a las citas de otro profesional");
        const citas = await Cita.findAll({
          where: { profesionalId },
          include: [Tratamientos, Paciente],
        });
        return res.status(200).send(
          citas.map(({ dataValues: { paciente, ...cita } }) => ({
            ...cita,
            pacienteFullName: paciente && paciente.fullName,
          }))
        );
      }
      if (pacienteId) {
        if (!isOwnPaciente) throw httpError(403, "No tenés acceso a las citas de otro paciente");
        const citas = await Cita.findAll({
          where: { pacienteId },
          include: [Tratamientos, Profesional],
        });
        return res.status(200).send(
          citas.map(({ dataValues: { profesional, ...cita } }) => ({
            ...cita,
            profesionalFullName: profesional && profesional.fullName,
          }))
        );
      }
      throw httpError(400, "Se requiere profesionalId o pacienteId");
    }

    if (!date || !profesionalId || !pacienteId) {
      throw httpError(400, "Se requieren date, profesionalId y pacienteId");
    }
    // Una cita la crea su propio paciente o su propio profesional.
    if (!isOwnProfesional && !isOwnPaciente) {
      throw httpError(403, "No podés crear citas a nombre de otros");
    }
    const newAppointment = await Cita.create({ date, note, profesionalId, pacienteId });
    return res.status(200).send(newAppointment);
  })
);

router.delete(
  "/cita",
  asyncHandler(async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(200).send("id incorrecto");
    const cita = await loadOwnCita(req.me, id);
    await cita.destroy();
    return res.status(200).send("cita eliminada");
  })
);

router.put(
  "/cita",
  asyncHandler(async (req, res) => {
    const { id, status, date, note } = req.body;
    if (!id) return res.status(200).send("id incorrecto");
    const cita = await loadOwnCita(req.me, id, { include: Tratamientos });

    if (status) cita.status = status;
    if (date) cita.date = date;
    if (note) cita.note = note;
    await cita.save();

    const pac = await Paciente.findByPk(cita.pacienteId);
    return res
      .status(200)
      .send({ ...cita.dataValues, pacienteFullName: pac && pac.fullName });
  })
);

module.exports = router;
