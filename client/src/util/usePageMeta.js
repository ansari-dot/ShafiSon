import { useEffect } from "react";

const SITE_NAME = "Shafisons";
const SITE_URL  = "https://shafisons.com";
const DEFAULT_IMG = `${SITE_URL}/index-logo.png`;

function setMeta(name, content, attr = "name") {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export default function usePageMeta({
  title,
  description,
  keywords,
  canonical,
  image,
  type = "website",
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    document.title = fullTitle;

    // Basic
    setMeta("description", description);
    setMeta("keywords", keywords);
    setMeta("robots", "index, follow");
    setMeta("author", SITE_NAME);

    // Canonical
    setLink("canonical", canonical ? `${SITE_URL}${canonical}` : undefined);

    // Open Graph
    setMeta("og:type",        type,                    "property");
    setMeta("og:site_name",   SITE_NAME,               "property");
    setMeta("og:title",       fullTitle,               "property");
    setMeta("og:description", description,             "property");
    setMeta("og:image",       image || DEFAULT_IMG,    "property");
    setMeta("og:url",         canonical ? `${SITE_URL}${canonical}` : SITE_URL, "property");

    // Twitter Card
    setMeta("twitter:card",        "summary_large_image");
    setMeta("twitter:title",       fullTitle);
    setMeta("twitter:description", description);
    setMeta("twitter:image",       image || DEFAULT_IMG);
  }, [title, description, keywords, canonical, image, type]);
}
