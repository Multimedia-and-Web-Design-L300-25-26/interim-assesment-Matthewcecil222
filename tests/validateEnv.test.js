const test = require("node:test");
const assert = require("node:assert/strict");

const validateEnv = require("../src/config/validateEnv");

test("validateEnv allows startup when required variables exist", () => {
  const previousMongo = process.env.MONGODB_URI;
  const previousSecret = process.env.JWT_SECRET;

  process.env.MONGODB_URI = "mongodb://127.0.0.1:27017/test";
  process.env.JWT_SECRET = "test-secret";

  assert.doesNotThrow(() => validateEnv());

  process.env.MONGODB_URI = previousMongo;
  process.env.JWT_SECRET = previousSecret;
});

test("validateEnv throws when required variables are missing", () => {
  const previousMongo = process.env.MONGODB_URI;
  const previousSecret = process.env.JWT_SECRET;

  delete process.env.MONGODB_URI;
  delete process.env.JWT_SECRET;

  assert.throws(
    () => validateEnv(),
    /Missing required environment variables: MONGODB_URI, JWT_SECRET/
  );

  process.env.MONGODB_URI = previousMongo;
  process.env.JWT_SECRET = previousSecret;
});
