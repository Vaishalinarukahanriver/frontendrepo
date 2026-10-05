// The response envelope every endpoint returns. Your own backend should return the same shape,
// so the frontend never has to guess where the data is (no `data.data.data`).

export interface ListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  success: true;
  message: string;
  data: {
    list: T[];
    meta: ListMeta;
  };
}

// Error body: `errors` maps a field name to a message, so forms can show it next to the field.
export interface ApiErrorBody {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string>;
}
