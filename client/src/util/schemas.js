export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Shafisons",
  "alternateName": "Shafisons.pk",
  "url": "https://shafisons.pk",
  "logo": "https://shafisons.pk/index-logo.png",
  "description": "Premium curtain fabrics, custom drapery, modern blinds, floor seating and upholstery solutions in Quetta, Pakistan. Trusted since 1975.",
  "foundingDate": "1975",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jinnah Road",
    "addressLocality": "Quetta",
    "addressRegion": "Balochistan",
    "addressCountry": "PK"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+92-81-123-4567",
    "contactType": "customer service",
    "availableLanguage": ["English", "Urdu"]
  },
  "sameAs": [
    "https://facebook.com/shafisons",
    "https://instagram.com/shafisons"
  ]
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Shafisons.pk",
  "url": "https://shafisons.pk",
  "description": "Premium curtain fabrics, blinds, and interior solutions in Pakistan",
  "publisher": {
    "@type": "Organization",
    "name": "Shafisons"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://shafisons.pk/shop?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});