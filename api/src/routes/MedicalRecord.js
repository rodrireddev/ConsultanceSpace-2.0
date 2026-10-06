const { Router } = require("express");
const {
  AntecedentesPatologicos,
  AntecedentesNoPatologicos,
  Paciente,
} = require("../db");
const { requireRole } = require("../middleware/auth");
const { profesionalCanAccessPaciente, sameId } = require("../utils/access");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

const PATOLOGICOS = [
  "embarazo",
  "enfermedades_infancia",
  "accidente",
  "transfusion",
  "operacion",
  "alergia",
  "cooperador",
  "orientado",
  "constitucion",
  "complexion",
  "facie",
  "conformacion",
  "movimientos_anormales",
  "marchas_patologicas",
  "bajo_tratamiento",
  "pildoras_anticonceptivas",
  "diabetes",
  "hepatitis",
  "tosferina",
  "hemorragias",
  "cardiopatias",
  "hipotension",
  "hipertension",
  "fiebre_reumatica",
  "paludismo",
  "VIH",
  "parasitos",
  "sarampion",
  "amigdalitis",
  "epilepsia",
  "ETS",
  "comentarios",
];

const NO_PATOLOGICOS = [
  "alimentacion",
  "higiene_corporal",
  "higiene_bucal",
  "vacunas",
  "toxicomanias",
  "alcoholismo",
  "tabaquismo",
  "tatuajes",
  "comentarios",
];

// Copia solo los campos permitidos que vienen definidos en el body.
const pickFields = (body, fields) =>
  Object.fromEntries(fields.filter((f) => body[f] !== undefined).map((f) => [f, body[f]]));

const findPaciente = async (idPaciente) => {
  const paciente = idPaciente && (await Paciente.findByPk(idPaciente));
  if (!paciente) throw httpError(404, "Paciente no encontrado");
  return paciente;
};

// La historia clínica la lee el propio paciente o un profesional con vínculo (mis pacientes / citas).
const assertCanRead = async (me, paciente) => {
  if (me.paciente && sameId(me.paciente.id, paciente.id)) return;
  if (me.profesional && (await profesionalCanAccessPaciente(me.profesional.id, paciente.id))) return;
  throw httpError(403, "No tenés acceso a esta historia clínica");
};

// Solo la edita un profesional con vínculo con el paciente.
const assertCanWrite = async (me, paciente) => {
  if (!me.profesional || !(await profesionalCanAccessPaciente(me.profesional.id, paciente.id))) {
    throw httpError(403, "No tenés acceso a esta historia clínica");
  }
};

// Create: enviar idPaciente + antecedentesPatologicos OR antecedentesNoPatologicos (flag) + campos
router.post(
  "/medicalRecord",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { antecedentesPatologicos, antecedentesNoPatologicos, idPaciente } = req.body;
    if (!antecedentesPatologicos && !antecedentesNoPatologicos) {
      throw httpError(400, "Se requiere antecedentesPatologicos o antecedentesNoPatologicos");
    }
    const paciente = await findPaciente(idPaciente);
    await assertCanWrite(req.me, paciente);

    if (antecedentesPatologicos) {
      const record = await AntecedentesPatologicos.create(pickFields(req.body, PATOLOGICOS));
      await record.setPaciente(paciente.id);
    }
    if (antecedentesNoPatologicos) {
      const record = await AntecedentesNoPatologicos.create(pickFields(req.body, NO_PATOLOGICOS));
      await record.setPaciente(paciente.id);
    }
    res.status(200).send("Registro exitoso");
  })
);

// Get: enviar idPaciente por query
router.get(
  "/medicalRecord",
  asyncHandler(async (req, res) => {
    const paciente = await Paciente.findByPk(req.query.idPaciente, {
      include: [AntecedentesPatologicos, AntecedentesNoPatologicos],
    });
    // Misma respuesta que antes para un id inexistente, pero sin filtrar datos ajenos.
    if (paciente) await assertCanRead(req.me, paciente);
    res.status(200).json(paciente);
  })
);

// Update: enviar idPaciente + flag del tipo + los campos a modificar
router.put(
  "/medicalRecord",
  requireRole("profesional"),
  asyncHandler(async (req, res) => {
    const { antecedentesPatologicos, antecedentesNoPatologicos, idPaciente } = req.body;
    if (!antecedentesPatologicos && !antecedentesNoPatologicos) {
      throw httpError(400, "Se requiere antecedentesPatologicos o antecedentesNoPatologicos");
    }
    const paciente = await findPaciente(idPaciente);
    await assertCanWrite(req.me, paciente);

    if (antecedentesPatologicos) {
      await AntecedentesPatologicos.update(pickFields(req.body, PATOLOGICOS), {
        where: { id: paciente.antecedentesPatologicoId },
      });
    }
    if (antecedentesNoPatologicos) {
      await AntecedentesNoPatologicos.update(pickFields(req.body, NO_PATOLOGICOS), {
        where: { id: paciente.antecedentesNoPatologicoId },
      });
    }
    res.status(200).json("Actualizado");
  })
);

module.exports = router;
