const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret";
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/test";
process.env.CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

const app = require("../src/app");

const makeRequest = (server, path, options = {}) =>
  new Promise((resolve, reject) => {
    const { port } = server.address();

    const req = http.request({
      hostname: "127.0.0.1",
      port,
      path,
      method: options.method || "GET",
      headers: options.headers || {},
    }, (res) => {
      let body = "";

      res.on("data", (chunk) => {
        body += chunk;
      });

      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body,
        });
      });
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
    req.on("error", reject);
  });

test("GET / returns API metadata", async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, "/");
    const data = JSON.parse(response.body);

    assert.equal(response.statusCode, 200);
    assert.equal(data.success, true);
    assert.equal(data.message, "Coinbase Clone Backend API");
    assert.equal(data.docs.openApi, "/api/docs");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("GET /health returns service status", async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, "/health");
    const data = JSON.parse(response.body);

    assert.equal(response.statusCode, 200);
    assert.equal(data.success, true);
    assert.equal(data.message, "API is running");
    assert.ok(data.timestamp);
    assert.equal(response.headers["x-powered-by"], undefined);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("GET /api/docs returns OpenAPI document", async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, "/api/docs");
    const data = JSON.parse(response.body);

    assert.equal(response.statusCode, 200);
    assert.equal(data.openapi, "3.0.3");
    assert.equal(data.info.title, "Coinbase Clone Backend API");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("GET /docs returns OpenAPI document", async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, "/docs");
    const data = JSON.parse(response.body);

    assert.equal(response.statusCode, 200);
    assert.equal(data.openapi, "3.0.3");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("unknown routes return 404 JSON", async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, "/does-not-exist");
    const data = JSON.parse(response.body);

    assert.equal(response.statusCode, 404);
    assert.equal(data.success, false);
    assert.match(data.message, /Route not found/);
    assert.equal(data.path, "/does-not-exist");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("GET /profile without a token returns 401 JSON", async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, "/profile");
    const data = JSON.parse(response.body);

    assert.equal(response.statusCode, 401);
    assert.equal(data.success, false);
    assert.equal(data.message, "Not authorized. Please log in first");
    assert.equal(data.path, "/profile");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("invalid JSON payload returns 400 JSON", async () => {
  const server = app.listen(0);

  try {
    const response = await makeRequest(server, "/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: '{"name":"Jane",',
    });
    const data = JSON.parse(response.body);

    assert.equal(response.statusCode, 400);
    assert.equal(data.success, false);
    assert.equal(data.message, "Invalid JSON payload");
    assert.equal(data.path, "/register");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
