import { MetadataRoute } from "next";

const SITE_URL = "https://northsidegarage.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/packages`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  return routes;
}
