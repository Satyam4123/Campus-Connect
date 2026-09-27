export default function ActionButton({
    children,
    type = "button",
    onClick,
    disabled = false,
    isLoading = false,
    loadingText,
    variant = "primary",
    className = "",
}) {
    const baseClasses =
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

    const variantClasses = {
        primary:
            "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500 hover:shadow-opacity-50 transform hover:scale-[1.01]",
        secondary:
            "bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 text-white",
        ghost:
            "border border-gray-700 hover:border-red-500 text-gray-300 hover:text-white",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        >
            {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                    <span className="w-4 h-4 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin" />
                    <span>{loadingText || children}</span>
                </span>
            ) : (
                children
            )}
        </button>
    );
}
