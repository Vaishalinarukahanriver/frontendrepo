"use client";
import TopHeading from "@/components/common/TopHeading";
import ProductForm from "@/components/products/ProductForm";

export default function ProductCreatePage() {
  return (
    <>
      <TopHeading title="New product" breadcrumb={["Home", "Products", "New product"]} />
      <section className="card-surface">
        <ProductForm mode="create" />
      </section>
    </>
  );
}
