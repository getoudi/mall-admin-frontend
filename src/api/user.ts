import api from './config';
import type { ApiResponse } from '../types';

export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email?: string;
  phone?: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export const login = (data: { username: string; password: string }): Promise<ApiResponse<LoginResponse>> => {
  return api.post('/api/user/login', data);
};

export const register = (data: { username: string; password: string; nickname?: string }): Promise<ApiResponse<UserInfo>> => {
  return api.post('/api/user/register', data);
};

export const getUserInfo = (): Promise<ApiResponse<UserInfo>> => {
  return api.get('/api/user/info');
};

export const updateUserInfo = (data: {
  nickname?: string;
  email?: string;
  phone?: string;
}): Promise<ApiResponse<UserInfo>> => {
  return api.put('/api/user/info', data);
};
