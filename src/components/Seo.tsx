import React, { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
  canonicalPath?: string;
  structuredData?: Record<string, any>;
};

const Seo: React.FC<SeoProps> = ({ title, description, canonicalPath, structuredData }) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Meta description
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description.slice(0, 160));
    }

    // Canonical link
    const href = (() => {
      try {
        const loc = window.location;
        if (!canonicalPath) return loc.href;
        if (canonicalPath.startsWith("http")) return canonicalPath;
        return `${loc.origin}${canonicalPath}`;
      } catch {
        return canonicalPath || "/";
      }
    })();

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", href);

    // Structured data (JSON-LD)
    const ldId = "structured-data";
    const prev = document.getElementById(ldId);
    if (prev) prev.remove();

    const data =
      structuredData ?? {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: title,
        url: href.replace(/\/$/, ""),
      };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = ldId;
    script.text = JSON.stringify(data);
    document.head.appendChild(script);

    return () => {
      // Keep SEO tags persistent across SPA navigations
    };
  }, [title, description, canonicalPath, structuredData]);

  return null;
};

export default Seo;
