import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { userManager } from "~/auth/auth.service";
import { jwtDecode } from "jwt-decode";
import { UserProfileMM } from "~/auth/auth.types";

type OAuthSession = {
  userId?: string;
  organizationId?: string;
  serviceProviderId?: string;
  serviceProviderUrl?: string;
  serviceProviderName?: string;
  expiresIn: number;
  expiresOn?: number;
  accessToken: string;
  clientId?: string;
  nextUrl?: string;
};

export class OAuthManager {
  private readonly code: string;
  private readonly storage: string;
  private readonly clientId: string | null;
  private readonly redirectUri: string | null;
  private readonly nextUrlParams: URLSearchParams;
  private readonly nextUrl: string;

  private tokenEndpoint?: string;
  private authorizationEndpoint?: string;

  session?: OAuthSession;

  constructor(code: string, nextUrl: string, storage: string) {
    this.code = code;
    const decodedNextUrl: string = decodeURI(nextUrl);
    this.nextUrlParams = new URLSearchParams(
      decodedNextUrl.substring(decodedNextUrl.indexOf("?")),
    );
    this.clientId = this.nextUrlParams.get("client_id");
    this.redirectUri = this.nextUrlParams.get("redirect_uri");
    this.storage = storage;
    this.nextUrl = nextUrl;
  }

  async init(): Promise<void> {
    this.tokenEndpoint = await userManager.metadataService.getTokenEndpoint();
    this.authorizationEndpoint =
      await userManager.metadataService.getAuthorizationEndpoint();
    const storageSession: string | null = localStorage.getItem(this.storage);
    if (storageSession) {
      try {
        this.session = JSON.parse(storageSession);
      } catch (error) {
        console.error("Unable to parse the Session from Storage", error);
      }
    }
    if (
      !this.session ||
      !this.session.expiresOn ||
      Date.now() > this.session.expiresOn
    ) {
      await this.createSession();
    }
    if (this.session) {
      setTimeout((): void => {
        this.authorize();
      }, this.session.expiresIn - 5000);
    }
  }

  async createSession(): Promise<void> {
    if (!this.tokenEndpoint) {
      return;
    }
    const axiosInstance: AxiosInstance = axios.create({
      baseURL: this.tokenEndpoint,
    });
    const formData: FormData = new FormData();
    formData.append("code", this.code);
    formData.append("client_id", this.clientId || "");
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", this.redirectUri || "");
    const response: AxiosResponse = await axiosInstance.post(
      this.tokenEndpoint,
      formData,
    );
    const expiresIn: number = response.data.expires_in * 1000;
    const idToken: UserProfileMM = jwtDecode(response.data.id_token);
    this.session = {
      userId: idToken.sub,
      organizationId: idToken.org,
      serviceProviderId: idToken.sp,
      serviceProviderUrl: idToken.sp_url,
      serviceProviderName: idToken.sp_name,
      clientId: this.clientId || "",
      expiresIn,
      expiresOn: Date.now() + expiresIn,
      accessToken: response.data.access_token,
      nextUrl: this.nextUrl,
    };
    localStorage.setItem(this.storage, JSON.stringify(this.session));
  }

  authorize(organizationId?: string | null): void {
    if (!this.authorizationEndpoint) {
      return;
    }
    if (organizationId) {
      this.nextUrlParams.set("organization_id", organizationId);
    }
    window.location.href = `${this.authorizationEndpoint}?${this.nextUrlParams.toString()}`;
  }

  getClientId(): string | undefined {
    return this.session?.clientId || undefined;
  }

  getOrganizationId(): string | undefined {
    return this.session?.organizationId;
  }

  getServiceProviderId(): string | undefined {
    return this.session?.serviceProviderId;
  }

  getServiceProviderUrl(): string | undefined {
    return this.session?.serviceProviderUrl;
  }

  getServiceProviderName(): string | undefined {
    return this.session?.serviceProviderName;
  }

  getNextUrl(): string | undefined {
    return this.session?.nextUrl;
  }
}

export class OAuthClientService {
  oAuthManager?: OAuthManager;
  axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
    });
    this.axiosInstance.interceptors.request.use(
      async (
        config: InternalAxiosRequestConfig,
      ): Promise<InternalAxiosRequestConfig> => {
        if (this.oAuthManager?.session) {
          config.headers.Authorization = `Bearer ${this.oAuthManager.session.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  setOAuthManager(oAuthManager: OAuthManager): void {
    this.oAuthManager = oAuthManager;
  }
}
