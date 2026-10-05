// Types for the example entity. Replace "Product" with your own entity for the homework,
// but keep the same shapes: one type for the record, one for the payload, one for list params.

export type ProductCategory = "BOOK" | "STATIONERY" | "DIGITAL";
export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  price: number; // whole currency units, no decimals
  stock: number;
  status: ProductStatus;
  description?: string;
  createdAt: string; // ISO string from the API
  updatedAt: string;
}

// What the frontend sends on create / edit. No id, no timestamps.
export type ProductPayload = Omit<Product, "id" | "createdAt" | "updatedAt">;

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: ProductCategory | "";
  status?: ProductStatus | "";
}

export const PRODUCT_CATEGORIES: { label: string; value: ProductCategory }[] = [
  { label: "Book", value: "BOOK" },
  { label: "Stationery", value: "STATIONERY" },
  { label: "Digital", value: "DIGITAL" },
];

export const PRODUCT_STATUSES: { label: string; value: ProductStatus }[] = [
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];
