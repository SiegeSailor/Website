import React from "react";

export default function ({
  items,
}: {
  items: { title: string; time: string }[];
}) {
  return (
    <ol>
      {items.map((item, index) => {
        const opacity = 100 - (items.length - index - 1) * 25;
        return (
          <li
            className={`h-14 flex items-center relative pl-4 ml-2 border-l-2 border-default-700 opacity-${opacity}`}
            key={item.title}
          >
            <div className="absolute top-0 -left-1 w-2.5 h-2.5 bg-black rounded-lg translate-y-6" />
            <div className="flex flex-col translate-y-6">
              <p className="text-medium text-nowrap">{item.title}</p>
              <p className="text-sm text-nowrap text-default-400">
                {item.time}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
