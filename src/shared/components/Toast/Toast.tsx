import { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useToastStore } from '@/store/useToastStore';
import Button, { ButtonVariant } from '../button/Button';
import { FaTimes } from 'react-icons/fa';
import './Toast.scss';

const Toast = () => {
  const { toasts, removeToast } = useToastStore();

  useEffect(() => {
    const timers = new Map<string, ReturnType<typeof setTimeout>>();

    toasts.forEach((toast) => {
      if (toast.duration && toast.duration > 0 && !timers.has(toast.id)) {
        const timer = setTimeout(() => {
          removeToast(toast.id);
          timers.delete(toast.id);
        }, toast.duration);
        timers.set(toast.id, timer);
      }
    });

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, [toasts, removeToast]);

  const renderedToasts = useMemo(() => {
    return toasts.map((toast) => (
      <div
        key={toast.id}
        className={`toast toast-${toast.type}`}
        role="status"
        aria-live="polite"
        aria-label={`Notification: ${toast.type}`}
        data-testid={`toast-${toast.type}`}
      >
        <span className="toast-message" id={`toast-msg-${toast.id}`}>
          {toast.message}
        </span>
        <Button
          className="toast-close"
          variant={ButtonVariant.ROUND}
          size="xs"
          aria-label="Close notification"
          handleClick={() => removeToast(toast.id)}
        >
          <FaTimes />
        </Button>
      </div>
    ));
  }, [toasts, removeToast]);

  const container = document.getElementById('toast-root') || document.body;
  return createPortal(
    <div className="toast-container" data-testid="toast-container">
      {renderedToasts}
    </div>,
    container
  );
};

export default Toast;
