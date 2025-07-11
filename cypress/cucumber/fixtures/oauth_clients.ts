import { OauthClientCreateResponse } from "../../../src/iam/iam.types";

const oauthClients: { [key: string]: OauthClientCreateResponse } = {
  "001": {
    id: "edf44f93-2b8f-4255-b7ed-23558fc46bee",
    name: "Auth Client 001",
    authorized_redirect_uris: ["https://www.test.com"],
    url: "https://www.test.com",
    description: "Client 001",
    grant_type: "refresh_token client_credentials",
    response_type: "code",
    scopes: "openid profile email",
    client_secret: "eXXKP&TP<<rUwR[x9|8s",
  },
  "002": {
    id: "7a1f2c24-33f0-426e-8021-1a203ffb842b",
    name: "Auth Client 002",
    description: "Client 002",
    authorized_redirect_uris: ["https://www.test.com"],
    url: "https://www.test.com",
    grant_type: "refresh_token client_credentials",
    response_type: "code",
    scopes: "openid profile email",
    client_secret: "eXXKP&TP<<rUwR[x9|8s[<#H>>HAcm`X8&6",
  },
  Updated001: {
    id: "edf44f93-2b8f-4255-b7ed-23558fc46bee",
    name: "Auth Client 003",
    authorized_redirect_uris: ["https://www.test3.com"],
    url: "https://www.test.com",
    description: "Client 003",
    grant_type: "refresh_token client_credentials",
    response_type: "code",
    scopes: "openid profile email",
    client_secret: "eXXKP&TP<<rUwR[x9|8s[<#H>>HAcm`X8&6",
  },
};

export default oauthClients;
