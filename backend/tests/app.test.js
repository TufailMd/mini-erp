import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import app from "../app.js";
import User from "../models/User.js";
import Customer from "../models/customer.model.js";
import Counter from "../models/counter.model.js";

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

const customerId = "64b000000000000000000001";
const userId = "64b000000000000000000002";

const authenticatedHeaders = (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "customer-api-test-secret";
  t.after(() => {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  t.mock.method(User, "findById", () => ({
    select: async () => ({ _id: userId }),
  }));

  return {
    authorization: `Bearer ${jwt.sign({ id: userId }, "customer-api-test-secret")}`,
    "content-type": "application/json",
  };
};

test("authentication rejects missing token", async (t) => {
  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
  );
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.deepEqual(body, { message: "Not authorized, no token" });
});

test("authentication rejects invalid token", async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "authentication-test-secret";
  t.after(() => {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    {
      headers: {
        authorization: "Bearer invalid-token",
      },
    },
  );
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.deepEqual(body, { message: "Not authorized, invalid token" });
});

test("authentication rejects expired token", async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "authentication-test-secret";
  t.after(() => {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  const expiredToken = jwt.sign(
    { id: userId },
    "authentication-test-secret",
    { expiresIn: -1 },
  );

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    {
      headers: {
        authorization: `Bearer ${expiredToken}`,
      },
    },
  );
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.deepEqual(body, { message: "Not authorized, invalid token" });
});

test("authentication accepts valid token with existing user", async (t) => {
  const headers = authenticatedHeaders(t);
  t.mock.method(Customer, "find", () => {
    const query = {
      skip: () => query,
      limit: () => query,
      sort: async () => [],
    };
    return query;
  });
  t.mock.method(Customer, "countDocuments", async () => 0);

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    { headers },
  );

  assert.equal(response.status, 200);
});

test("authentication rejects valid token for deleted user", async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "authentication-test-secret";
  t.after(() => {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  t.mock.method(User, "findById", () => ({
    select: async () => null,
  }));

  const token = jwt.sign({ id: userId }, "authentication-test-secret");

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.deepEqual(body, { message: "Not authorized, invalid token" });
});

test("authentication does not expose database lookup errors", async (t) => {
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "authentication-test-secret";
  t.after(() => {
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
  });

  t.mock.method(User, "findById", () => ({
    select: async () => {
      throw new Error("sensitive database details");
    },
  }));

  const token = jwt.sign({ id: userId }, "authentication-test-secret");

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );
  const body = await response.json();

  assert.equal(response.status, 401);
  assert.deepEqual(body, { message: "Not authorized, invalid token" });
  assert.doesNotMatch(JSON.stringify(body), /sensitive database details/i);
});

test("all Customer endpoints reject unauthenticated requests", async (t) => {
  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/api/customers`;
  const requests = [
    ["POST", baseUrl, {}],
    ["GET", baseUrl],
    ["GET", `${baseUrl}/${customerId}`],
    ["PUT", `${baseUrl}/${customerId}`, {}],
    ["DELETE", `${baseUrl}/${customerId}`],
  ];

  for (const [method, url, body] of requests) {
    const response = await fetch(url, {
      method,
      ...(body ? { body: JSON.stringify(body), headers: { "content-type": "application/json" } } : {}),
    });
    assert.equal(response.status, 401);
  }
});

test("authenticated POST /api/customers creates a customer", async (t) => {
  const headers = authenticatedHeaders(t);
  t.mock.method(Counter, "findByIdAndUpdate", async () => ({ seq: 1 }));
  t.mock.method(Customer, "create", async (data) => {
    const customer = new Customer(data);
    await customer.validate();
    return customer;
  });

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Acme Corporation",
        customer_type: "BUSINESS",
        company_name: "Acme Corporation",
        email: "Sales@Acme.COM",
      }),
    },
  );
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.success, true);
  assert.equal(body.data.name, "Acme Corporation");
  assert.equal(body.data.normalized_name, "acme corporation");
  assert.equal(body.data.customer_code, "CUS-000001");
  assert.equal(body.data.created_by, userId);
});

test("GET /api/customers returns the customer list", async (t) => {
  const headers = authenticatedHeaders(t);
  const query = {
    skip: () => query,
    limit: () => query,
    sort: async () => [{ _id: customerId, name: "Acme Corporation" }],
  };
  t.mock.method(Customer, "find", () => query);
  t.mock.method(Customer, "countDocuments", async () => 1);

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers?search=acme&page=1&limit=20&customer_type=BUSINESS&is_active=true`,
    { headers },
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.total, 1);
  assert.equal(body.page, 1);
  assert.equal(body.data.length, 1);
});

test("Customer pagination normalizes invalid values and preserves valid values", async (t) => {
  const headers = authenticatedHeaders(t);
  const cases = [
    ["", 0, 20],
    ["page=abc", 0, 20],
    ["page=-1", 0, 20],
    ["page=0", 0, 20],
    ["limit=0", 0, 20],
    ["limit=-5", 0, 20],
    ["limit=1000", 0, 100],
    ["page=2&limit=10", 10, 10],
  ];

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/api/customers`;

  for (const [queryString, expectedSkip, expectedLimit] of cases) {
    let actualSkip;
    let actualLimit;
    const query = {
      skip(value) {
        actualSkip = value;
        return query;
      },
      limit(value) {
        actualLimit = value;
        return query;
      },
      sort: async () => [],
    };
    t.mock.method(Customer, "find", () => query);
    t.mock.method(Customer, "countDocuments", async () => 0);

    const separator = queryString ? `?${queryString}` : "";
    const response = await fetch(`${baseUrl}${separator}`, { headers });
    assert.equal(response.status, 200);
    assert.equal(actualSkip, expectedSkip);
    assert.equal(actualLimit, expectedLimit);
  }
});

test("Customer search treats regex metacharacters literally", async (t) => {
  const headers = authenticatedHeaders(t);
  let capturedFilter;
  const query = {
    skip: () => query,
    limit: () => query,
    sort: async () => [],
  };
  t.mock.method(Customer, "find", (filter) => {
    capturedFilter = filter;
    return query;
  });
  t.mock.method(Customer, "countDocuments", async () => 0);

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/api/customers`;
  const cases = [
    ["Acme", "Acme"],
    ["A.B", "A\\.B"],
    ["test+user", "test\\+user"],
    ["(Company)", "\\(Company\\)"],
    [".*", "\\.\\*"],
    ["CUS-000001", "CUS-000001"],
  ];

  for (const [search, expectedRegex] of cases) {
    const response = await fetch(`${baseUrl}?search=${encodeURIComponent(search)}`, {
      headers,
    });
    assert.equal(response.status, 200);

    const fields = ["name", "customer_code", "email", "phone", "company_name"];
    assert.equal(capturedFilter.$or.length, fields.length);
    for (let index = 0; index < fields.length; index += 1) {
      assert.equal(
        capturedFilter.$or[index][fields[index]].$regex,
        expectedRegex,
      );
      assert.equal(capturedFilter.$or[index][fields[index]].$options, "i");
    }
  }
});

test("GET /api/customers/:id returns a customer", async (t) => {
  const headers = authenticatedHeaders(t);
  t.mock.method(Customer, "findById", async () => ({
    _id: customerId,
    name: "Acme Corporation",
  }));

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers/${customerId}`,
    { headers },
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data._id, customerId);
});

test("PUT /api/customers/:id updates permitted fields", async (t) => {
  const headers = authenticatedHeaders(t);
  const customer = {
    _id: customerId,
    name: "Old Name",
    customer_code: "CUS-000001",
    normalized_name: "old name",
    created_by: userId,
    async save() {
      return this;
    },
  };
  t.mock.method(Customer, "findById", async () => customer);

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers/${customerId}`,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({
        name: "New Name",
        phone: "9876543210",
        customer_code: "CUS-999999",
        normalized_name: "forged-name",
        created_by: "64b000000000000000000999",
      }),
    },
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.data.name, "New Name");
  assert.equal(body.data.phone, "9876543210");
  assert.equal(body.data.customer_code, "CUS-000001");
  assert.equal(body.data.normalized_name, "old name");
  assert.equal(body.data.created_by, userId);
});

test("DELETE /api/customers/:id deactivates a customer without deleting it", async (t) => {
  const headers = authenticatedHeaders(t);
  const customer = {
    _id: customerId,
    name: "Acme Corporation",
    customer_code: "CUS-000001",
    email: "sales@acme.com",
    is_active: true,
    async save() {
      return this;
    },
  };
  t.mock.method(Customer, "findById", async () => customer);
  let deleteCalls = 0;
  t.mock.method(Customer, "findByIdAndDelete", async () => {
    deleteCalls += 1;
    return null;
  });

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers/${customerId}`,
    { method: "DELETE", headers },
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, {
    success: true,
    message: "Customer deactivated successfully",
  });
  assert.equal(customer.is_active, false);
  assert.equal(customer.name, "Acme Corporation");
  assert.equal(customer.customer_code, "CUS-000001");
  assert.equal(customer.email, "sales@acme.com");
  assert.equal(deleteCalls, 0);
});

test("DELETE deactivating an already inactive Customer remains successful", async (t) => {
  const headers = authenticatedHeaders(t);
  const customer = {
    _id: customerId,
    name: "Inactive Customer",
    is_active: false,
    async save() {
      return this;
    },
  };
  t.mock.method(Customer, "findById", async () => customer);

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers/${customerId}`,
    { method: "DELETE", headers },
  );
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(customer.is_active, false);
  assert.deepEqual(body, {
    success: true,
    message: "Customer deactivated successfully",
  });
});

test("invalid GSTIN is rejected", async (t) => {
  const headers = authenticatedHeaders(t);
  t.mock.method(Counter, "findByIdAndUpdate", async () => ({ seq: 2 }));
  t.mock.method(Customer, "create", async (data) => {
    const customer = new Customer(data);
    await customer.validate();
    return customer;
  });

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "GST Customer",
        gst_number: "INVALID",
      }),
    },
  );
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.match(body.message, /Invalid Indian GSTIN/);
});

test("BUSINESS customer without company_name is rejected", async (t) => {
  const headers = authenticatedHeaders(t);
  t.mock.method(Counter, "findByIdAndUpdate", async () => ({ seq: 3 }));
  t.mock.method(Customer, "create", async (data) => {
    const customer = new Customer(data);
    await customer.validate();
    return customer;
  });

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Business Customer",
        customer_type: "BUSINESS",
      }),
    },
  );
  const body = await response.json();

  assert.equal(response.status, 400);
  assert.equal(body.success, false);
  assert.match(body.message, /company_name|company name|required/i);
});

test("nonexistent customer ID returns the not-found response", async (t) => {
  const headers = authenticatedHeaders(t);
  t.mock.method(Customer, "findById", async () => null);

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers/${customerId}`,
    { headers },
  );
  const body = await response.json();

  assert.equal(response.status, 404);
  assert.deepEqual(body, {
    success: false,
    message: "Customer not found",
  });
});

test("malformed Customer IDs return 400 for GET, PUT, and DELETE", async (t) => {
  const headers = authenticatedHeaders(t);

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/api/customers/not-an-object-id`;

  for (const method of ["GET", "PUT", "DELETE"]) {
    const response = await fetch(baseUrl, {
      method,
      headers,
      ...(method === "PUT"
        ? { body: JSON.stringify({ name: "Updated Name" }) }
        : {}),
    });
    const body = await response.json();

    assert.equal(response.status, 400);
    assert.deepEqual(body, {
      success: false,
      message: "Invalid ObjectId",
    });
  }
});

test("valid nonexistent IDs remain 404 for Customer GET, PUT, and DELETE", async (t) => {
  const headers = authenticatedHeaders(t);
  t.mock.method(Customer, "findById", async () => null);

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}/api/customers/${customerId}`;

  for (const method of ["GET", "PUT", "DELETE"]) {
    const response = await fetch(baseUrl, {
      method,
      headers,
      ...(method === "PUT"
        ? { body: JSON.stringify({ name: "Updated Name" }) }
        : {}),
    });
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.deepEqual(body, {
      success: false,
      message: "Customer not found",
    });
  }
});

test("POST rejects client-supplied protected fields", async (t) => {
  const headers = authenticatedHeaders(t);
  t.mock.method(Counter, "findByIdAndUpdate", async () => ({ seq: 4 }));
  t.mock.method(Customer, "create", async (data) => {
    const customer = new Customer(data);
    await customer.validate();
    return customer;
  });

  const server = await startServer();
  t.after(() => server.close());

  const address = server.address();
  const response = await fetch(
    `http://127.0.0.1:${address.port}/api/customers`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: "Protected Fields",
        customer_code: "CUS-999999",
        normalized_name: "forged-name",
        created_by: "64b000000000000000000999",
      }),
    },
  );
  const body = await response.json();

  assert.equal(response.status, 201);
  assert.equal(body.data.customer_code, "CUS-000004");
  assert.equal(body.data.normalized_name, "protected fields");
  assert.equal(body.data.created_by, userId);
});

test("Customer GSTIN normalization and sparse unique index", async () => {
  const base = {
    customer_code: "CUS-999998",
    name: "GSTIN Model Test",
    customer_type: "INDIVIDUAL",
  };

  const missing = new Customer(base);
  await missing.validate();
  assert.equal(missing.gst_number, undefined);

  const empty = new Customer({ ...base, gst_number: "" });
  await empty.validate();
  assert.equal(empty.gst_number, undefined);

  const whitespace = new Customer({ ...base, gst_number: "   " });
  await whitespace.validate();
  assert.equal(whitespace.gst_number, undefined);

  const valid = new Customer({
    ...base,
    gst_number: "29abcde1234f1z5",
  });
  await valid.validate();
  assert.equal(valid.gst_number, "29ABCDE1234F1Z5");

  const invalid = new Customer({
    ...base,
    gst_number: "INVALID",
  });
  await assert.rejects(
    invalid.validate(),
    /Invalid Indian GSTIN/,
  );

  const gstIndex = Customer.schema
    .indexes()
    .find(([fields, options]) =>
      fields.gst_number === 1 &&
      options.unique === true &&
      options.sparse === true
    );
  assert.ok(gstIndex, "sparse unique GSTIN index should be declared");
});
