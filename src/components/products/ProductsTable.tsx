"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTablePageEvent } from "primereact/datatable";
import type { ListMeta } from "@/types/api";
import type { Product } from "@/types/product";
import { formatDate, formatNumber } from "@/utils/formatters";

interface ProductsTableProps {
  products: Product[];
  meta?: ListMeta;
  isFetching: boolean;
  onPageChange: (page: number, limit: number) => void;
  onDelete: (product: Product) => void;
}

const CATEGORY_LABEL: Record<Product["category"], string> = { BOOK: "Book", STATIONERY: "Stationery", DIGITAL: "Digital" };

export default function ProductsTable({ products, meta, isFetching, onPageChange, onDelete }: ProductsTableProps) {
  const router = useRouter();

  // PrimeReact pages are 0-based ("first" is the row offset); the API is 1-based.
  const handlePage = (event: DataTablePageEvent) => {
    const rows = event.rows ?? 10;
    const page = Math.floor((event.first ?? 0) / rows) + 1;
    onPageChange(page, rows);
  };

  const limit = meta?.limit ?? 10;

  return (
    <div className="products-table">
      <DataTable
        value={products}
        dataKey="id"
        lazy
        paginator
        rows={limit}
        first={((meta?.page ?? 1) - 1) * limit}
        totalRecords={meta?.total ?? 0}
        onPage={handlePage}
        rowsPerPageOptions={[5, 10, 20]}
        loading={isFetching}
        stripedRows
      >
        <Column field="name" header="Name" body={(row: Product) => <span className="products-table__name">{row.name}</span>} />
        <Column field="category" header="Category" body={(row: Product) => CATEGORY_LABEL[row.category]} />
        <Column
          field="price"
          header="Price"
          align="right"
          body={(row: Product) => <span className="products-table__number">{formatNumber(row.price)}</span>}
        />
        <Column
          field="stock"
          header="Stock"
          align="right"
          body={(row: Product) => <span className="products-table__number">{formatNumber(row.stock)}</span>}
        />
        <Column
          field="status"
          header="Status"
          body={(row: Product) => (
            <span className={`status-pill status-pill--${row.status.toLowerCase()}`}>{row.status === "ACTIVE" ? "Active" : "Inactive"}</span>
          )}
        />
        <Column field="createdAt" header="Created" body={(row: Product) => formatDate(row.createdAt)} />
        <Column
          header=""
          align="right"
          body={(row: Product) => (
            <div className="products-table__actions">
              <Button icon="pi pi-eye" text rounded aria-label="View" tooltip="View" onClick={() => router.push(`/products/details/${row.id}`)} />
              <Button icon="pi pi-pencil" text rounded aria-label="Edit" tooltip="Edit" onClick={() => router.push(`/products/edit/${row.id}`)} />
              <Button icon="pi pi-trash" text rounded severity="danger" aria-label="Delete" tooltip="Delete" onClick={() => onDelete(row)} />
            </div>
          )}
        />
      </DataTable>
      {isFetching && products.length > 0 && <div className="products-table__fetching">Refreshing...</div>}
    </div>
  );
}
