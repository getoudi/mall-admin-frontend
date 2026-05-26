import { API_SUCCESS_CODES } from '../constants';

export const isSuccessResponse = (res: any): boolean => {
  return API_SUCCESS_CODES.includes(res?.code);
};

export const getStatusText = (status: number) => {
  const map: Record<number, { text: string; color: string }> = {
    0: { text: '待支付', color: 'bg-primary-container/10 text-primary-container' },
    1: { text: '待发货', color: 'bg-tertiary/10 text-tertiary' },
    2: { text: '待收货', color: 'bg-tertiary/10 text-tertiary' },
    3: { text: '已完成', color: 'bg-secondary/10 text-secondary' },
    4: { text: '已取消', color: 'bg-on-surface-variant/10 text-on-surface-variant' },
  };
  return map[status] || { text: '未知', color: 'bg-gray-100 text-gray-500' };
};
