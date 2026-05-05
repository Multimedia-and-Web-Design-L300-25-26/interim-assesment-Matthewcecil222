const mongoose = require("mongoose");

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, "Symbol is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },
    change24h: {
      type: Number,
      required: [true, "24h change is required"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Crypto", cryptoSchema);
