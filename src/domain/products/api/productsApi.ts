//Obj productsApi que centraliza todas las op CRUD para productos usando Axios a través de axiosAdapter (personalizado).

import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { AxiosResponse } from "axios";
import type { ProductDTO, ProductListDTO } from "../interfaces";
import type { CreateProductDTO, UpdateProductDTO } from "../services/mapperBackendShape";

export const productsApi = {

  getAll: (categoryId?: number): Promise<AxiosResponse<ProductListDTO>> => {
    const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
    return axiosAdapter.get(url);
  },

  getById: (id: number): Promise<AxiosResponse<ProductDTO>> => {
    return axiosAdapter.get(`/products/${id}`);
  },

  create: (data: CreateProductDTO): Promise<AxiosResponse<ProductDTO>> => {
    return axiosAdapter.post("/products", data);
  },

  update: (id: number, data: UpdateProductDTO): Promise<AxiosResponse<ProductDTO>> => {
    return axiosAdapter.put(`/products/${id}`, data);
  },

  delete: (id: number): Promise<AxiosResponse<void>> => {
    return axiosAdapter.delete(`/products/${id}`);
  },

};
