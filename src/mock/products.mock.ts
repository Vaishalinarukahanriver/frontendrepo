// In-browser fake API for HW1. It behaves like a real backend: paging, search, filters,
// validation errors with the same shape, a 404 for a missing id, and a small delay so you
// can SEE the loading state. Nothing here talks to the network.
import seed from "@/mock/products.seed.json";
import type { ApiListResponse, ApiResponse } from "@/types/api";
import type { Product, ProductListParams, ProductPayload } from "@/types/product";
import { ApiRequestError } from "@/utils/api-error";
import { validateProductPayload } from "@/utils/validation/product.rules";

const DELAY_MS = 600;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Module-level state: survives navigation inside the app, resets on a full page reload.
let products: Product[] = (seed as Product[]).map((p) => ({ ...p }));
let nextId = products.length + 1;

const ok = <T,>(data: T, message = "OK"): ApiResponse<T> => ({ success: true, message, data });

export const mockProductsApi = {
  async getProducts(params: ProductListParams): Promise<ApiListResponse<Product>> {
    await delay(DELAY_MS);
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.max(1, params.limit ?? 10);
    const search = (params.search ?? "").trim().toLowerCase();

    const filtered = products
      .filter((p) => (search ? p.name.toLowerCase().includes(search) : true))
      .filter((p) => (params.category ? p.category === params.category : true))
      .filter((p) => (params.status ? p.status === params.status : true))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const list = filtered.slice((page - 1) * limit, page * limit);

    return { success: true, message: "OK", data: { list, meta: { total, page, limit, totalPages } } };
  },

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    await delay(DELAY_MS);
    const product = products.find((p) => p.id === id);
    if (!product) throw new ApiRequestError(`Product ${id} was not found.`, 404);
    return ok(product);
  },

  async createProduct(payload: ProductPayload): Promise<ApiResponse<Product>> {
    await delay(DELAY_MS);
    const errors = validateProductPayload(payload);
    if (Object.keys(errors).length) throw new ApiRequestError("Validation failed.", 400, errors);
    const now = new Date().toISOString();
    const product: Product = { ...payload, name: payload.name.trim(), id: nextId++, createdAt: now, updatedAt: now };
    products = [product, ...products];
    return ok(product, "Product created.");
  },

  async updateProduct(id: number, payload: ProductPayload): Promise<ApiResponse<Product>> {
    await delay(DELAY_MS);
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new ApiRequestError(`Product ${id} was not found.`, 404);
    const errors = validateProductPayload(payload);
    if (Object.keys(errors).length) throw new ApiRequestError("Validation failed.", 400, errors);
    const updated: Product = { ...products[index], ...payload, name: payload.name.trim(), updatedAt: new Date().toISOString() };
    products[index] = updated;
    return ok(updated, "Product updated.");
  },

  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    await delay(DELAY_MS);
    const exists = products.some((p) => p.id === id);
    if (!exists) throw new ApiRequestError(`Product ${id} was not found.`, 404);
    products = products.filter((p) => p.id !== id);
    return ok(null, "Product deleted.");
  },
};
