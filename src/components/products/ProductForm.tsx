"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useProductMutations from "@/hooks/API/products/useProductMutations";
import { useToast } from "@/providers/ToastProvider";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES, type Product, type ProductPayload } from "@/types/product";
import { toApiError } from "@/utils/api-error";
import { PRODUCT_MESSAGES, PRODUCT_RULES } from "@/utils/validation/product.rules";

interface ProductFormProps {
  mode: "create" | "edit";
  product?: Product; // required in edit mode
}

// Form values: numbers can be null while the user is typing, so they are typed separately.
interface ProductFormValues {
  name: string;
  category: ProductPayload["category"] | null;
  price: number | null;
  stock: number | null;
  status: ProductPayload["status"] | null;
  description: string;
}

const toFormValues = (product?: Product): ProductFormValues => ({
  name: product?.name ?? "",
  category: product?.category ?? null,
  price: product?.price ?? null,
  stock: product?.stock ?? null,
  status: product?.status ?? "ACTIVE",
  description: product?.description ?? "",
});

export default function ProductForm({ mode, product }: ProductFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { createProduct, updateProduct } = useProductMutations();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({ defaultValues: toFormValues(product), mode: "onTouched" });

  const isSaving = isSubmitting || createProduct.isPending || updateProduct.isPending;

  const onSubmit = async (values: ProductFormValues) => {
    setServerError(null);
    // Frontend validation already passed, so the nulls are gone here.
    const payload: ProductPayload = {
      name: values.name.trim(),
      category: values.category as ProductPayload["category"],
      price: values.price as number,
      stock: values.stock as number,
      status: values.status as ProductPayload["status"],
      description: values.description.trim() || undefined,
    };

    try {
      if (mode === "create") {
        await createProduct.mutateAsync(payload);
        showToast("success", "Product created");
      } else {
        await updateProduct.mutateAsync({ id: (product as Product).id, payload });
        showToast("success", "Product updated");
      }
      router.push("/products/list");
    } catch (error) {
      const apiError = toApiError(error);
      // Field errors from the API go next to the field; anything else goes in the banner.
      if (apiError.errors) {
        Object.entries(apiError.errors).forEach(([field, message]) => {
          setError(field as keyof ProductFormValues, { type: "server", message });
        });
      }
      setServerError(apiError.message);
      showToast("error", "Could not save", apiError.message);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="product-form__server-error" role="alert">
          {serverError}
        </div>
      )}

      <div className="product-form__field">
        <label htmlFor="name" className="product-form__label product-form__label--required">
          Name
        </label>
        <Controller
          name="name"
          control={control}
          rules={{
            validate: (value) => {
              const trimmed = value.trim();
              if (!trimmed) return PRODUCT_MESSAGES.nameRequired;
              if (trimmed.length < PRODUCT_RULES.name.min || trimmed.length > PRODUCT_RULES.name.max) return PRODUCT_MESSAGES.nameLength;
              return true;
            },
          }}
          render={({ field }) => <InputText id="name" {...field} maxLength={PRODUCT_RULES.name.max} invalid={!!errors.name} autoFocus />}
        />
        {errors.name && <small className="product-form__error">{errors.name.message}</small>}
      </div>

      <div className="product-form__field">
        <label htmlFor="category" className="product-form__label product-form__label--required">
          Category
        </label>
        <Controller
          name="category"
          control={control}
          rules={{ required: PRODUCT_MESSAGES.categoryRequired }}
          render={({ field }) => (
            <Dropdown id="category" {...field} options={PRODUCT_CATEGORIES} placeholder="Select a category" invalid={!!errors.category} />
          )}
        />
        {errors.category && <small className="product-form__error">{errors.category.message}</small>}
      </div>

      <div className="product-form__field">
        <label htmlFor="price" className="product-form__label product-form__label--required">
          Price
        </label>
        <Controller
          name="price"
          control={control}
          rules={{
            validate: (value) => {
              if (value === null || value === undefined) return PRODUCT_MESSAGES.priceRequired;
              if (!Number.isInteger(value) || value < PRODUCT_RULES.price.min || value > PRODUCT_RULES.price.max) return PRODUCT_MESSAGES.priceRange;
              return true;
            },
          }}
          render={({ field }) => (
            <InputNumber
              inputId="price"
              value={field.value}
              onValueChange={(e) => field.onChange(e.value ?? null)}
              onBlur={field.onBlur}
              min={PRODUCT_RULES.price.min}
              max={PRODUCT_RULES.price.max}
              useGrouping
              invalid={!!errors.price}
            />
          )}
        />
        {errors.price && <small className="product-form__error">{errors.price.message}</small>}
      </div>

      <div className="product-form__field">
        <label htmlFor="stock" className="product-form__label product-form__label--required">
          Stock
        </label>
        <Controller
          name="stock"
          control={control}
          rules={{
            validate: (value) => {
              if (value === null || value === undefined) return PRODUCT_MESSAGES.stockRequired;
              if (!Number.isInteger(value) || value < PRODUCT_RULES.stock.min || value > PRODUCT_RULES.stock.max) return PRODUCT_MESSAGES.stockRange;
              return true;
            },
          }}
          render={({ field }) => (
            <InputNumber
              inputId="stock"
              value={field.value}
              onValueChange={(e) => field.onChange(e.value ?? null)}
              onBlur={field.onBlur}
              min={PRODUCT_RULES.stock.min}
              max={PRODUCT_RULES.stock.max}
              useGrouping
              invalid={!!errors.stock}
            />
          )}
        />
        {errors.stock && <small className="product-form__error">{errors.stock.message}</small>}
      </div>

      <div className="product-form__field">
        <label htmlFor="status" className="product-form__label product-form__label--required">
          Status
        </label>
        <Controller
          name="status"
          control={control}
          rules={{ required: PRODUCT_MESSAGES.statusRequired }}
          render={({ field }) => <Dropdown id="status" {...field} options={PRODUCT_STATUSES} placeholder="Select a status" invalid={!!errors.status} />}
        />
        {errors.status && <small className="product-form__error">{errors.status.message}</small>}
      </div>

      <div className="product-form__field product-form__field--full">
        <label htmlFor="description" className="product-form__label">
          Description
        </label>
        <Controller
          name="description"
          control={control}
          rules={{ maxLength: { value: PRODUCT_RULES.description.max, message: PRODUCT_MESSAGES.descriptionLength } }}
          render={({ field }) => (
            <InputTextarea id="description" {...field} rows={3} autoResize maxLength={PRODUCT_RULES.description.max} invalid={!!errors.description} />
          )}
        />
        {errors.description && <small className="product-form__error">{errors.description.message}</small>}
      </div>

      <div className="product-form__actions">
        <Button type="button" label="Cancel" outlined onClick={() => router.push("/products/list")} disabled={isSaving} />
        {/* Disabled while saving so it cannot be clicked twice and create two records. */}
        <Button type="submit" label="Save" icon="pi pi-check" loading={isSaving} disabled={isSaving} />
      </div>
    </form>
  );
}
