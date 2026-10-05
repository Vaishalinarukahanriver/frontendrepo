import AppTopbar from "@/components/layout/AppTopbar";

// Every screen inside (main) gets the top bar and the page container. The folder name in
// brackets groups routes without adding anything to the URL.
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AppTopbar />
      <main className="page-container">{children}</main>
    </>
  );
}
