const { Router } = require("express");
const { Tratamientos, Cita } = require("../db");
const { requireRole } = require("../middleware/auth");
const { loadOwnCita } = require("../utils/access");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

// Los tratamientos cuelgan de una cita: solo el profesional de la cita los crea/modifica.
const loadOwnProfesionalCita = async (me, citaId) => {
  const cita = await loadOwnCita(me, citaId);
  if (!me.profesional || cita.profesionalId !== me.profesional.id) {
    throw httpError(403, "Solo el profesional de la cita puede gestionar tratamientos");
  }
  return cita;
};

//Route for create treatments
router.post(
  "/treatments",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { treatmentName, description, price, payment_method, status, citumId } = req.body;
    await loadOwnProfesionalCita(req.me, citumId);

    const treatment = await Tratamientos.create({
      treatmentName,
      description,
      price,
      payment_method,
      status,
      citumId,
    });
    res.send(treatment ? "Agregado con éxito" : "No se pudo agregar");
  })
);

//Route for get a treatment by citumId (profesional o paciente de esa cita)
router.get(
  "/treatments",
  asyncHandler(async (req, res) => {
    await loadOwnCita(req.me, req.query.citumId);
    const treatment = await Tratamientos.findOne({
      where: { citumId: req.query.citumId },
      include: Cita,
    });
    res.send(treatment ? treatment : "No se encontró registro");
  })
);

//Tratamientos de las citas del profesional autenticado (para sus ganancias)
router.get(
  "/treatmentsAll",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    res.json(
      await Tratamientos.findAll({
        include: {
          model: Cita,
          attributes: ["id", "profesionalId"],
          where: { profesionalId: req.me.profesional.id },
          required: true,
        },
      })
    );
  })
);

//Update status of treatments payment, send: appointment id (citumId) and status
router.put(
  "/treatments",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { citumId, status } = req.body;
    if (!citumId || !status) throw httpError(400, "Faltan citumId o status");
    await loadOwnProfesionalCita(req.me, citumId);
    await Tratamientos.update({ status }, { where: { citumId } });
    res.status(200).json("Actualizado");
  })
);

module.exports = router;
