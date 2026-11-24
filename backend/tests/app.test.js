import test from "node:test";
import assert from "node:assert/strict";
import app from "../app.js";

const startServer = () =>
  new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => resolve(server));
  });

test("GET / confirms the Express application is running", async (t) => {
  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/`);

  assert.equal(response.status, 200);
  assert.equal(await response.text(), "API is running...");
});

test("unknown routes return the standard 404 response", async (t) => {
  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/unknown-route`,
  );
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, {
    success: false,
    message: "Route not found",
  });
});
