const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];

const validateEnv = () => {
  const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(", ")}`);
  }
};

module.exports = validateEnv;
