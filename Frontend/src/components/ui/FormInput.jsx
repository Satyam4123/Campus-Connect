export default function FormInput({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    className = "",
    ...props
}) {
    return (
        <div>
            {label && (
                <label className="block text-xs font-medium text-gray-300 mb-1">{label}</label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-3 py-2.5 rounded-lg focus:bg-gray-750 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all duration-300 text-sm ${className}`}
                {...props}
            />
        </div>
    );
}
