const { Router } = require("express");
const { randomUUID } = require("crypto");
const config = require("../config");
const { Pago } = require("../db");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { createPreference } = require("../utils/mercadopago");

const router = Router();

// Crea el cobro de la suscripción del profesional autenticado y devuelve el link de Mercado Pago.
router.post(
  "/checkout",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const profesionalId = req.me.profesional.id;
    const comprobante = randomUUID();
    await Pago.create({ comprobante, completado: false, profesionalId });

    const url = await createPreference({
      accessToken: config.mercadopago.accessToken,
      title: req.body.title,
      price: config.subscriptionPrice,
      externalReference: comprobante,
      notificationUrl: config.apiUrl && `${config.apiUrl}/mp/webhook`,
      backUrls: {
        success: `${config.clientUrl}/subscription?wallet=${comprobante}&id=${profesionalId}`,
        failure: `${config.clientUrl}/failure`,
        pending: `${config.clientUrl}/pending`,
      },
    });
    res.json({ url });
  })
);

module.exports = router;
