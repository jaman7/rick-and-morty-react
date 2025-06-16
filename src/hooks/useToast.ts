import { ToastType, useToastStore } from '@/store/useToastStore';

export const useToast = () => {
  const { addToast } = useToastStore();

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = crypto.randomUUID();
    addToast({ id, message, type, duration });
  };

  return {
    showSuccess: (msg: string, duration?: number) => showToast(msg, 'success', duration),
    showError: (msg: string, duration?: number) => showToast(msg, 'error', duration),
    showInfo: (msg: string, duration?: number) => showToast(msg, 'info', duration),
    showWarning: (msg: string, duration?: number) => showToast(msg, 'warning', duration),
  };
};
