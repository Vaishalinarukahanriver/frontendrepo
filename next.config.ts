import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    // Lets every SCSS file write `@use "variables" as *;` instead of a relative path.
    includePaths: [path.join(process.cwd(), "src", "styles")],
  },
};

export default nextConfig;
