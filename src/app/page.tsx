import { redirect } from "next/navigation";

// The root URL just goes to the first list screen.
export default function HomePage() {
  redirect("/products/list");
}
