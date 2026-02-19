const Loader = ({
  size = 40,
  text = "Fadlan sug...",
  fullScreen = false,
  inline = false,
}) => {
  return (
    <div
      className={`flex ${
        inline ? "items-center justify-center" : "flex-col items-center justify-center"
      } ${
        fullScreen ? "min-h-screen bg-gray-100" : inline ? "" : "py-10"
      }`}
    >
      {/* Spinner */}
      <div
        style={{ width: size, height: size }}
        className="rounded-full border-4 border-black border-t-transparent animate-spin"
      />

      {/* Text */}
      {!inline && text && (
        <p className="mt-4 text-sm font-medium text-black animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
