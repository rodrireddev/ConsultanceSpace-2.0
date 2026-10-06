const { Router } = require("express");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const { settleSubscriptionPayment } = require("../services/subscription");

const router = Router();

// Después de pagar, el cliente envía el payment_id que Mercado Pago agrega a la back_url.
// El servidor consulta ese pago a MP y recién ahí suma 30 días a la suscripción.
router.post(
  "/addSub",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { paymentId } = req.body;
    const { profesional } = await settleSubscriptionPayment(paymentId, {
      profesionalId: req.me.profesional.id,
    });
    res.status(200).send(profesional);
  })
);

module.exports = router;
