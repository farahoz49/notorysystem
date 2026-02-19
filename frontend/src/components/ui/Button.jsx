// src/components/ui/Button.jsx
const Button = ({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  className = "",
  ...props
}) => {
  const base =
    "px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-md";

  const variants = {
    primary:
      "bg-black text-white hover:bg-gray-800 hover:shadow-lg active:scale-95",
    outline:
      "border border-black text-black hover:bg-black hover:text-white",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={loading}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default Button;
