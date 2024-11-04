// utils/fetchWrapper.ts

const fetchWrapper = async (
  url: string,
  method: string,
  data?: object | null,
  headers: HeadersInit = {},
) => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }

  // Assuming response can be JSON; adjust as needed
  return response.json();
};
const BASE_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}`;
// Helper methods
const get = (url: string, headers?: HeadersInit) =>
  fetchWrapper(`${BASE_URL}/${url}`, "GET", undefined, headers);
const post = (url: string, data: object | null, headers?: HeadersInit) =>
  fetchWrapper(`${BASE_URL}/${url}`, "POST", data, headers);
const put = (url: string, data: object | null, headers?: HeadersInit) =>
  fetchWrapper(`${BASE_URL}/${url}`, "PUT", data, headers);
const del = (url: string, headers?: HeadersInit) =>
  fetchWrapper(`${BASE_URL}/${url}`, "DELETE", undefined, headers);

const request = {
  get,
  post,
  put,
  del,
};
export default request;
