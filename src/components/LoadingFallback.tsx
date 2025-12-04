/**
 * Lightweight loading fallback component
 * Pure HTML/CSS - minimal JavaScript overhead during initial fetch
 */
const LoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
};

export default LoadingFallback;

