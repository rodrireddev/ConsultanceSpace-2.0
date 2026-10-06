const { Router } = require("express");
const { requireRole } = require("../middleware/auth");
const axios = require("axios");
const config = require("../config");
const { Profesional } = require("../db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

// Intercambia el code de OAuth de Mercado Pago por el access token del profesional.
router.post(
  "/profesionaltoken",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { code } = req.body;
    if (!code) throw httpError(400, "Falta el code");

    const { data } = await axios.post(
      "https://api.mercadopago.com/oauth/token",
      new URLSearchParams({
        client_id: config.mercadopago.clientId,
        client_secret: config.mercadopago.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: config.mercadopago.redirectUri,
      }),
      { headers: { accept: "application/json" } }
    );

    await Profesional.update(
      { token: data.access_token },
      { where: { id: req.me.profesional.id } }
    );
    // No se devuelve el access token al navegador.
    res.status(200).send({ linked: true });
  })
);

module.exports = router;
