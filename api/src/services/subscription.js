const config = require("../config");
const { conn, Profesional, Pago } = require("../db");
const httpError = require("../utils/httpError");
const mercadopago = require("../utils/mercadopago");
const { formatDate, parseDate, addDays, isExpired } = require("../utils/dates");

const SUBSCRIPTION_DAYS = 30;

const nextExpiration = (current) => {
  // Si ya venció se cuenta desde hoy; si no, desde el vencimiento actual.
  const base = !current || isExpired(current) ? new Date() : parseDate(current);
  return formatDate(addDays(base, SUBSCRIPTION_DAYS));
};

// Acredita 30 días de suscripción a partir de un pago de Mercado Pago, verificándolo
// contra la API de MP. Es idempotente: un pago ya acreditado no suma días de nuevo.
//
// Devuelve { profesional, credited }. `profesionalId` (opcional) exige que el pago
// pertenezca a ese profesional.
const settleSubscriptionPayment = async (paymentId, { profesionalId } = {}) => {
  if (!paymentId) throw httpError(400, "Falta el id del pago");

  let payment;
  try {
    payment = await mercadopago.getPayment(config.mercadopago.accessToken, paymentId);
  } catch (err) {
    throw httpError(400, "No se pudo verificar el pago con Mercado Pago");
  }

  if (payment.status !== "approved") {
    throw httpError(402, `El pago no está aprobado (estado: ${payment.status})`);
  }
  if (Number(payment.transaction_amount) < config.subscriptionPrice) {
    throw httpError(400, "El monto del pago no coincide con la suscripción");
  }

  return conn.transaction(async (transaction) => {
    const pago = await Pago.findOne({
      where: { comprobante: String(payment.external_reference || "") },
      transaction,
      lock: transaction.LOCK.UPDATE,
    });
    if (!pago) throw httpError(404, "El pago no corresponde a ninguna suscripción");
    if (profesionalId != null && String(pago.profesionalId) !== String(profesionalId)) {
      throw httpError(403, "El pago pertenece a otro profesional");
    }

    const profesional = await Profesional.findByPk(pago.profesionalId, { transaction });
    if (pago.completado) return { profesional, credited: false };

    profesional.subscripcion = nextExpiration(profesional.subscripcion);
    await profesional.save({ transaction });
    pago.completado = true;
    await pago.save({ transaction });
    return { profesional, credited: true };
  });
};

module.exports = { settleSubscriptionPayment, nextExpiration };
