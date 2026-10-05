"use client";
import { useQuery } from "@tanstack/react-query";
import productsService from "@/api-services/ProductsService";
import { QUERIES } from "@/utils/api-integration";
import { toApiError } from "@/utils/api-error";

// `id` is null until the route param is known; the query waits (enabled: false).
const useGetProduct = (id: number | null) => {
  const query = useQuery({
    queryKey: [QUERIES.PRODUCT, id],
    queryFn: () => productsService.getProduct(id as number),
    enabled: id !== null,
  });

  return {
    product: query.data?.data ?? null,
    isProductLoading: query.isPending && id !== null,
    isProductError: query.isError,
    productError: query.error ? toApiError(query.error) : null,
    refetchProduct: query.refetch,
  };
};

export default useGetProduct;
