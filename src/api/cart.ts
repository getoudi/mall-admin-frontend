import api from './config';
import type { ApiResponse } from '../types';
import type { CartItem } from '../types';

export const getCartList = (): Promise<ApiResponse<CartItem[]>> => {
  return api.get('/api/cart/list');
};

export const addToCart = (data: {
  productId: number;
  skuId: number;
  skuName: string;
  skuImage?: string;
  price: number;
  quantity: number;
}): Promise<ApiResponse<CartItem>> => {
  return api.post('/api/cart/add', data);
};

export const updateCartItem = (id: number, quantity: number): Promise<ApiResponse<CartItem>> => {
  return api.put(`/api/cart/update/${id}`, { quantity });
};

export const removeFromCart = (id: number): Promise<ApiResponse<void>> => {
  return api.delete(`/api/cart/delete/${id}`);
};

export const clearCart = (): Promise<ApiResponse<void>> => {
  return api.delete('/api/cart/clear');
};

export const checkCartItem = (id: number, checked: boolean): Promise<ApiResponse<void>> => {
  return api.put(`/api/cart/check/${id}`, { checked: checked ? 1 : 0 });
};

export const checkAllCart = (checked: boolean): Promise<ApiResponse<void>> => {
  return api.put('/api/cart/checkAll', { checked: checked ? 1 : 0 });
};

export const getCheckedCartItems = (): Promise<ApiResponse<CartItem[]>> => {
  return api.get('/api/cart/checked');
};
