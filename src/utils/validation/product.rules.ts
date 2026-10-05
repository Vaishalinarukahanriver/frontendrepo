// The validation rules for a Product. These MUST match the backend rules (mock-api/server.mjs
// for the bundled API, or your own backend's DTO for HW2). If the two disagree, users see
// confusing errors. When you change one, change the other in the same commit.
import type { ProductPayload } from "@/types/product";

export const PRODUCT_RULES = {
  name: { min: 2, max: 50 },
  price: { min: 0, max: 100_000_000 },
  stock: { min: 0, max: 100_000 },
  description: { max: 300 },
} as const;

export const PRODUCT_MESSAGES = {
  nameRequired: "Name is required.",
  nameLength: `Name must be between ${PRODUCT_RULES.name.min} and ${PRODUCT_RULES.name.max} characters.`,
  categoryRequired: "Category is required.",
  priceRequired: "Price is required.",
  priceRange: `Price must be between 0 and ${PRODUCT_RULES.price.max.toLocaleString("en-US")}.`,
  stockRequired: "Stock is required.",
  stockRange: `Stock must be between 0 and ${PRODUCT_RULES.stock.max.toLocaleString("en-US")}.`,
  statusRequired: "Status is required.",
  descriptionLength: `Description must be at most ${PRODUCT_RULES.description.max} characters.`,
};

// Used by the in-browser mock so it rejects bad input exactly like a backend would.
export const validateProductPayload = (payload: Partial<ProductPayload>): Record<string, string> => {
  const errors: Record<string, string> = {};
  const name = (payload.name ?? "").trim();
  if (!name) errors.name = PRODUCT_MESSAGES.nameRequired;
  else if (name.length < PRODUCT_RULES.name.min || name.length > PRODUCT_RULES.name.max) errors.name = PRODUCT_MESSAGES.nameLength;

  if (!payload.category) errors.category = PRODUCT_MESSAGES.categoryRequired;

  if (payload.price === undefined || payload.price === null) errors.price = PRODUCT_MESSAGES.priceRequired;
  else if (!Number.isInteger(payload.price) || payload.price < PRODUCT_RULES.price.min || payload.price > PRODUCT_RULES.price.max) errors.price = PRODUCT_MESSAGES.priceRange;

  if (payload.stock === undefined || payload.stock === null) errors.stock = PRODUCT_MESSAGES.stockRequired;
  else if (!Number.isInteger(payload.stock) || payload.stock < PRODUCT_RULES.stock.min || payload.stock > PRODUCT_RULES.stock.max) errors.stock = PRODUCT_MESSAGES.stockRange;

  if (!payload.status) errors.status = PRODUCT_MESSAGES.statusRequired;

  if (payload.description && payload.description.length > PRODUCT_RULES.description.max) errors.description = PRODUCT_MESSAGES.descriptionLength;

  return errors;
};
