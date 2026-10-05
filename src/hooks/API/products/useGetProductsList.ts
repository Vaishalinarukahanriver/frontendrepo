"use client";
// Layer 3 of 3: the hook the list screen uses. Copy this file for your own entity.
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import productsService from "@/api-services/ProductsService";
import type { ProductListParams } from "@/types/product";
import { QUERIES } from "@/utils/api-integration";
import { toApiError } from "@/utils/api-error";

const useGetProductsList = (params: ProductListParams) => {
  const { page = 1, limit = 10, search = "", category = "", status = "" } = params;

  const query = useQuery({
    // Every value that changes the result is part of the key, so a new page or search refetches.
    queryKey: [QUERIES.PRODUCTS, { page, limit, search, category, status }],
    queryFn: () => productsService.getProducts({ page, limit, search, category, status }),
    // Keeps the old rows on screen while the next page loads, instead of flashing empty.
    placeholderData: keepPreviousData,
  });

  return {
    products: query.data?.data.list ?? [],
    meta: query.data?.data.meta,
    isProductsLoading: query.isPending, // first load: nothing to show yet
    isProductsFetching: query.isFetching, // background refresh: rows still visible
    isProductsError: query.isError,
    productsError: query.error ? toApiError(query.error) : null,
    refetchProducts: query.refetch,
  };
};

export default useGetProductsList;
