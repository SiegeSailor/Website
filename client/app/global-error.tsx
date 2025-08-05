"use client";

export default async function ({
  error,
  reset,
}: Readonly<{ error: Error; reset: () => void }>) {
  return (
    <html>
      <body>
        <h1>An error occurred</h1>
        <p>{error.message}</p>
        <button onClick={reset}>Try again</button>
      </body>
    </html>
  );
}
