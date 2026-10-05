"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";

const NAV = [{ label: "Products", href: "/products/list", match: "/products" }];
const THEME_KEY = "theme";

export default function AppTopbar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Read the saved theme once on the client (localStorage does not exist on the server).
  // Also mark the document as hydrated: until this runs, typing or clicking does nothing because
  // React has not attached its event handlers yet. Playwright tests wait for this attribute.
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "true");
    const saved = window.localStorage.getItem(THEME_KEY);
    if (saved === "dark") setTheme("dark");
  }, []);

  // Apply it: global.scss switches every colour token on [data-theme="dark"].
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <header className="app-topbar">
      <Link href="/products/list" className="app-topbar__brand">
        Divii Starter
      </Link>
      <nav className="app-topbar__nav" aria-label="Main">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`app-topbar__link${pathname.startsWith(item.match) ? " app-topbar__link--active" : ""}`}
          >
            {item.label}
          </Link>
        ))}
        <Button
          type="button"
          icon={theme === "dark" ? "pi pi-sun" : "pi pi-moon"}
          text
          rounded
          aria-label="Toggle dark mode"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        />
      </nav>
    </header>
  );
}
