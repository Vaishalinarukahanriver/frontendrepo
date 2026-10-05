import type { ReactNode } from "react";

interface TopHeadingProps {
  title: string;
  breadcrumb?: string[]; // e.g. ["Products", "New product"]
  actions?: ReactNode; // buttons on the right
}

// Reuse this on every screen instead of writing a new header each time.
export default function TopHeading({ title, breadcrumb = [], actions }: TopHeadingProps) {
  return (
    <div className="top-heading">
      <div>
        <h1 className="top-heading__title">{title}</h1>
        {breadcrumb.length > 0 && (
          <div className="top-heading__breadcrumb">
            {breadcrumb.map((crumb) => (
              <span key={crumb}>{crumb}</span>
            ))}
          </div>
        )}
      </div>
      {actions && <div className="top-heading__actions">{actions}</div>}
    </div>
  );
}
