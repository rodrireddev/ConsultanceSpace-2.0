const { MercadoPagoConfig, Preference, Payment } = require("mercadopago");

const clientFor = (accessToken) => new MercadoPagoConfig({ accessToken });

// Crea una preferencia de pago con el access token indicado y devuelve el init_point.
// `externalReference` vuelve en el pago y permite relacionarlo con nuestro registro.
const createPreference = async ({
  accessToken,
  title,
  price,
  backUrls,
  externalReference,
  notificationUrl,
}) => {
  const preference = await new Preference(clientFor(accessToken)).create({
    body: {
      items: [
        {
          id: "item-1",
          title: title || "Consultance Space",
          unit_price: Number(price),
          quantity: 1,
        },
      ],
      back_urls: backUrls,
      auto_return: "approved",
      ...(externalReference && { external_reference: externalReference }),
      ...(notificationUrl && { notification_url: notificationUrl }),
    },
  });
  return preference.init_point;
};

// Consulta un pago directamente a Mercado Pago (fuente de verdad, no el cliente).
const getPayment = (accessToken, id) => new Payment(clientFor(accessToken)).get({ id });

module.exports = { createPreference, getPayment };
