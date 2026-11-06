
const SITE_URL = "https://www.mobilecarservices.com.au";

const BUSINESS_NAME = "Mobile Car Services";

const BUSINESS_DESCRIPTION =
  "Mobile Car Services provides mobile automotive assistance across Melbourne West, including car battery replacement, battery testing, jump start assistance, starter motor replacement and alternator replacement at your vehicle's location.";

const PHONE = "+61 467 037 886";

const LOGO_URL = `${SITE_URL}/images/logo/logo.png`;

/* ============================================================
   AUTOMOTIVE BUSINESS SCHEMA
============================================================ */

export function getOrganizationSchema() {
  return {
    "@type": "AutoRepair",

    "@id": `${SITE_URL}/#organization`,

    name: BUSINESS_NAME,

    url: SITE_URL,

    description: BUSINESS_DESCRIPTION,

    telephone: PHONE,

    contactPoint: {
      "@id": `${SITE_URL}/#contact-point`,
    },

    logo: {
      "@type": "ImageObject",

      "@id": `${SITE_URL}/#logo`,

      url: LOGO_URL,

      contentUrl: LOGO_URL,

      width: 1254,

      height: 1254,

      caption: BUSINESS_NAME,
    },

    image: {
      "@id": `${SITE_URL}/#logo`,
    },

    areaServed: {
      "@type": "Place",

      name: "Melbourne West",
    },
  };
}

/* ============================================================
   CONTACT POINT SCHEMA
============================================================ */

export function getContactPointSchema() {
  return {
    "@type": "ContactPoint",

    "@id": `${SITE_URL}/#contact-point`,

    telephone: PHONE,

    contactType: "customer service",

    areaServed: {
      "@type": "Place",

      name: "Melbourne West",
    },

    availableLanguage: ["English"],
  };
}

/* ============================================================
   WEBSITE SCHEMA
============================================================ */

export function getWebsiteSchema() {
  return {
    "@type": "WebSite",

    "@id": `${SITE_URL}/#website`,

    url: SITE_URL,

    name: BUSINESS_NAME,

    description: BUSINESS_DESCRIPTION,

    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },

    inLanguage: "en-AU",
  };
}

/* ============================================================
   GLOBAL STRUCTURED DATA
============================================================ */

export function getGlobalStructuredData() {
  return {
    "@context": "https://schema.org",

    "@graph": [
      getOrganizationSchema(),

      getContactPointSchema(),

      getWebsiteSchema(),
    ],
  };
}
