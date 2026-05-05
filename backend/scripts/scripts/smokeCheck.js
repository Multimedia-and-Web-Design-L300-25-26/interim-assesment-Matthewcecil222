const http = require("http");

const baseUrl = process.env.SMOKE_BASE_URL || "http://localhost:5000";

const request = (path) =>
  new Promise((resolve, reject) => {
    const req = http.get(`${baseUrl}${path}`, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body,
        });
      });
    });

    req.on("error", reject);
  });

const run = async () => {
  const checks = ["/health", "/api/health"];

  for (const path of checks) {
    const response = await request(path);
    console.log(`${path} -> ${response.statusCode}`);

    if (response.statusCode !== 200) {
      console.error(`Smoke check failed for ${path}`);
      process.exit(1);
    }
  }

  console.log("Smoke checks passed");
};

run().catch((error) => {
  console.error("Smoke check error:", error.message);
  process.exit(1);
});
