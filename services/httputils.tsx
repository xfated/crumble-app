import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
}

async function get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axios.get(url, config);
    return { success: true, data: response.data, message: null };
  } catch (error: any) {
    console.error(error.message);
    return { success: false, data: null, message: error.message };
  }
}

async function post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axios.post(url, data, config);
    return { success: true, data: response.data, message: null };
  } catch (error: any) {
    console.error(error.message);
    return { success: false, data: null, message: error.message };
  }
}

async function put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axios.put(url, data, config);
    return { success: true, data: response.data, message: null };
  } catch (error: any) {
    console.error(error.message);
    return { success: false, data: null, message: error.message };
  }
}

async function del<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axios.delete(url, config);
    return { success: true, data: response.data, message: null };
  } catch (error: any) {
    console.error(error.message);
    return { success: false, data: null, message: error.message };
  }
}

export const httputils = {
  get,
  post,
  put,
  del
}