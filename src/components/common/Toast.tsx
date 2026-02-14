import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'info' | 'error' | 'success';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    info: 'bg-royal',
    error: 'bg-red-600',
    success: 'bg-green-600',
  }[type];

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 z-50 transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className={`${bgColor} text-white text-sm font-medium rounded-lg px-4 py-3 shadow-lg text-center max-w-md mx-auto`}>
        {message}
      </div>
    </div>
  );
}
