import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextValue {
    showToast: (message: string, type?: ToastType, action?: { label: string; onClick: () => void }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info', action?: { label: string; onClick: () => void }) => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type, action }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000);
    }, []);

    const dismiss = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
        error: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
        info: <Info className="w-5 h-5 text-slate-600 flex-shrink-0" />,
    };

    const bgColors = {
        success: 'bg-emerald-50 border-emerald-200',
        error: 'bg-rose-50 border-rose-200',
        info: 'bg-slate-50 border-slate-200',
    };

    const textColors = {
        success: 'text-emerald-900',
        error: 'text-rose-900',
        info: 'text-slate-900',
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container - Top center */}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`border rounded-lg px-4 py-3 shadow-sm animate-fadeInUp ${bgColors[toast.type]}`}
                    >
                        <div className="flex items-start gap-3">
                            {icons[toast.type]}
                            <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${textColors[toast.type]}`}>{toast.message}</p>
                                {toast.type === 'success' && (
                                    <p className="text-xs text-slate-500 mt-1.5">
                                        Have feedback? Help us improve
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => dismiss(toast.id)}
                                className="text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
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
