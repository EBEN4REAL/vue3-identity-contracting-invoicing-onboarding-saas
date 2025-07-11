import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { authService } from "~/auth/auth.service";
import { showToast } from "~/mm_ui_kit/src/composables/useToast";
import { TypeToastStatuses } from "~/mm_ui_kit/src/types/toast.types";

type TypeCreateAxiosInstanceOptions = {
  baseURL: string;
  withCredentials?: boolean;
  isShowError?: boolean;
};

const handleClientError = (status: number, isShowError: boolean) => {
  if (isShowError) {
    const message =
      status === 409
        ? "Duplicate record found, please check the data you have provided and try again"
        : "Something went wrong, please try again.";
    showToast({
      text: message,
      status: TypeToastStatuses.Error,
      duration: 5000,
    });
  }
};

export function createAxiosInstance({
  baseURL,
  withCredentials,
}: TypeCreateAxiosInstanceOptions): AxiosInstance {
  const axiosInstance = axios.create({
    baseURL,
    withCredentials,
  });

  // Request interceptor for adding headers
  axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig & { isShowError?: boolean }) => {
      const accessToken = await authService.getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      config.isShowError =
        config.isShowError !== undefined ? config.isShowError : true;
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor for handling errors globally
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const { data } = error?.response || {};
      const errorId = data?.error_id;
      if (error.response) {
        const status = error?.response?.status;
        const config = error.config as InternalAxiosRequestConfig & {
          isShowError?: boolean;
        };
        const isShowError =
          config.isShowError !== undefined ? config.isShowError : true;
        if (status >= 400 && status < 500) {
          handleClientError(status, isShowError);
        } else if (status >= 500) {
          const errorMessage = errorId
            ? `Something went wrong, please try again. Error ID: ${errorId}`
            : "Something went wrong, please try again.";
          showToast({
            text: errorMessage,
            status: TypeToastStatuses.Error,
            duration: 5000,
          });
        }
      }
      return Promise.reject(error);
    },
  );

  return axiosInstance;
}
