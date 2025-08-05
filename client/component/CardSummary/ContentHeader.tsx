import FloatingDivision from "@/component/FloatingDivision";

export default function ({ experience }: Readonly<{ experience: string }>) {
  return (
    <FloatingDivision
      volume={2.5}
      direction="horizontal"
      className="absolute top-28 right-4 -translate-x-1/2 -translate-y-1/2 w-1/2"
    >
      <div className="transition-opacity duration-2000 ease-in-out text-lg text-default-600 text-right font-normal leading-8 p-2 rounded-sm">
        {experience} in
        <div className="font-semibold text-default-700">
          Software Engineering
        </div>
      </div>
    </FloatingDivision>
  );
}
