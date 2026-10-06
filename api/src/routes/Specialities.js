const { Router } = require("express");
const { Especialidad } = require("../db");
const asyncHandler = require("../utils/asyncHandler");

const router = Router();

// Lista pública de especialidades (la usa el menú aun sin sesión).
const listAll = asyncHandler(async (req, res) => {
  res.status(200).json(await Especialidad.findAll());
});

router.get("/specialities", (req, res, next) =>
  req.query.all === "all" ? listAll(req, res, next) : res.sendStatus(404)
);
router.get("/specialtys", listAll);

module.exports = router;
