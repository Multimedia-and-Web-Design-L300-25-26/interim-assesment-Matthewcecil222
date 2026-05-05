const Crypto = require("../models/Crypto");
const { sendSuccess } = require("../utils/response");

const MAX_LIMIT = 100;
const symbolPattern = /^[A-Z0-9-]{2,10}$/;

const isValidHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
};

const getLimit = (value) => {
  if (value === undefined) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    return 10;
  }

  return Math.min(parsed, MAX_LIMIT);
};

const getAllCrypto = async (req, res, next) => {
  try {
    const limit = getLimit(req.query.limit);
    let query = Crypto.find().sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    const crypto = await query;

    sendSuccess(res, 200, "Cryptocurrencies fetched successfully", crypto, {
      count: crypto.length,
      limit: limit || null,
    });
  } catch (error) {
    next(error);
  }
};

const getTopGainers = async (req, res, next) => {
  try {
    const limit = getLimit(req.query.limit);
    let query = Crypto.find().sort({ change24h: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    const crypto = await query;

    sendSuccess(res, 200, "Top gainers fetched successfully", crypto, {
      count: crypto.length,
      limit: limit || null,
    });
  } catch (error) {
    next(error);
  }
};

const getNewListings = async (req, res, next) => {
  try {
    const limit = getLimit(req.query.limit);
    let query = Crypto.find().sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    const crypto = await query;

    sendSuccess(res, 200, "New listings fetched successfully", crypto, {
      count: crypto.length,
      limit: limit || null,
    });
  } catch (error) {
    next(error);
  }
};

const getCryptoById = async (req, res, next) => {
  try {
    const crypto = await Crypto.findById(req.params.id);

    if (!crypto) {
      return res.status(404).json({
        success: false,
        message: "Cryptocurrency not found",
      });
    }

    sendSuccess(res, 200, "Cryptocurrency fetched successfully", crypto);
  } catch (error) {
    next(error);
  }
};

const createCrypto = async (req, res, next) => {
  try {
    const name = req.body.name ? String(req.body.name).trim() : "";
    const symbol = req.body.symbol ? String(req.body.symbol).trim().toUpperCase() : "";
    const image = req.body.image ? String(req.body.image).trim() : "";
    const price = Number(req.body.price);
    const change24h = Number(req.body.change24h);

    if (
      !name ||
      !symbol ||
      !image ||
      Number.isNaN(price) ||
      Number.isNaN(change24h)
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, symbol, price, image, and change24h are required",
      });
    }

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 60 characters long",
      });
    }

    if (!symbolPattern.test(symbol)) {
      return res.status(400).json({
        success: false,
        message: "Symbol must be 2 to 10 characters and use only letters, numbers, or hyphens",
      });
    }

    if (price < 0) {
      return res.status(400).json({
        success: false,
        message: "Price cannot be negative",
      });
    }

    if (change24h < -1000 || change24h > 1000) {
      return res.status(400).json({
        success: false,
        message: "24h change must be between -1000 and 1000",
      });
    }

    if (!isValidHttpUrl(image)) {
      return res.status(400).json({
        success: false,
        message: "Image must be a valid HTTP or HTTPS URL",
      });
    }

    const existingCrypto = await Crypto.findOne({ symbol });

    if (existingCrypto) {
      return res.status(409).json({
        success: false,
        message: "A cryptocurrency with this symbol already exists",
      });
    }

    const crypto = await Crypto.create({
      name,
      symbol,
      price,
      image,
      change24h,
    });

    sendSuccess(res, 201, "Cryptocurrency created successfully", crypto);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCrypto,
  getTopGainers,
  getNewListings,
  getCryptoById,
  createCrypto,
};
