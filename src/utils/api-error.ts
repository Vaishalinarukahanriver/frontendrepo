// One error class for the whole frontend. Services throw it, hooks expose it, screens show
// `error.message`, and forms map `error.errors` onto fields.
export class ApiRequestError extends Error {
  statusCode: number;
  errors?: Record<string, string>;

  constructor(message: string, statusCode: number, errors?: Record<string, string>) {
    super(message);
    this.name = "ApiRequestError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const toApiError = (error: unknown): ApiRequestError => {
  if (error instanceof ApiRequestError) return error;
  if (error instanceof Error) return new ApiRequestError(error.message, 0);
  return new ApiRequestError("Something went wrong.", 0);
};
