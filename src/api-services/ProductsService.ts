// Layer 2 of 3: one class per domain. The screen never imports this directly; it uses the hook.
// With NEXT_PUBLIC_USE_MOCK=true (HW1) every method goes to the in-browser mock instead of axios.
import CoreAPIService from "@/api-services/CoreAPIService";
import { mockProductsApi } from "@/mock/products.mock";
import type { ApiListResponse, ApiResponse } from "@/types/api";
import type { Product, ProductListParams, ProductPayload } from "@/types/product";
import { API_ENDPOINTS, USE_MOCK, getQueries } from "@/utils/api-integration";

const { PRODUCTS, PRODUCT_BY_ID } = API_ENDPOINTS.PRIVATE;

class ProductsService {
  private api = new CoreAPIService();

  getProducts(params: ProductListParams): Promise<ApiListResponse<Product>> {
    if (USE_MOCK) return mockProductsApi.getProducts(params);
    return this.api.get<ApiListResponse<Product>>(`${PRODUCTS}?${getQueries(params)}`);
  }

  getProduct(id: number): Promise<ApiResponse<Product>> {
    if (USE_MOCK) return mockProductsApi.getProduct(id);
    return this.api.get<ApiResponse<Product>>(PRODUCT_BY_ID(id));
  }

  createProduct(payload: ProductPayload): Promise<ApiResponse<Product>> {
    if (USE_MOCK) return mockProductsApi.createProduct(payload);
    return this.api.post<ApiResponse<Product>, ProductPayload>(PRODUCTS, payload);
  }

  updateProduct(id: number, payload: ProductPayload): Promise<ApiResponse<Product>> {
    if (USE_MOCK) return mockProductsApi.updateProduct(id, payload);
    return this.api.patch<ApiResponse<Product>, ProductPayload>(PRODUCT_BY_ID(id), payload);
  }

  deleteProduct(id: number): Promise<ApiResponse<null>> {
    if (USE_MOCK) return mockProductsApi.deleteProduct(id);
    return this.api.delete<ApiResponse<null>>(PRODUCT_BY_ID(id));
  }
}

const productsService = new ProductsService();
export default productsService;
