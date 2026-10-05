"use client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { ErrorState, LoadingState } from "@/components/common/StateBlocks";
import TopHeading from "@/components/common/TopHeading";
import useGetProduct from "@/hooks/API/products/useGetProduct";
import useProductMutations from "@/hooks/API/products/useProductMutations";
import { useToast } from "@/providers/ToastProvider";
import { toApiError } from "@/utils/api-error";
import { formatDateTime, formatNumber } from "@/utils/formatters";

const CATEGORY_LABEL = { BOOK: "Book", STATIONERY: "Stationery", DIGITAL: "Digital" } as const;

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const id = Number(params.id);
  const { product, isProductLoading, isProductError, productError, refetchProduct } = useGetProduct(Number.isNaN(id) ? null : id);
  const { deleteProduct } = useProductMutations();

  const handleDelete = () => {
    if (!product) return;
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
          router.push("/products/list");
        } catch (error) {
          showToast("error", "Could not delete", toApiError(error).message);
        }
      },
    });
  };

  if (isProductLoading) {
    return (
      <>
        <TopHeading title="Product" breadcrumb={["Home", "Products", "Details"]} />
        <section className="card-surface">
          <LoadingState message="Loading product..." />
        </section>
      </>
    );
  }

  if (isProductError || !product) {
    return (
      <>
        <TopHeading title="Product" breadcrumb={["Home", "Products", "Details"]} />
        <section className="card-surface">
          <ErrorState message={productError?.message ?? "Product not found."} onRetry={() => refetchProduct()} />
        </section>
      </>
    );
  }

  return (
    <>
      <TopHeading
        title={product.name}
        breadcrumb={["Home", "Products", "Details"]}
        actions={
          <>
            <Button label="Back" icon="pi pi-arrow-left" outlined onClick={() => router.push("/products/list")} />
            <Button label="Edit" icon="pi pi-pencil" onClick={() => router.push(`/products/edit/${product.id}`)} />
            <Button label="Delete" icon="pi pi-trash" severity="danger" outlined onClick={handleDelete} loading={deleteProduct.isPending} />
          </>
        }
      />
      <section className="card-surface">
        <dl className="product-details">
          <div className="product-details__row">
            <dt className="product-details__label">Category</dt>
            <dd className="product-details__value">{CATEGORY_LABEL[product.category]}</dd>
          </div>
          <div className="product-details__row">
            <dt className="product-details__label">Status</dt>
            <dd className="product-details__value">
              <span className={`status-pill status-pill--${product.status.toLowerCase()}`}>{product.status === "ACTIVE" ? "Active" : "Inactive"}</span>
            </dd>
          </div>
          <div className="product-details__row">
            <dt className="product-details__label">Price</dt>
            <dd className="product-details__value">{formatNumber(product.price)}</dd>
          </div>
          <div className="product-details__row">
            <dt className="product-details__label">Stock</dt>
            <dd className="product-details__value">{formatNumber(product.stock)}</dd>
          </div>
          <div className="product-details__row product-details__row--full">
            <dt className="product-details__label">Description</dt>
            <dd className="product-details__value">{product.description || "-"}</dd>
          </div>
          <div className="product-details__row">
            <dt className="product-details__label">Created</dt>
            <dd className="product-details__value">{formatDateTime(product.createdAt)}</dd>
          </div>
          <div className="product-details__row">
            <dt className="product-details__label">Updated</dt>
            <dd className="product-details__value">{formatDateTime(product.updatedAt)}</dd>
          </div>
        </dl>
      </section>
    </>
  );
}
