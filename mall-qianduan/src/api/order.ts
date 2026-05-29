import api from './config';
import type { ApiResponse } from '../types';

export interface OrderItem {
  id: number;
  orderSn: string;
  productId: number;
  skuId: number;
  skuName: string;
  skuImage: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  orderSn: string;
  userId: number;
  totalAmount: number;
  status: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  remark?: string;
  createTime: string;
  payTime?: string;
  shipTime?: string;
  finishTime?: string;
  items: OrderItem[];
}

export interface OrderListResponse {
  records: Order[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export const createOrder = (data: {
  addressId?: number;
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  remark?: string;
}): Promise<ApiResponse<Order>> => {
  return api.post('/api/order/create', data);
};

export const getOrderList = (params?: { pageNum?: number; pageSize?: number; status?: number }): Promise<ApiResponse<OrderListResponse>> => {
  return api.get('/api/order/list', { params });
};

export const getOrderDetail = (id: number): Promise<ApiResponse<Order>> => {
  return api.get(`/api/order/${id}`);
};

export const cancelOrder = (id: number): Promise<ApiResponse<void>> => {
  return api.put(`/api/order/cancel/${id}`);
};

export const confirmOrder = (id: number): Promise<ApiResponse<void>> => {
  return api.put(`/api/order/confirm/${id}`);
};

export const deleteOrder = (id: number): Promise<ApiResponse<void>> => {
  return api.delete(`/api/order/${id}`);
};

// NEW: 支付成功后更新订单状态
export const paySuccess = (orderSn: string): Promise<ApiResponse<void>> => {
  return api.put(`/api/order/paySuccess/${orderSn}`);
};
