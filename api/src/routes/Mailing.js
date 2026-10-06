const { Router } = require("express");
const { fn, col, where } = require("sequelize");
const { Paciente, Usuario } = require("../db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { sendMail } = require("../utils/mailer");

const router = Router();

// Solo se puede escribir a usuarios registrados (evita usar la API como relay de spam).
// `tipos` limita a qué tipo de usuario se puede escribir.
const findRecipient = async (email, tipos) => {
  const usuario =
    email &&
    (await Usuario.findOne({ where: where(fn("lower", col("email")), String(email).toLowerCase()) }));
  if (!usuario || !tipos.includes(usuario.tipo_usuario)) {
    throw httpError(404, "Destinatario no encontrado");
  }
  return usuario.email;
};

// El remitente es siempre el usuario autenticado: va como Reply-To.
const deliver = (req, to, subject, text) =>
  sendMail({ to, subject, text, replyTo: req.me.email });

//ruta para envio de mails entre paciente y profesional
router.post(
  "/sendEmail",
  asyncHandler(async (req, res) => {
    const { paciente, profesional, idPatient, professional, subject, text } = req.body;
    let to;

    if (paciente) {
      if (req.me.tipo_usuario !== "paciente") throw httpError(403, "Solo para pacientes");
      to = await findRecipient(professional, ["profesional"]);
    } else if (profesional) {
      if (req.me.tipo_usuario !== "profesional") throw httpError(403, "Solo para profesionales");
      let patientEmail = req.body.patient;
      if (idPatient) {
        const found = await Paciente.findByPk(idPatient);
        if (!found) throw httpError(404, "Paciente no encontrado");
        patientEmail = found.usuarioEmail;
      }
      to = await findRecipient(patientEmail, ["paciente"]);
    } else {
      throw httpError(400, "Se requiere paciente o profesional");
    }

    await deliver(req, to, subject, text);
    res.status(200).json(req.body);
  })
);

router.post(
  "/contactEmail",
  asyncHandler(async (req, res) => {
    const { emailProfesional, subject, text, isPatient, isProfessional } = req.body;
    if (!isPatient && !isProfessional) {
      throw httpError(400, "Se requiere isPatient o isProfessional");
    }
    // Paciente -> profesional; profesional -> profesional.
    const to = await findRecipient(emailProfesional, ["profesional"]);
    await deliver(req, to, subject, text);
    res.status(200).json(req.body);
  })
);

module.exports = router;
