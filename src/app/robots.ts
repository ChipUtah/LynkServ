import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/provider/dashboard",
          "/api/",
        ],
      },
    ],
    sitemap: "https://lynkserv.com/sitemap.xml",
  };
}
