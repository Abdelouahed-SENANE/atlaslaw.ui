export function GlobalError() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold text-red-500">Application Error</h1>
      <pre className="text-red-400">An error occurred.</pre>

      <button
        onClick={() => window.location.reload()}
        className="mt-4 px-4 py-2 bg-primary text-white rounded"
      >
        Try Again
      </button>
    </div>
  );
}
