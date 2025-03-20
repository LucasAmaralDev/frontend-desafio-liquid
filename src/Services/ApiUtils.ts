import axios, { AxiosPromise } from "axios";

const getJwtToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }

  return null;
};

export const get = <T>(
  url: string,
  options?: { headers?: { [key: string]: string }; params?: { [key: string]: boolean | number | string } }
): AxiosPromise<T> => {
  const jwtToken = getJwtToken();

  return axios({
    headers: { Authorization: `Bearer ${jwtToken}` },
    method: "GET",
    params: options?.params || {},
    url,
  });
};

export const post = <T>(url: string, data: { [key: string]: unknown }): AxiosPromise<T> => {
  const jwtToken = getJwtToken();

  return axios({
    data,
    headers: { Authorization: `Bearer ${jwtToken}` },
    method: "POST",
    url,
  });
};

export const put = <T>(
  url: string,
  data: Array<{ [key: string]: unknown }> | { [key: string]: unknown } | null
): AxiosPromise<T> => {
  const jwtToken = getJwtToken();

  return axios({
    data,
    headers: { Authorization: `Bearer ${jwtToken}` },
    method: "PUT",
    url,
  });
};

export const deleteAxios = (url: string, data?: { [key: string]: unknown }) => {
  const jwtToken = getJwtToken();

  return axios({
    data,
    headers: { Authorization: `Bearer ${jwtToken}` },
    method: "DELETE",
    url,
  });
};
