// components/AccordionSection.tsx
"use client";
import React, { useState } from "react";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionSectionProps {
  items: AccordionItem[];
  style?: "default" | "bordered";
}

export default function AccordionSection({
  items,
  style = "bordered",
}: AccordionSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const containerClass =
    style === "bordered"
      ? "border-[6px] border-aquagray rounded-3xl bg-white sm:p-7.5 p-4.5"
      : "";

  return (
    <div className={containerClass}>
      <div className="custom-accordion style-2 myAccordion">
        {items.map((item, index) => (
          <div key={index} className="relative duration-500 accordion-item">
            <div
              className="relative accordion-header duration-500 cursor-pointer"
              onClick={() => toggleItem(index)}
            >
              <h4 className="text-lg">
                <a
                  className={`sm:text-2xl text-xl bg-white ${
                    index < items.length - 1 ? "border-b border-aquagray" : ""
                  } block py-5 pr-7.5`}
                >
                  {item.title}
                  <span className="pt-5 pb-3.75 text-primary absolute right-3 top-1.5 h-full text-22 flex duration-500">
                    <i
                      className={`las la-angle-right relative top-1/2 left-1/2 -translate-1/2 ${
                        activeIndex === index ? "rotate-90" : ""
                      }`}
                    ></i>
                  </span>
                </a>
              </h4>
            </div>
            {activeIndex === index && (
              <div className="accordion-content">
                <div
                  className={`content-inner sm:p-5 py-5 sm:pl-10 text-base ${
                    index < items.length - 1 ? "border-b border-aquagray" : ""
                  } bg-white`}
                >
                  {item.content}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}