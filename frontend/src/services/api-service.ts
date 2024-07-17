import { v4 } from "uuid";
import axios from 'axios';
import Router from 'next/router';
import { apiURL } from '@utils/api-url';

export interface ApiResponse<T> {
  data: T;
  message: string;
}

export const handleError = (error) => {
  let s = '';
  if (error?.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    s += `Server responded with ${error?.response?.status} ${error?.response?.data?.message}`;
  } else if (error?.request) {
    // The request was made but no response was received
    // `error?.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    s += `Server did not respond`;
  } else {
    // Something happened in setting up the request that triggered an Error
    s += `Unknown error: ${error?.message}`;
  }
  s += ` for url ${error?.config?.url}`;
  console.error(s);

  if (error?.response?.status === 401 && Router.pathname !== '/login') {
    // isRedirectingToLogin = true;
    Router.push('/login');
  }

  throw error;
};

const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    'X-Request-Id': v4(),
  },
  withCredentials: true,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const get = <T>(url: string, options?: { [key: string]: any }) => {
  return axios.get<T>(apiURL(url), { ...defaultOptions, ...options }).catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const post = <T>(url: string, data: any, options?: { [key: string]: any }) => {
  return axios.post<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const remove = <T>(url: string, options?: { [key: string]: any }) => {
  return axios.delete<T>(apiURL(url), { ...defaultOptions, ...options }).catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const patch = <T>(url: string, data: any, options?: { [key: string]: any }) => {
  return axios.patch<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const put = <T>(url: string, data: any, options?: { [key: string]: any }) => {
  return axios.put<T>(apiURL(url), data, { ...defaultOptions, ...options }).catch(handleError);
};

export const apiService = { get, post, put, patch, delete: remove };
