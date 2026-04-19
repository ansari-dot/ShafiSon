import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = "Shafisons | Premium Curtains, Blinds & Interior Fabrics — Quetta",
  description = "Shafisons offers premium curtain fabrics, custom drapery, modern blinds, floor seating, sofa fabrics & upholstery solutions in Quetta, Pakistan. Trusted since 1975.",
  keywords = "curtain fabric Quetta, blinds Pakistan, sofa fabric, upholstery fabric, floor seating, majlis design, interior fabrics, custom drapery, Shafisons",
  canonical = "https://shafisons.pk/",
  image = "https://shafisons.pk/index-logo.png",
  type = "website"
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content="Shafisons" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;