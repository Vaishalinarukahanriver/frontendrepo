// Layer 1 of 3: every endpoint path and every query key lives here.
// Layer 2 is src/api-services (the axios call). Layer 3 is src/hooks/API (what the screen uses).

export const API_ENDPOINTS = {
  PRIVATE: {
    PRODUCTS: "/products",
    PRODUCT_BY_ID: (id: number | string) => `/products/${id}`,
  },
};

// TanStack Query keys. One key per list, one per detail.
export const QUERIES = {
  PRODUCTS: "products",
  PRODUCT: "product",
};

// HW1 uses mock data (default). HW2 sets NEXT_PUBLIC_USE_MOCK=false in .env.local and calls the real API.
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

// Builds "?page=1&limit=10&search=abc" and skips empty values.
export const getQueries = (params: object): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.append(key, String(value));
  });
  return searchParams.toString();
};
