// Verificación de pagos de suscripción contra Mercado Pago (stub de la API y de la DB).
const request = require("supertest");
const { expect } = require("chai");
const { install, restore, stub, bearer, db } = require("../helpers/setup");
const mercadopago = require("../../src/utils/mercadopago");
const config = require("../../src/config");
const { formatDate, addDays } = require("../../src/utils/dates");
const app = require("../../src/app");

describe("Confirmación de pagos de suscripción", () => {
  let pago;
  let profesional;
  let payment;

  beforeEach(() => {
    install();
    payment = {
      status: "approved",
      transaction_amount: config.subscriptionPrice,
      external_reference: "comprobante-1",
    };
    pago = { profesionalId: 10, completado: false, save: async () => {} };
    profesional = { id: 10, subscripcion: "01/01/2000", save: async () => {} };

    stub(mercadopago, "getPayment", async () => payment);
    stub(db.conn, "transaction", async (cb) => cb({ LOCK: { UPDATE: "UPDATE" } }));
    stub(db.Pago, "findOne", async ({ where }) =>
      where.comprobante === "comprobante-1" ? pago : null
    );
    stub(db.Profesional, "findByPk", async () => profesional);
  });
  afterEach(restore);

  const addSub = (token, body) =>
    request(app).post("/addSub").set(bearer(token)).send(body);

  it("acredita 30 días cuando MP confirma el pago aprobado", async () => {
    const res = await addSub("prof-token", { paymentId: "999" });
    expect(res.status).to.equal(200);
    expect(pago.completado).to.equal(true);
    // la suscripción estaba vencida: se cuenta desde hoy
    expect(profesional.subscripcion).to.equal(formatDate(addDays(new Date(), 30)));
  });

  it("es idempotente: reenviar el mismo pago no suma días otra vez", async () => {
    await addSub("prof-token", { paymentId: "999" });
    const before = profesional.subscripcion;
    const res = await addSub("prof-token", { paymentId: "999" });
    expect(res.status).to.equal(200);
    expect(profesional.subscripcion).to.equal(before);
  });

  it("no acredita un pago pendiente o rechazado", async () => {
    payment.status = "pending";
    const res = await addSub("prof-token", { paymentId: "999" });
    expect(res.status).to.equal(402);
    expect(pago.completado).to.equal(false);
  });

  it("no acredita si el monto es menor al de la suscripción", async () => {
    payment.transaction_amount = 1;
    const res = await addSub("prof-token", { paymentId: "999" });
    expect(res.status).to.equal(400);
    expect(pago.completado).to.equal(false);
  });

  it("rechaza un pago que no corresponde a ninguna suscripción nuestra", async () => {
    payment.external_reference = "otra-cosa";
    const res = await addSub("prof-token", { paymentId: "999" });
    expect(res.status).to.equal(404);
  });

  it("rechaza el pago de otro profesional", async () => {
    const res = await addSub("prof2-token", { paymentId: "999" });
    expect(res.status).to.equal(403);
    expect(pago.completado).to.equal(false);
  });

  it("rechaza un id de pago que MP no conoce", async () => {
    stub(mercadopago, "getPayment", async () => {
      throw new Error("not found");
    });
    const res = await addSub("prof-token", { paymentId: "inventado" });
    expect(res.status).to.equal(400);
    expect(pago.completado).to.equal(false);
  });

  it("ya no confía en un UUID enviado por el cliente", async () => {
    const res = await addSub("prof-token", { id: 10, token: "comprobante-1" });
    expect(res.status).to.equal(400);
    expect(pago.completado).to.equal(false);
  });

  it("el webhook acredita pagos aprobados y responde 200", async () => {
    const res = await request(app).post("/mp/webhook?type=payment&data.id=999");
    expect(res.status).to.equal(200);
    expect(pago.completado).to.equal(true);
  });

  it("el webhook responde 200 aunque el pago no sea válido y no acredita nada", async () => {
    payment.status = "rejected";
    const res = await request(app).post("/mp/webhook?type=payment&data.id=999");
    expect(res.status).to.equal(200);
    expect(pago.completado).to.equal(false);
  });
});
