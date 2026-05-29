import api from './config';
import type { ApiResponse } from '../types';

export interface Payment {
  id: number;
  paymentSn: string;
  orderSn: string;
  payType: number;
  amount: number;
  status: number;
  createTime: string;
  payTime?: string;
}

export const createPayment = (data: {
  orderSn: string;
  payType: number;
  amount: number;
}): Promise<ApiResponse<Payment>> => {
  return api.post('/api/payment/create', data);
};

export const getPaymentStatus = (paymentSn: string): Promise<ApiResponse<Payment>> => {
  return api.get(`/api/payment/status/${paymentSn}`);
};

export const paymentCallback = (paymentSn: string): Promise<ApiResponse<Payment>> => {
  return api.post(`/api/payment/callback/${paymentSn}`);
};
