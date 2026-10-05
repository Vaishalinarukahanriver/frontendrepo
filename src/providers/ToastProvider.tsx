"use client";
import { Toast } from "primereact/toast";
import { createContext, useCallback, useContext, useMemo, useRef } from "react";

type Severity = "success" | "info" | "warn" | "error";

interface ToastContextValue {
  showToast: (severity: Severity, summary: string, detail?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// One Toast element for the whole app. Any component calls useToast().showToast(...).
export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastRef = useRef<Toast>(null);

  const showToast = useCallback((severity: Severity, summary: string, detail?: string) => {
    toastRef.current?.show({ severity, summary, detail, life: 4000 });
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      <Toast ref={toastRef} position="top-right" />
      {children}
    </ToastContext.Provider>
  );
}

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside <ToastProvider>.");
  return context;
};
