/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}

export interface Product {
  id: string | number;
  name: string;
  description: string;
  price: number;
  mainImage: string;
  category: string;
  sales: number;
  badge?: string;
  badgeColor?: string;
}

export interface CartItem {
  id: number;
  userId: number;
  skuId: number;
  productId: number;
  skuName: string;
  skuImage: string;
  price: number;
  quantity: number;
  checked: number;
  createTime?: string;
  updateTime?: string;
}

export type View = 'home' | 'product' | 'cart' | 'checkout' | 'login' | 'register' | 'orders' | 'profile' | 'orderDetail' | 'address' | 'payment';
