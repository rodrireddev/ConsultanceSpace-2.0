const { Router } = require("express");
const config = require("../config");
const { Profesional, Paciente } = require("../db");
const { requireRole } = require("../middleware/auth");
const { profesionalCanAccessPaciente } = require("../utils/access");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { sendMail } = require("../utils/mailer");
const { createPreference } = require("../utils/mercadopago");

const router = Router();

// El profesional autenticado le cobra a uno de sus pacientes con su propia cuenta de Mercado Pago.
router.post(
  "/profesionalpayments",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { idpaciente, price, descripcion, title } = req.body;
    const idprofesional = req.me.profesional.id;

    const paciente = await Paciente.findByPk(idpaciente);
    if (!paciente) throw httpError(404, "Paciente inexistente");
    if (!(await profesionalCanAccessPaciente(idprofesional, paciente.id))) {
      throw httpError(403, "El paciente no está vinculado a este profesional");
    }
    if (!(Number(price) > 0)) throw httpError(400, "Precio inválido");

    // El token de MP no viaja en el scope por defecto: se pide explícitamente.
    const { token } = await Profesional.unscoped().findByPk(idprofesional, {
      attributes: ["token"],
    });
    if (!token) throw httpError(400, "El profesional no vinculó Mercado Pago");

    const query = new URLSearchParams({ idpaciente, idprofesional, price, descripcion });
    const link = await createPreference({
      accessToken: token,
      title,
      price,
      backUrls: {
        success: `${config.clientUrl}/succes?${query}`,
        failure: `${config.clientUrl}/failure`,
        pending: `${config.clientUrl}/pending`,
      },
    });

    await sendMail({
      to: paciente.usuarioEmail,
      replyTo: req.me.email,
      subject: `Tratamiento de parte de: ${req.me.email}`,
      text: `Motivo: ${descripcion}\nLink de pago: ${link}`,
    });
    res.status(200).json(req.body);
  })
);

module.exports = router;
