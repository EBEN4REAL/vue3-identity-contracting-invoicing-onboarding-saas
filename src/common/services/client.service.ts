import { AxiosRequestConfig, AxiosInstance, AxiosResponse } from "axios";
import { createAxiosInstance } from "./createAxiosInstance";

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  isShowError?: boolean;
}

class ClientService {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string, withCredentials?: boolean) {
    this.axiosInstance = createAxiosInstance({
      baseURL,
      withCredentials,
    });
  }

  private mergeConfig(
    config?: CustomAxiosRequestConfig,
    isShowError?: boolean,
  ): CustomAxiosRequestConfig {
    return {
      ...config,
      isShowError:
        isShowError !== undefined ? isShowError : config?.isShowError,
    };
  }

  public get(
    url: string,
    params?: unknown,
    { isShowError }: { isShowError?: boolean } = {},
  ): Promise<AxiosResponse> {
    const config = this.mergeConfig({ params }, isShowError);
    return this.axiosInstance.get(url, config);
  }

  public getWithConfigs(
    url: string,
    config?: CustomAxiosRequestConfig,
    { isShowError }: { isShowError?: boolean } = {},
  ): Promise<AxiosResponse> {
    const mergedConfig = this.mergeConfig(config, isShowError);
    return this.axiosInstance.get(url, mergedConfig);
  }

  public post(
    url: string,
    data?: unknown,
    config?: CustomAxiosRequestConfig,
    { isShowError }: { isShowError?: boolean } = {},
  ): Promise<AxiosResponse> {
    const mergedConfig = this.mergeConfig(config, isShowError);
    return this.axiosInstance.post(url, data, mergedConfig);
  }

  public put(
    url: string,
    data?: unknown,
    config?: CustomAxiosRequestConfig,
    { isShowError }: { isShowError?: boolean } = {},
  ): Promise<AxiosResponse> {
    const mergedConfig = this.mergeConfig(config, isShowError);
    return this.axiosInstance.put(url, data, mergedConfig);
  }

  public patch(
    url: string,
    data?: unknown,
    { isShowError }: { isShowError?: boolean } = {},
  ): Promise<AxiosResponse> {
    const config = this.mergeConfig({}, isShowError);
    return this.axiosInstance.patch(url, data, config);
  }

  public delete(
    url: string,
    config?: CustomAxiosRequestConfig,
    { isShowError }: { isShowError?: boolean } = {},
  ): Promise<AxiosResponse> {
    const mergedConfig = this.mergeConfig(config, isShowError);
    return this.axiosInstance.delete(url, mergedConfig);
  }
}

export default ClientService;
