// components/Button.js
const variantStyles = {
    blue: "bg-formButtonBlue hover:bg-formButtonBlueHover focus:ring-formButtonBlueHover",
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
};

export default function Button({
    onClick,
    type = "button", // can be "button" or "submit"
    disabled = false,
    isLoading = false,
    loadingText = "Loading...",
    children,
    className = "",
    variant = "blue",
    ...rest
}) {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled || isLoading}
            className={`px-6 py-3 text-white text-sm rounded-md focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant] || variantStyles.blue} ${className}`}
            {...rest}
        >
            {isLoading ? loadingText : children}
        </button>
    );
}
