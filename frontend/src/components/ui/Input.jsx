// src/components/ui/Input.jsx
const Input = ({
  label,
  type = "text",
  error,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}

      <input
        type={type}
        className={`px-4 py-2.5 rounded-xl border bg-white text-black 
        transition-all duration-300 outline-none
        focus:ring-2 focus:ring-black focus:border-black w-full
        shadow-sm
        ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
        ${className}`}
        {...props}
      />

      {error && (
        <span className="text-sm text-red-600 font-medium">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
