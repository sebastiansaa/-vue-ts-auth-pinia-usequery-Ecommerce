import { axiosAdapter } from "@/shared/api/axiosAdapter";
import type { AxiosResponse } from "axios";
import type {
  AdminInventoryDTO,
  AdminPaymentDTO,
  AdminOrderDTO,
  AdminProductDTO,
  AdminUserDTO,
  UploadImageResponse,
  AdminListQuery,
  ChangeUserStatusDto,
  UpdateProductDto,
  AdjustStockDto,
} from "../interfaces";


export const adminApi = {
  // Users
  getUsers: (query?: AdminListQuery): Promise<AxiosResponse<AdminUserDTO[]>> => {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set("page", String(query.page));
    if (query?.limit !== undefined) searchParams.set("limit", String(query.limit));
    if (query?.sort) searchParams.set("sort", query.sort);
    if (query?.filter) searchParams.set("filter", query.filter);
    if (query?.q) searchParams.set("q", query.q);
    const qs = searchParams.toString();
    const url = qs ? `/admin/users?${qs}` : `/admin/users`;
    return axiosAdapter.get(url);
  },
  getUserById: (id: string): Promise<AxiosResponse<AdminUserDTO>> => axiosAdapter.get(`/admin/users/${id}`),
  changeUserStatus: (id: string, body: ChangeUserStatusDto): Promise<AxiosResponse<AdminUserDTO>> =>
    axiosAdapter.patch(`/admin/users/${id}/status`, body),

  // Products
  getProducts: (query?: AdminListQuery): Promise<AxiosResponse<AdminProductDTO[]>> => {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set("page", String(query.page));
    if (query?.limit !== undefined) searchParams.set("limit", String(query.limit));
    if (query?.sort) searchParams.set("sort", query.sort);
    if (query?.filter) searchParams.set("filter", query.filter);
    if (query?.q) searchParams.set("q", query.q);
    const qs = searchParams.toString();
    const url = qs ? `/admin/products?${qs}` : `/admin/products`;
    return axiosAdapter.get(url);
  },
  getProductById: (id: number): Promise<AxiosResponse<AdminProductDTO>> => axiosAdapter.get(`/admin/products/${id}`),
  updateProduct: (id: number, body: UpdateProductDto): Promise<AxiosResponse<AdminProductDTO>> =>
    axiosAdapter.patch(`/admin/products/${id}`, body),
  uploadProductImage: (id: number, file: File): Promise<AxiosResponse<UploadImageResponse>> => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosAdapter.post(`/admin/products/${id}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Orders
  getOrders: (query?: AdminListQuery): Promise<AxiosResponse<AdminOrderDTO[]>> => {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set("page", String(query.page));
    if (query?.limit !== undefined) searchParams.set("limit", String(query.limit));
    if (query?.sort) searchParams.set("sort", query.sort);
    if (query?.filter) searchParams.set("filter", query.filter);
    if (query?.q) searchParams.set("q", query.q);
    const qs = searchParams.toString();
    const url = qs ? `/admin/orders?${qs}` : `/admin/orders`;
    return axiosAdapter.get(url);
  },
  getOrderById: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.get(`/admin/orders/${id}`),
  cancelOrder: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.post(`/admin/orders/${id}/cancel`),
  shipOrder: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.post(`/admin/orders/${id}/ship`),
  completeOrder: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.post(`/admin/orders/${id}/complete`),

  // Payments
  getPayments: (query?: AdminListQuery): Promise<AxiosResponse<AdminPaymentDTO[]>> => {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set("page", String(query.page));
    if (query?.limit !== undefined) searchParams.set("limit", String(query.limit));
    if (query?.sort) searchParams.set("sort", query.sort);
    if (query?.filter) searchParams.set("filter", query.filter);
    if (query?.q) searchParams.set("q", query.q);
    const qs = searchParams.toString();
    const url = qs ? `/admin/payments?${qs}` : `/admin/payments`;
    return axiosAdapter.get(url);
  },
  getPaymentById: (id: string): Promise<AxiosResponse<AdminPaymentDTO>> => axiosAdapter.get(`/admin/payments/${id}`),

  // Inventory
  getInventory: (query?: AdminListQuery): Promise<AxiosResponse<AdminInventoryDTO[]>> => {
    const searchParams = new URLSearchParams();
    if (query?.page !== undefined) searchParams.set("page", String(query.page));
    if (query?.limit !== undefined) searchParams.set("limit", String(query.limit));
    if (query?.sort) searchParams.set("sort", query.sort);
    if (query?.filter) searchParams.set("filter", query.filter);
    if (query?.q) searchParams.set("q", query.q);
    const qs = searchParams.toString();
    const url = qs ? `/admin/inventory?${qs}` : `/admin/inventory`;
    return axiosAdapter.get(url);
  },
  getInventoryByProductId: (productId: number): Promise<AxiosResponse<AdminInventoryDTO>> => axiosAdapter.get(`/admin/inventory/${productId}`),
  adjustInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.patch(`/admin/inventory/${productId}/adjust`, body),
};
