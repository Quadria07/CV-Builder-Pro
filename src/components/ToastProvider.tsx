import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />,
        error: <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
        info: <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />,
    };

    const borders = {
        success: 'border-teal-200',
        error: 'border-red-200',
        info: 'border-blue-200',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 bg-white border ${borders[toast.type]} rounded-xl px-4 py-3 shadow-lg animate-fadeInUp`}
                    >
                        {icons[toast.type]}
                        <p className="text-sm text-slate-700 flex-1 leading-relaxed">{toast.message}</p>
                        <button
                            onClick={() => dismiss(toast.id)}
                            className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used inside ToastProvider');
    return ctx;
}
