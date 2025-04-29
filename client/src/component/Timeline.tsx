import React from "react";

export default function ({
  items,
}: {
  items: { title: string; time: string }[];
}) {
  return (
    <ol className="-translate-y-8">
      {items.map((item, index) => {
        const level = (index + 1) * 100 + (700 - items.length * 100);
        const opacity = (level + 100) / 10 + (70 - items.length * 10);
        return (
          <li
            className={`h-12 flex items-center relative pl-4 ml-2 border-l-2 border-default-${level}`}
            key={item.title}
          >
            <div
              className={`absolute top-0 z-10 -left-1 w-3 h-3 bg-default-${level} rounded-lg translate-y-6`}
            />
            <div className={`flex flex-col translate-y-6 opacity-${opacity}`}>
              <p className="text-sm text-nowrap">{item.title}</p>
              <p className="text-tiny text-nowrap text-default-400">
                {item.time}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
