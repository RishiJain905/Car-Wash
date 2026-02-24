import { MetadataRoute } from "next";

const SITE_URL = "https://northsidegarage.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/booking-confirmation"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
