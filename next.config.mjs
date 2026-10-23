/** @type {import('next').NextConfig} */
const nextConfig = {
  // Experience, projects and contact now live as sections of the home page.
  async redirects() {
    return ["experience", "projects", "contact"].map((section) => ({
      source: `/${section}`,
      destination: `/#${section}`,
      permanent: false,
    }));
  },
};

export default nextConfig;
