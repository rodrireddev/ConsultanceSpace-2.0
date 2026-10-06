const { Router } = require("express");
const { Profesional, Especialidad } = require("../db");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

// GET /profesional?fullName=...  -> busca por nombre y, si no hay resultados, por especialidad
// GET /profesional?email=...     -> profesional de ese usuario
router.get(
  "/profesional",
  asyncHandler(async (req, res) => {
    const { fullName, email } = req.query;

    if (fullName) {
      const term = String(fullName).toLowerCase();
      const profesionales = await Profesional.findAll({ include: Especialidad });

      const byName = profesionales.filter((p) => p.fullName.toLowerCase().includes(term));
      if (byName.length) return res.status(200).json(byName);

      const bySpeciality = profesionales.filter((p) =>
        p.especialidads.some((e) => e.nombre.toLowerCase().includes(term))
      );
      return res.status(200).json(bySpeciality);
    }

    if (email) {
      const profesionales = await Profesional.findAll({
        where: { usuarioEmail: email },
        include: Especialidad,
      });
      return res.status(200).json(profesionales);
    }

    throw httpError(400, "Se requiere fullName o email");
  })
);

module.exports = router;
