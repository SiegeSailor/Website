import SpinnerCenter from "@/components/SpinnerCenter";

// Sub-level `loading.tsx` doesn't work with dynamic route segments.
export default async function () {
  return <SpinnerCenter />;
}
