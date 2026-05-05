const express = require("express");
const {
  getAllCrypto,
  getTopGainers,
  getNewListings,
  getCryptoById,
  createCrypto,
} = require("../controllers/cryptoController");

const router = express.Router();

router.get("/", getAllCrypto);
router.get("/gainers", getTopGainers);
router.get("/new", getNewListings);
router.get("/:id", getCryptoById);
router.post("/", createCrypto);

module.exports = router;
