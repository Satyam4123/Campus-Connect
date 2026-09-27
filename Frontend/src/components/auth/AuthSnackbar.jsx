import { useEffect } from "react";

export default function AuthSnackbar({ open, message, severity, onClose }) {
    useEffect(() => {
        if (!open) return undefined;

        const timer = setTimeout(() => {
            onClose();
        }, 3500);

        return () => clearTimeout(timer);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)]">
            <div
                className={`backdrop-blur-xl rounded-xl p-4 border shadow-2xl flex items-center space-x-3 ${severity === "success"
                    ? "bg-green-900 bg-opacity-80 border-green-700 text-green-300"
                    : "bg-red-900 bg-opacity-80 border-red-700 text-red-300"
                    }`}
            >
                <div
                    className={`w-2 h-2 rounded-full ${severity === "success" ? "bg-green-400" : "bg-red-400"
                        } animate-pulse`}
                />
                <span className="font-medium text-sm leading-5">{message}</span>
                <button
                    type="button"
                    onClick={onClose}
                    className="ml-auto text-gray-400 hover:text-white transition-colors duration-200"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
