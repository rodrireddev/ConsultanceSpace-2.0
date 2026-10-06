const { Router } = require("express");
const { authenticate, requireVerified, loadMe } = require("../middleware/auth");

const router = Router();

// --- Públicas ---
router.use(require("./Specialities"));
router.use(require("./MercadoPagoWebhook"));

// --- Requieren un token de Firebase válido (email aún sin verificar) ---
// El alta, el login y el info se usan antes de verificar el mail.
router.use(authenticate);
router.use(require("./NewUser"));
router.use(require("./Login"));
router.use(require("./Info"));

// --- Requieren email verificado y un usuario registrado (req.me) ---
router.use(requireVerified, loadMe);
[
  "Stock",
  "cita",
  "SearchProfesional",
  "Patients",
  "Treatments",
  "UpdateUser",
  "Profesional_patient",
  "checkout",
  "Mailing",
  "ProfesionalToken",
  "Profesionalpayments",
  "DisablePatients",
  "horarios",
  "AddPatients",
  "MedicalRecord",
  "AddSub",
].forEach((name) => router.use(require(`./${name}`)));

module.exports = router;
