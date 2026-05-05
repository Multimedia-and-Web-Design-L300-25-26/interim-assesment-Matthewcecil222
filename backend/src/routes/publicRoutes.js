const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const { getProfile } = require("../controllers/userController");
const {
  getAllCrypto,
  getTopGainers,
  getNewListings,
  getCryptoById,
  createCrypto,
} = require("../controllers/cryptoController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);

router.get("/crypto", getAllCrypto);
router.get("/crypto/gainers", getTopGainers);
router.get("/crypto/new", getNewListings);
router.get("/crypto/:id", getCryptoById);
router.post("/crypto", createCrypto);

module.exports = router;
