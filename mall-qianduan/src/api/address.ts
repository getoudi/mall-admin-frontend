import api from './config';
import type { ApiResponse } from '../types';

export interface Address {
  id: number;
  userId: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault: number;
  createTime?: string;
}

export const getAddressList = (): Promise<ApiResponse<Address[]>> => {
  return api.get('/api/address/list');
};

export const addAddress = (data: {
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  isDefault?: number;
}): Promise<ApiResponse<Address>> => {
  return api.post('/api/address/add', data);
};

export const updateAddress = (data: {
  id: number;
  name?: string;
  phone?: string;
  province?: string;
  city?: string;
  district?: string;
  detailAddress?: string;
  isDefault?: number;
}): Promise<ApiResponse<Address>> => {
  return api.put('/api/address/update', data);
};

export const deleteAddress = (id: number): Promise<ApiResponse<void>> => {
  return api.delete(`/api/address/delete/${id}`);
};

export const setDefaultAddress = (id: number): Promise<ApiResponse<void>> => {
  return api.put(`/api/address/default/${id}`);
};
