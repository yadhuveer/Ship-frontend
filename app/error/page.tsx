export default function ErrorPage() {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Server Error</h1>
        <p className="text-gray-700 mb-4">
          We’re having some trouble right now. Please try again later.
        </p>
        <a
          href="/"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
