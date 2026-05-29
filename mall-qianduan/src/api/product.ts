import api from './config';
import type { ApiResponse } from '../types';
import type { Product } from '../types';

export interface ProductListResponse {
  records: Product[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export const getProductList = (params?: {
  pageNum?: number;
  pageSize?: number;
  keyword?: string;
  categoryId?: number;
}): Promise<ApiResponse<ProductListResponse | Product[]>> => {
  return api.get('/api/product/list', { params });
};

export const getProductDetail = (id: number): Promise<ApiResponse<Product>> => {
  return api.get(`/api/product/detail/${id}`);
};

export interface Category {
  id: number;
  name: string;
  children?: Category[];
}

export const getCategoryTree = (): Promise<ApiResponse<Category[]>> => {
  return api.get('/api/product/category/tree');
};
