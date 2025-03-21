import axios, { AxiosPromise } from "axios";

// Configuração da URL base da API
const API_BASE_URL = "https://inr8qm2bj0.execute-api.us-east-1.amazonaws.com/dev/"; // Altere para sua URL base real

const getJwtToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }

  return null;
};

export const get = <T>(
  endpoint: string,
  options?: { headers?: { [key: string]: string }; params?: { [key: string]: boolean | number | string } }
): AxiosPromise<T> => {
  const jwtToken = getJwtToken();
  const url = `${API_BASE_URL}${endpoint}`;

  return axios({
    headers: { 
      Authorization: `Bearer ${jwtToken}`,
      ...options?.headers
    },
    method: "GET",
    params: options?.params || {},
    url,
  });
};

export const post = <T>(endpoint: string, data: { [key: string]: unknown }): AxiosPromise<T> => {
  const jwtToken = getJwtToken();
  const url = `${API_BASE_URL}${endpoint}`;

  return axios({
    data,
    headers: { Authorization: `Bearer ${jwtToken}` },
    method: "POST",
    url,
  });
};

export const put = <T>(
  endpoint: string,
  data: Array<{ [key: string]: unknown }> | { [key: string]: unknown } | null
): AxiosPromise<T> => {
  const jwtToken = getJwtToken();
  const url = `${API_BASE_URL}${endpoint}`;

  return axios({
    data,
    headers: { Authorization: `Bearer ${jwtToken}` },
    method: "PUT",
    url,
  });
};

export const deleteAxios = <T>(endpoint: string, data?: { [key: string]: unknown }): AxiosPromise<T> => {
  const jwtToken = getJwtToken();
  const url = `${API_BASE_URL}${endpoint}`;

  return axios({
    data,
    headers: { Authorization: `Bearer ${jwtToken}` },
    method: "DELETE",
    url,
  });
};
