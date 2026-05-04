const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const Crypto = require("../models/Crypto");

const cryptoSeedData = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    price: 64250.35,
    image: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    change24h: 3.4,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    price: 3125.12,
    image: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    change24h: 2.1,
  },
  {
    name: "Solana",
    symbol: "SOL",
    price: 146.72,
    image: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    change24h: 8.9,
  },
  {
    name: "Cardano",
    symbol: "ADA",
    price: 0.48,
    image: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    change24h: -1.6,
  },
];

const seedCrypto = async () => {
  try {
    await connectDB();
    await Crypto.deleteMany();
    await Crypto.insertMany(cryptoSeedData);
    console.log("Crypto seed completed");
    process.exit(0);
  } catch (error) {
    console.error("Crypto seed failed:", error.message);
    process.exit(1);
  }
};

seedCrypto();
