const { Cita, ProfesionalPaciente } = require("../db");
const httpError = require("./httpError");

// Un profesional puede ver a un paciente si lo tiene en "mis pacientes" o tiene una cita con él.
const profesionalCanAccessPaciente = async (profesionalId, pacienteId) => {
  const relation = await ProfesionalPaciente.findOne({ where: { profesionalId, pacienteId } });
  if (relation) return true;
  return Boolean(await Cita.findOne({ where: { profesionalId, pacienteId } }));
};

const isParticipant = (me, cita) =>
  Boolean(
    (me.profesional && cita.profesionalId === me.profesional.id) ||
      (me.paciente && cita.pacienteId === me.paciente.id)
  );

// Carga la cita y verifica que el usuario sea su profesional o su paciente.
const loadOwnCita = async (me, citaId, options = {}) => {
  const cita = citaId && (await Cita.findByPk(citaId, options));
  if (!cita) throw httpError(404, "La cita no existe");
  if (!isParticipant(me, cita)) throw httpError(403, "No tenés acceso a esta cita");
  return cita;
};

// Compara ids que pueden llegar como string o número.
const sameId = (a, b) => a != null && b != null && String(a) === String(b);

module.exports = { profesionalCanAccessPaciente, isParticipant, loadOwnCita, sameId };
