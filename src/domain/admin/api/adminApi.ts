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
  AdminCategoryDTO,
  CreateCategoryDto,
  UpdateCategoryDto,
  AdminInventoryMovementDTO,
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

  // Orders (no admin-specific endpoints disponibles ; reutilizamos los de usuario)
  getOrders: (): Promise<AxiosResponse<AdminOrderDTO[]>> => axiosAdapter.get(`/admin/orders`),
  getOrderById: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.get(`/admin/orders/${id}`),
  cancelOrder: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.post(`/admin/orders/${id}/cancel`),
  payOrder: (id: string): Promise<AxiosResponse<AdminOrderDTO>> => axiosAdapter.post(`/admin/orders/${id}/ship`),
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

  // Backend como fuente de la verdad: InventoryController expone esas operaciones en /inventory/:productId
  getInventoryByProductId: (productId: number): Promise<AxiosResponse<AdminInventoryDTO>> => axiosAdapter.get(`/inventory/${productId}`),
  getInventoryMovements: (
    productId: number,
  ): Promise<AxiosResponse<AdminInventoryMovementDTO[]>> => axiosAdapter.get(`/inventory/${productId}/movements`),
  increaseInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.post(`/inventory/${productId}/increase`, body),
  decreaseInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.post(`/inventory/${productId}/decrease`, body),
  reserveInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.post(`/inventory/${productId}/reserve`, body),
  releaseInventory: (productId: number, body: AdjustStockDto): Promise<AxiosResponse<AdminInventoryDTO>> =>
    axiosAdapter.post(`/inventory/${productId}/release`, body),

  // Categories (protected mutations, public list/get)
  // Backend como fuente de la verdad: CategoriesController expone esas operaciones en /categories
  getCategories: (): Promise<AxiosResponse<AdminCategoryDTO[]>> => axiosAdapter.get(`/categories`),
  getCategoryById: (id: number): Promise<AxiosResponse<AdminCategoryDTO>> => axiosAdapter.get(`/categories/${id}`),
  createCategory: (body: CreateCategoryDto): Promise<AxiosResponse<AdminCategoryDTO>> => axiosAdapter.post(`/categories`, body),
  updateCategory: (id: number, body: UpdateCategoryDto): Promise<AxiosResponse<AdminCategoryDTO>> =>
    axiosAdapter.patch(`/categories/${id}`, body),
  deleteCategory: (id: number): Promise<AxiosResponse<void>> => axiosAdapter.delete(`/categories/${id}`),
};
