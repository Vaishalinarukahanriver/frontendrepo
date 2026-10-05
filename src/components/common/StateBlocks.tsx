import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";

// The three states every data screen must handle. Use these, don't invent new ones per page.

export function LoadingState({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="state-block" role="status" aria-live="polite">
      <ProgressSpinner style={{ width: 40, height: 40 }} strokeWidth="4" />
      <p className="state-block__message">{message}</p>
    </div>
  );
}

export function EmptyState({ title, message, action }: { title: string; message?: string; action?: React.ReactNode }) {
  return (
    <div className="state-block">
      <i className="pi pi-inbox state-block__icon" aria-hidden="true" />
      <h2 className="state-block__title">{title}</h2>
      {message && <p className="state-block__message">{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="state-block state-block--error" role="alert">
      <i className="pi pi-exclamation-triangle state-block__icon" aria-hidden="true" />
      <h2 className="state-block__title">Something went wrong</h2>
      <p className="state-block__message">{message}</p>
      {onRetry && <Button label="Try again" icon="pi pi-refresh" outlined onClick={onRetry} />}
    </div>
  );
}
