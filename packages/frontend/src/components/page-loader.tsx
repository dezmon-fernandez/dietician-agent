export function PageLoader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <img
        src="/favicon.svg" // Adjust this path to match your SVG file location
        alt="Loading..."
        className="h-12 w-12 animate-spin"
      />
    </div>
  );
}
