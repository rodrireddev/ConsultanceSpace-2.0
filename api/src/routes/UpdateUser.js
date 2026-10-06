const { Router } = require("express");
const { Especialidad } = require("../db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

const isText = (value) => value && typeof value === "string";

// Solo se actualizan los campos presentes en el body.
const pick = (body, { upper = {}, text = {}, plain = {} }) => {
  const changes = {};
  Object.entries(upper).forEach(([from, to]) => {
    if (isText(body[from])) changes[to] = body[from].toUpperCase();
  });
  Object.entries(text).forEach(([from, to]) => {
    if (isText(body[from])) changes[to] = body[from];
  });
  Object.entries(plain).forEach(([from, to]) => {
    if (body[from]) changes[to] = body[from];
  });
  return changes;
};

const COMMON = {
  upper: { name: "nombre", lastName: "apellidos" },
  plain: { dni: "cedula", birth: "fecha_de_nacimiento", phone: "telefono" },
  text: { address: "direccion", country: "pais" },
};

// Cada usuario solo puede modificar su propio perfil (se ignoran `email` e `id` del body).
router.put(
  "/updateUser",
  asyncHandler(async (req, res) => {
    const { speciality, clearespeciality } = req.body;
    const { profesional, paciente } = req.me;

    if (profesional) {
      if (clearespeciality === "true" || clearespeciality === true) {
        await profesional.setEspecialidads([]);
      }
      if (speciality) {
        const especialidad = await Especialidad.findOne({ where: { nombre: speciality } });
        if (!especialidad) throw httpError(404, "Especialidad no encontrada");
        await especialidad.addProfesional(profesional);
      }
      await profesional.update(pick(req.body, COMMON));
      return res.status(200).json(await profesional.reload());
    }

    if (paciente) {
      await paciente.update({
        ...pick(req.body, COMMON),
        ...pick(req.body, { plain: { genero: "genero", estado_civil: "estado_civil" } }),
      });
      return res.status(200).json(await paciente.reload());
    }

    throw httpError(400, "Tipo de usuario inválido");
  })
);

module.exports = router;
