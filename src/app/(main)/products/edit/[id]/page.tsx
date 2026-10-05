"use client";
import { useParams } from "next/navigation";
import { ErrorState, LoadingState } from "@/components/common/StateBlocks";
import TopHeading from "@/components/common/TopHeading";
import ProductForm from "@/components/products/ProductForm";
import useGetProduct from "@/hooks/API/products/useGetProduct";

// Dynamic route: the folder is [id], so /products/edit/7 gives params.id === "7".
export default function ProductEditPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const { product, isProductLoading, isProductError, productError, refetchProduct } = useGetProduct(Number.isNaN(id) ? null : id);

  return (
    <>
      <TopHeading title="Edit product" breadcrumb={["Home", "Products", "Edit"]} />
      <section className="card-surface">
        {isProductLoading ? (
          <LoadingState message="Loading product..." />
        ) : isProductError || !product ? (
          <ErrorState message={productError?.message ?? "Product not found."} onRetry={() => refetchProduct()} />
        ) : (
          // key forces a fresh form when the id changes, so defaultValues are re-read.
          <ProductForm key={product.id} mode="edit" product={product} />
        )}
      </section>
    </>
  );
}
