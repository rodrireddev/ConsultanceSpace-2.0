const { Router } = require("express");
const { Usuario } = require("../db");
const { sameEmail } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const httpError = require("../utils/httpError");

const router = Router();

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(404).send("user not found");
    // Solo se puede consultar la propia cuenta.
    if (!sameEmail(email, req.auth.email)) throw httpError(403, "No podés consultar otra cuenta");

    const user = await Usuario.findByPk(email);
    // Se mantiene el 200 con texto: así lo espera el cliente.
    return user ? res.status(200).json(user) : res.status(200).send("user not found");
  })
);

module.exports = router;
