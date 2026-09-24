const SITE_URL = "https://carbatteryservices.com.au";

const BUSINESS_NAME = "Car Battery Service";

const BUSINESS_DESCRIPTION =
  "Car Battery Service provides mobile battery and vehicle electrical assistance across Melbourne West, including battery replacement, battery testing, jump start assistance, starter motor replacement and alternator replacement at your vehicle's location.";

const PHONE = "+61 467 037 886";

export function getOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS_NAME,
    url: SITE_URL,

    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/images/logo/logo.png`,
      contentUrl: `${SITE_URL}/images/logo/logo.png`,
      width: 1254,
      height: 1254,
      caption: BUSINESS_NAME,
    },

    image: {
      "@id": `${SITE_URL}/#logo`,
    },

    description: BUSINESS_DESCRIPTION,

    telephone: PHONE,

    areaServed: {
      "@type": "Place",
      name: "Melbourne West",
    },
  };
}

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

export function getGlobalStructuredData() {
  return {
    "@context": "https://schema.org",

    "@graph": [
      getOrganizationSchema(),
      getWebsiteSchema(),
    ],
  };
}