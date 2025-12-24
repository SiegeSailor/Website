"use server";

import DivisionFloating from "@/components/DivisionFloating";

export default async function ({
  experience,
}: Readonly<{ experience: string }>) {
  return (
    <DivisionFloating
      volume={2.5}
      direction="horizontal"
      className="absolute top-28 right-4 w-1/2"
    >
      <div className="transition-opacity duration-2000 ease-in-out text-lg text-default-600 text-right font-normal leading-8 p-2">
        {experience} in
        <div className="font-semibold text-default-700">
          Software Engineering
        </div>
      </div>
    </DivisionFloating>
  );
}
