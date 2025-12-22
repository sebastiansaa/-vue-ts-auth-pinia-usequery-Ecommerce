//Obj productsApi que centraliza todas las op CRUD para productos usando Axios a través de axiosAdapter (personalizado).

import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { AxiosResponse } from "axios";
import type { ProductDTO, ProductListDTO } from "../interfaces";
import type { CreateProductDTO, UpdateProductDTO } from "../services/mapperBackendShapeProduct";

export const productsApi = {

  // List products (backend only accepts page & limit)
  getAll: (params?: { page?: number; limit?: number; categoryId?: number }): Promise<AxiosResponse<ProductListDTO>> => {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params?.categoryId !== undefined) searchParams.set("categoryId", String(params.categoryId));
    const qs = searchParams.toString();
    const url = qs ? `/products?${qs}` : "/products";
    return axiosAdapter.get(url);
  },

  getById: (id: number): Promise<AxiosResponse<ProductDTO | null>> => {
    return axiosAdapter.get(`/products/${id}`);
  },

  // Search products (backend expects query param named "query")
  search: (query: string, params?: { page?: number; limit?: number }): Promise<AxiosResponse<ProductListDTO>> => {
    const searchParams = new URLSearchParams({ query });
    if (params?.page !== undefined) searchParams.set("page", String(params.page));
    if (params?.limit !== undefined) searchParams.set("limit", String(params.limit));
    const qs = searchParams.toString();
    return axiosAdapter.get(`/products/search?${qs}`);
  },

  // Save (create or update). Backend handles upsert via POST /products
  save: (data: CreateProductDTO | UpdateProductDTO): Promise<AxiosResponse<ProductDTO>> => {
    return axiosAdapter.post("/products", data);
  },

  updateStock: (id: number, body: { quantity: number }): Promise<AxiosResponse<ProductDTO>> => {
    return axiosAdapter.put(`/products/${id}/stock`, body);
  },

  lowStock: (threshold?: number): Promise<AxiosResponse<ProductDTO[]>> => {
    const searchParams = new URLSearchParams();
    if (threshold !== undefined) searchParams.set("threshold", String(threshold));
    const qs = searchParams.toString();
    const url = qs ? `/products/low-stock?${qs}` : "/products/low-stock";
    return axiosAdapter.get(url);
  },

  restore: (id: number): Promise<AxiosResponse<ProductDTO>> => {
    return axiosAdapter.post(`/products/${id}/restore`);
  },

  delete: (id: number, soft = true): Promise<AxiosResponse<void>> => {
    const q = soft ? "" : "?hard=true";
    return axiosAdapter.delete(`/products/${id}${q}`);
  },

};
