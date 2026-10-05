import type { Metadata } from "next";
import { PrimeReactProvider } from "primereact/api";
import { ConfirmDialog } from "primereact/confirmdialog";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";

// PrimeReact base styles + a theme, then the project SCSS (the only global stylesheet).
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "@/styles/global.scss";

export const metadata: Metadata = {
  title: "Divii Frontend Starter",
  description: "Starter project for the AI Frontend Training homework.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css" rel="stylesheet" />
      </head>
      <body>
        <QueryProvider>
          <PrimeReactProvider>
            <ToastProvider>
              <ConfirmDialog />
              {children}
            </ToastProvider>
          </PrimeReactProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
