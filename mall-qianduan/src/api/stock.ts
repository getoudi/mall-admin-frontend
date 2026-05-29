/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import api from './config';
import type { ApiResponse } from '../types';

// NEW: 库存类型定义
export interface Stock {
  skuId: number;
  quantity: number;
}

// NEW: 查询商品库存
export const getStock = (skuId: number): Promise<ApiResponse<Stock>> => {
  return api.get(`/api/stock/${skuId}`);
};

// NEW: 下单时锁定库存
export const lockStock = (data: {
  skuId: number;
  quantity: number;
  orderSn: string;
}): Promise<ApiResponse<void>> => {
  return api.post('/api/stock/lock', data);
};

// NEW: 发货时扣减库存
export const deductStock = (orderSn: string): Promise<ApiResponse<void>> => {
  return api.post('/api/stock/deduct', { orderSn });
};

// NEW: 取消订单时释放库存
export const releaseStock = (orderSn: string): Promise<ApiResponse<void>> => {
  return api.post('/api/stock/release', { orderSn });
};
