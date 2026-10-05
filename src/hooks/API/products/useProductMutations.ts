"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import productsService from "@/api-services/ProductsService";
import type { ProductPayload } from "@/types/product";
import { QUERIES } from "@/utils/api-integration";

// Create / update / delete. After any of them succeeds, the list and the detail are marked stale
// so the next screen shows fresh data without a manual refetch.
const useProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [QUERIES.PRODUCTS] });
    queryClient.invalidateQueries({ queryKey: [QUERIES.PRODUCT] });
  };

  const createProduct = useMutation({
    mutationFn: (payload: ProductPayload) => productsService.createProduct(payload),
    onSuccess: invalidate,
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ProductPayload }) => productsService.updateProduct(id, payload),
    onSuccess: invalidate,
  });

  const deleteProduct = useMutation({
    mutationFn: (id: number) => productsService.deleteProduct(id),
    onSuccess: invalidate,
  });

  return { createProduct, updateProduct, deleteProduct };
};

export default useProductMutations;
