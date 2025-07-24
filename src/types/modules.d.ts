declare module "react-calendar-timeline/lib";
declare module "lodash";
declare module "numeral";
declare module "nprogress";
declare module "react-color";
declare module "prop-types";

// NextAuth type extensions
declare module "next-auth" {
  interface Session {
    token?: string;
  }

  interface User {
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
