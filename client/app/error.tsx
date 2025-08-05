"use client";

export default function ({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <div>
      <h1>An error occurred</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
