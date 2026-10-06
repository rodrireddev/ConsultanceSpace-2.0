const { Router } = require("express");
const { randomUUID } = require("crypto");
const config = require("../config");
const {
  conn,
  Paciente,
  Usuario,
  Profesional,
  Stock,
  Horario,
  Pago,
} = require("../db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");
const { formatDate, addDays } = require("../utils/dates");
const { sendMail } = require("../utils/mailer");
const { createPreference } = require("../utils/mercadopago");

const router = Router();

const REQUIRED = ["dni", "name", "lastName", "phone", "birth", "address", "country"];

// Envía el link de pago de la suscripción. Un fallo acá no debe romper el registro.
const sendSubscriptionMail = async ({ email, profesionalId, comprobante }) => {
  try {
    const link = await createPreference({
      accessToken: config.mercadopago.accessToken,
      title: "Suscripción ConsultanceSpace",
      price: config.subscriptionPrice,
      externalReference: comprobante,
      notificationUrl: config.apiUrl && `${config.apiUrl}/mp/webhook`,
      backUrls: {
        success: `${config.clientUrl}/subscription?wallet=${comprobante}&id=${profesionalId}`,
        failure: `${config.clientUrl}/failure`,
        pending: `${config.clientUrl}/pending`,
      },
    });
    await sendMail({
      to: email,
      subject: "Informacion de la suscripcion a ConsultanceSpace",
      text: `Felicidades por comenzar con ConsultanceSpace, actualmente se te ha dado un mes de suscripcion gratuito si quieres agregar un mes mas puedes adquirirlo en el siguiente link  ${link}`,
    });
  } catch (err) {
    console.error("No se pudo enviar el mail de suscripción:", err.message);
  }
};

//ROUTE TO CREATE PATIENTS AND PROFESSIONALS
router.post(
  "/newUser",
  asyncHandler(async (req, res) => {
    const { type, dni, name, lastName, phone, birth, address, country } = req.body;
    // El email es el de la cuenta de Firebase autenticada: nadie puede registrar a otro.
    const { email } = req.auth;

    if (type !== "paciente" && type !== "profesional") {
      throw httpError(400, "Need a type of user");
    }
    const missing = REQUIRED.filter((field) => !req.body[field]);
    if (missing.length) throw httpError(400, `Faltan campos: ${missing.join(", ")}`);

    const base = {
      cedula: dni,
      nombre: String(name).toUpperCase(),
      apellidos: String(lastName).toUpperCase(),
      telefono: phone,
      fecha_de_nacimiento: birth,
      direccion: address,
      pais: country,
      usuarioEmail: email,
    };

    if (type === "paciente") {
      await conn.transaction(async (transaction) => {
        await Usuario.create({ email, tipo_usuario: type }, { transaction });
        await Paciente.create(base, { transaction });
      });
      return res.status(200).send("Registro exitoso");
    }

    const comprobante = randomUUID();
    const profesional = await conn.transaction(async (transaction) => {
      await Usuario.create({ email, tipo_usuario: type }, { transaction });
      const created = await Profesional.create(
        { ...base, subscripcion: formatDate(addDays(new Date(), 30)) },
        { transaction }
      );
      await Horario.create({ profesionalId: created.id }, { transaction });
      await Stock.create({ usuarioEmail: email, itemsName: [], itemsCount: [] }, { transaction });
      await Pago.create(
        { comprobante, completado: false, profesionalId: created.id },
        { transaction }
      );
      return created;
    });

    await sendSubscriptionMail({ email, profesionalId: profesional.id, comprobante });
    return res.status(200).json(profesional);
  })
);

module.exports = router;
