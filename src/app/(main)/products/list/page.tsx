"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/common/StateBlocks";
import TopHeading from "@/components/common/TopHeading";
import ProductsTable from "@/components/products/ProductsTable";
import useGetProductsList from "@/hooks/API/products/useGetProductsList";
import useProductMutations from "@/hooks/API/products/useProductMutations";
import { useToast } from "@/providers/ToastProvider";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES, type Product, type ProductListParams } from "@/types/product";
import { toApiError } from "@/utils/api-error";

// The list screen. Four situations are handled, in this order: loading, error, empty, data.
export default function ProductsListPage() {
  const router = useRouter();
  const { showToast } = useToast();

  // Screen-only state lives in the component. API data lives in the hook, nowhere else.
  const [filters, setFilters] = useState<ProductListParams>({ page: 1, limit: 10, search: "", category: "", status: "" });

  const { products, meta, isProductsLoading, isProductsFetching, isProductsError, productsError, refetchProducts } = useGetProductsList(filters);
  const { deleteProduct } = useProductMutations();

  // Any filter change goes back to page 1.
  const updateFilter = (patch: Partial<ProductListParams>) => setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  const handleDelete = (product: Product) => {
    confirmDialog({
      message: `Delete "${product.name}"? This cannot be undone.`,
      header: "Delete product",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Yes",
      rejectLabel: "No",
      acceptClassName: "p-button-danger",
      accept: async () => {
        try {
          await deleteProduct.mutateAsync(product.id);
          showToast("success", "Product deleted");
        } catch (error) {
          showToast("error", "Could not delete", toApiError(error).message);
        }
      },
    });
  };

  const hasFilters = Boolean(filters.search || filters.category || filters.status);

  return (
    <>
      <TopHeading
        title="Products"
        breadcrumb={["Home", "Products"]}
        actions={<Button label="New product" icon="pi pi-plus" onClick={() => router.push("/products/create")} />}
      />

      <section className="card-surface">
        <div className="products-filters">
          <InputText
            placeholder="Search by name"
            value={filters.search ?? ""}
            onChange={(e) => updateFilter({ search: e.target.value })}
            aria-label="Search by name"
          />
          <Dropdown
            value={filters.category || null}
            options={PRODUCT_CATEGORIES}
            placeholder="All categories"
            showClear
            onChange={(e) => updateFilter({ category: e.value ?? "" })}
            aria-label="Category"
          />
          <Dropdown
            value={filters.status || null}
            options={PRODUCT_STATUSES}
            placeholder="All statuses"
            showClear
            onChange={(e) => updateFilter({ status: e.value ?? "" })}
            aria-label="Status"
          />
        </div>

        {isProductsLoading ? (
          <LoadingState message="Loading products..." />
        ) : isProductsError ? (
          <ErrorState message={productsError?.message ?? "Could not load products."} onRetry={() => refetchProducts()} />
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            message={hasFilters ? "Try a different search or clear the filters." : "Create the first product to see it here."}
            action={
              hasFilters ? (
                <Button label="Clear filters" outlined onClick={() => setFilters({ page: 1, limit: filters.limit, search: "", category: "", status: "" })} />
              ) : (
                <Button label="New product" icon="pi pi-plus" onClick={() => router.push("/products/create")} />
              )
            }
          />
        ) : (
          <ProductsTable
            products={products}
            meta={meta}
            isFetching={isProductsFetching}
            onPageChange={(page, limit) => setFilters((prev) => ({ ...prev, page, limit }))}
            onDelete={handleDelete}
          />
        )}
      </section>
    </>
  );
}
