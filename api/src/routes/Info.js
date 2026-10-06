const { Router } = require("express");
const { Profesional, Paciente, Especialidad, Horario } = require("../db");
const { sameEmail } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

// Post => email y tipo_usuario devuelve la info del perfil (solo de la propia cuenta)
router.post(
  "/info",
  asyncHandler(async (req, res) => {
    const { email, tipo_usuario } = req.body;
    if (!sameEmail(email, req.auth.email)) throw httpError(403, "No podés consultar otra cuenta");

    if (tipo_usuario === "profesional") {
      const prof = await Profesional.findOne({
        where: { usuarioEmail: email },
        include: [Especialidad, Horario],
      });
      if (!prof) return res.status(200).send(prof);
      // El token de MP nunca sale del servidor; el cliente solo necesita saber si está vinculado.
      const secret = await Profesional.unscoped().findByPk(prof.id, { attributes: ["token"] });
      return res.status(200).send({ ...prof.toJSON(), mpLinked: Boolean(secret && secret.token) });
    }
    if (tipo_usuario === "paciente") {
      return res.status(200).send(await Paciente.findOne({ where: { usuarioEmail: email } }));
    }
    return res.status(200).send("info incorrecta");
  })
);

module.exports = router;
