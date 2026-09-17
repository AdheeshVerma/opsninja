import axiosInstance from "@/lib/axiosInstance";

export async function apiGet<T>(url: string) {
  const response = await axiosInstance.get<T>(url);

  return response.data;
}

export async function apiPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
) {
  const response = await axiosInstance.post<TResponse>(url, body);

  return response.data;
}

export async function apiPatch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
) {
  const response = await axiosInstance.patch<TResponse>(url, body);

  return response.data;
}

export async function apiDelete<T>(url: string) {
  const response = await axiosInstance.delete<T>(url);

  return response.data;
}
