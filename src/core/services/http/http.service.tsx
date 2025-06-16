import { environment as env } from '@/environments/environment';
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { EHttpMethod } from './http.enum';
import { toHttpParams } from './http.utils';
import { IParams } from './http.models';
import { useGlobalStore } from '@/store/useGlobalStore';

class HttpService {
  private http: AxiosInstance;
  private baseURL = env.SERVER_API_URL;
  private pendingRequests = 0;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || env.SERVER_API_URL;
    this.http = axios.create({
      baseURL: this.baseURL,
      withCredentials: false,
      headers: this.setupHeaders(),
    });
    this.injectInterceptors();
  }

  shouldIgnoreLoader = (config: AxiosRequestConfig): boolean => {
    try {
      return config.headers?.['ignoreLoader']?.toString() === 'true';
    } catch {
      return false;
    }
  };

  private changeLoadingState(start: boolean) {
    const { setIsLoading } = useGlobalStore.getState();
    if (start) {
      this.pendingRequests++;
      setIsLoading(true);
    } else {
      this.pendingRequests = Math.max(0, this.pendingRequests - 1);
      if (this.pendingRequests === 0) {
        setIsLoading(false);
      }
    }
  }

  private setupHeaders(extraHeaders?: Record<string, any>): Record<string, string> {
    const { hasAttachment, ...rest } = extraHeaders || {};
    return {
      'Content-Type': hasAttachment ? 'multipart/form-data' : 'application/json',
      'x-client-version': import.meta.env.VITE_APP_VERSION ?? 'dev',
      'x-trace-id': crypto.randomUUID?.() ?? Date.now().toString(),
      'x-locale': localStorage.getItem('lang') ?? 'en',
      ...rest,
    };
  }

  private injectInterceptors(): void {
    this.http.interceptors.request.use((config) => {
      if (!this.shouldIgnoreLoader(config)) {
        this.changeLoadingState(true);
      }
      return config;
    });

    this.http.interceptors.response.use(
      (response) => {
        if (!this.shouldIgnoreLoader(response.config)) {
          this.changeLoadingState(false);
        }
        delete response.config.headers?.ignoreLoader;
        return response;
      },
      async (error) => {
        if (!this.shouldIgnoreLoader(error.config)) {
          this.changeLoadingState(false);
        }

        const status = error.response?.status;
        const message = error.response?.data?.error || error.message;

        if (status === 404) {
          return Promise.reject(new Error(`Not found: ${message}`));
        }

        return Promise.reject(error);
      }
    );
  }

  private async request<T>(method: EHttpMethod, url: string, options: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.http.request<T>({
        method,
        url,
        ...options,
      });
      return response.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get<T>(url: string, params?: any, extraHeaders: Record<string, any> = {}): Promise<T> {
    return this.request<T>(EHttpMethod.GET, url, {
      params: toHttpParams(params),
      headers: this.setupHeaders(extraHeaders),
    });
  }

  public async post<T, P>(url: string, payload: P, params?: IParams, extraHeaders: Record<string, any> = {}): Promise<T> {
    return this.request<T>(EHttpMethod.POST, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(extraHeaders),
    });
  }

  public async put<T, P>(url: string, payload: P, params?: IParams, extraHeaders: Record<string, any> = {}): Promise<T> {
    return this.request<T>(EHttpMethod.PUT, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(extraHeaders),
    });
  }

  public async patch<T, P>(url: string, payload: P, params?: IParams, extraHeaders: Record<string, any> = {}): Promise<T> {
    return this.request<T>(EHttpMethod.PATCH, url, {
      params: toHttpParams(params),
      data: payload,
      headers: this.setupHeaders(extraHeaders),
    });
  }

  public async delete<T>(url: string, params?: IParams, extraHeaders: Record<string, any> = {}): Promise<T> {
    return this.request<T>(EHttpMethod.DELETE, url, {
      params: toHttpParams(params),
      headers: this.setupHeaders(extraHeaders),
    });
  }
}

export default HttpService;
