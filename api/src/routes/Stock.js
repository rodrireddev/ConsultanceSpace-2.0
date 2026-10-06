const { Router } = require("express");
const { Stock } = require("../db");
const { requireRole } = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = Router();

// El stock es del profesional autenticado; el `email` que mande el cliente se ignora.
router.use("/stock", requireRole("profesional"));

const findStock = (req) => Stock.findOne({ where: { usuarioEmail: req.me.email } });

// [{ nombre: cantidad }, ...]
const serialize = (stock) =>
  (stock.itemsName || []).map((name, i) => ({ [name]: stock.itemsCount[i] }));

router.get(
  "/stock",
  asyncHandler(async (req, res) => {
    const stock = await findStock(req);
    res.status(200).json(stock ? serialize(stock) : "not found");
  })
);

router.post(
  "/stock",
  asyncHandler(async (req, res) => {
    const { item, quantity } = req.body;
    const stock = await findStock(req);
    if (!stock || item == null || quantity == null) {
      return res.status(200).json("not found");
    }

    const names = [...(stock.itemsName || [])];
    const counts = [...(stock.itemsCount || [])];
    const index = names.indexOf(item);
    if (index === -1) {
      names.push(item);
      counts.push(quantity);
    } else {
      counts[index] = quantity;
    }
    stock.itemsName = names;
    stock.itemsCount = counts;
    await stock.save();
    return res.status(200).json(serialize(stock));
  })
);

router.delete(
  "/stock",
  asyncHandler(async (req, res) => {
    const { item } = req.body;
    const stock = await findStock(req);
    if (!stock || item == null) return res.status(200).json("not found");

    const names = [...(stock.itemsName || [])];
    const counts = [...(stock.itemsCount || [])];
    const index = names.indexOf(item);
    if (index !== -1) {
      names.splice(index, 1);
      counts.splice(index, 1);
      stock.itemsName = names;
      stock.itemsCount = counts;
      await stock.save();
    }
    return res.status(200).json(serialize(stock));
  })
);

module.exports = router;
