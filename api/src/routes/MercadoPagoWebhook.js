const { Router } = require("express");
const { settleSubscriptionPayment } = require("../services/subscription");

const router = Router();

// Notificaciones de Mercado Pago (notification_url). No lleva autenticación de usuario:
// el id del pago se verifica siempre contra la API de MP, así que una notificación falsa
// no puede acreditar nada. Se responde 200 para que MP no reintente indefinidamente.
router.post("/mp/webhook", async (req, res) => {
  const type = req.query.type || req.body.type;
  const paymentId = req.query["data.id"] || (req.body.data && req.body.data.id);

  if (type === "payment" && paymentId) {
    try {
      await settleSubscriptionPayment(paymentId);
    } catch (err) {
      console.error("Webhook MP:", err.message);
    }
  }
  res.sendStatus(200);
});

module.exports = router;
