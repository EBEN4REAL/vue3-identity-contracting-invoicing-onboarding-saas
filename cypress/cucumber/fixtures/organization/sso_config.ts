import { OrganizationOIDCRead } from "../../../../src/iam/iam.types";

const organizationSSOConfig: { [key: string]: OrganizationOIDCRead } = {
  "001-sso-enabled": {
    client_id: "qQxcEkIBM3LubtAgkkVLBKhPmEhOkVfe",
    client_secret:
      "Ba993evc3vak9wjb9O41uQf5nLMdaGl3cxjwT9QxVDjElmuAAGv3AS0MlEzkpFl9",
    server_metadata_url:
      "https://dev-mp5y3htk6v3y0llv.eu.auth0.com/.well-known/openid-configuration",
    enabled: true,
    config: {
      callback_url: "http://localhost/login-sso-callback",
      authorization_endpoint: "http://localhost/oauth2/authorize",
      end_session_endpoint: "http://localhost/oauth2/logout",
    },
  },
  "001-sso-disabled": {
    client_id: "qQxcEkIBM3LubtAgkkVLBKhPmEhOkVfe",
    client_secret:
      "Ba993evc3vak9wjb9O41uQf5nLMdaGl3cxjwT9QxVDjElmuAAGv3AS0MlEzkpFl9",
    server_metadata_url:
      "https://dev-mp5y3htk6v3y0llv.eu.auth0.com/.well-known/openid-configuration",
    enabled: false,
    config: {
      callback_url: "http://localhost/login-sso-callback",
      authorization_endpoint: "http://localhost/oauth2/authorize",
      end_session_endpoint: "http://localhost/oauth2/logout",
    },
  },
};

export default organizationSSOConfig;
