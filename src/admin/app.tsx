import type { StrapiApp } from "@strapi/strapi/admin";

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    // Conditional field visibility for menu-link component is handled
    // directly in the component schema and MenuLinkForm component.
    // No registration needed here - Strapi automatically uses component forms.
  },
};
