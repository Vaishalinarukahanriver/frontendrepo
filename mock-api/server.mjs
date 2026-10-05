// A tiny stand-alone backend (no dependencies) so Step 3 can be practised before you build
// your own API. Same contract as src/mock/products.mock.ts and the same validation rules as
// src/utils/validation/product.rules.ts.
//
//   npm run mock-api            -> http://localhost:4000/api/v1/products
//
// For HW2 you replace this with your OWN backend (NestJS, Spring Boot, Express, ...). Keep the
// same envelope: { success, message, data } and { success:false, message, statusCode, errors }.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const PORT = Number(process.env.PORT || 4000);
const PREFIX = "/api/v1";
const DELAY_MS = Number(process.env.DELAY_MS || 300);

const here = dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(readFileSync(join(here, "..", "src", "mock", "products.seed.json"), "utf8"));
let products = seed.map((p) => ({ ...p }));
let nextId = products.length + 1;

const RULES = { name: { min: 2, max: 50 }, price: { min: 0, max: 100_000_000 }, stock: { min: 0, max: 100_000 }, description: { max: 300 } };
const CATEGORIES = ["BOOK", "STATIONERY", "DIGITAL"];
const STATUSES = ["ACTIVE", "INACTIVE"];

function validate(body) {
  const errors = {};
  const name = String(body.name ?? "").trim();
  if (!name) errors.name = "Name is required.";
  else if (name.length < RULES.name.min || name.length > RULES.name.max) errors.name = `Name must be between ${RULES.name.min} and ${RULES.name.max} characters.`;
  if (!CATEGORIES.includes(body.category)) errors.category = "Category is required.";
  if (body.price === undefined || body.price === null) errors.price = "Price is required.";
  else if (!Number.isInteger(body.price) || body.price < RULES.price.min || body.price > RULES.price.max) errors.price = `Price must be between 0 and ${RULES.price.max.toLocaleString("en-US")}.`;
  if (body.stock === undefined || body.stock === null) errors.stock = "Stock is required.";
  else if (!Number.isInteger(body.stock) || body.stock < RULES.stock.min || body.stock > RULES.stock.max) errors.stock = `Stock must be between 0 and ${RULES.stock.max.toLocaleString("en-US")}.`;
  if (!STATUSES.includes(body.status)) errors.status = "Status is required.";
  if (body.description && String(body.description).length > RULES.description.max) errors.description = `Description must be at most ${RULES.description.max} characters.`;
  return errors;
}

const send = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload));
};
const fail = (res, statusCode, message, errors) => send(res, statusCode, { success: false, message, statusCode, ...(errors ? { errors } : {}) });
const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error("Body is not valid JSON."));
      }
    });
  });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const method = req.method ?? "GET";

  if (method === "OPTIONS") return send(res, 204, {});
  if (!url.pathname.startsWith(PREFIX)) return fail(res, 404, `Unknown route ${url.pathname}. Paths start with ${PREFIX}.`);

  const path = url.pathname.slice(PREFIX.length);
  const match = path.match(/^\/products(?:\/(\d+))?\/?$/);
  if (!match) return fail(res, 404, `Unknown route ${url.pathname}.`);
  const id = match[1] ? Number(match[1]) : null;

  await sleep(DELAY_MS);
  console.log(`${new Date().toISOString()} ${method} ${url.pathname}${url.search}`);

  try {
    // GET /products?page=&limit=&search=&category=&status=
    if (method === "GET" && id === null) {
      const page = Math.max(1, Number(url.searchParams.get("page") || 1));
      const limit = Math.max(1, Number(url.searchParams.get("limit") || 10));
      const search = (url.searchParams.get("search") || "").trim().toLowerCase();
      const category = url.searchParams.get("category") || "";
      const status = url.searchParams.get("status") || "";

      const filtered = products
        .filter((p) => (search ? p.name.toLowerCase().includes(search) : true))
        .filter((p) => (category ? p.category === category : true))
        .filter((p) => (status ? p.status === status : true))
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const list = filtered.slice((page - 1) * limit, page * limit);
      return send(res, 200, { success: true, message: "OK", data: { list, meta: { total, page, limit, totalPages } } });
    }

    // GET /products/:id
    if (method === "GET") {
      const product = products.find((p) => p.id === id);
      if (!product) return fail(res, 404, `Product ${id} was not found.`);
      return send(res, 200, { success: true, message: "OK", data: product });
    }

    // POST /products
    if (method === "POST" && id === null) {
      const body = await readBody(req);
      const errors = validate(body);
      if (Object.keys(errors).length) return fail(res, 400, "Validation failed.", errors);
      const now = new Date().toISOString();
      const product = {
        id: nextId++,
        name: body.name.trim(),
        category: body.category,
        price: body.price,
        stock: body.stock,
        status: body.status,
        description: body.description || undefined,
        createdAt: now,
        updatedAt: now,
      };
      products = [product, ...products];
      return send(res, 201, { success: true, message: "Product created.", data: product });
    }

    // PATCH /products/:id
    if (method === "PATCH" && id !== null) {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return fail(res, 404, `Product ${id} was not found.`);
      const body = await readBody(req);
      const errors = validate(body);
      if (Object.keys(errors).length) return fail(res, 400, "Validation failed.", errors);
      const updated = {
        ...products[index],
        name: body.name.trim(),
        category: body.category,
        price: body.price,
        stock: body.stock,
        status: body.status,
        description: body.description || undefined,
        updatedAt: new Date().toISOString(),
      };
      products[index] = updated;
      return send(res, 200, { success: true, message: "Product updated.", data: updated });
    }

    // DELETE /products/:id
    if (method === "DELETE" && id !== null) {
      if (!products.some((p) => p.id === id)) return fail(res, 404, `Product ${id} was not found.`);
      products = products.filter((p) => p.id !== id);
      return send(res, 200, { success: true, message: "Product deleted.", data: null });
    }

    return fail(res, 405, `${method} is not allowed on ${url.pathname}.`);
  } catch (error) {
    return fail(res, 400, error instanceof Error ? error.message : "Bad request.");
  }
});

server.listen(PORT, () => {
  console.log(`Mock API listening on http://localhost:${PORT}${PREFIX}/products  (delay ${DELAY_MS} ms)`);
  console.log("Set NEXT_PUBLIC_USE_MOCK=false in .env.local so the frontend calls this server.");
});
