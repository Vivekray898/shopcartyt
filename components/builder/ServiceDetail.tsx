"use client";

// components/ServiceDetail.tsx
import React, { useState } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

interface ServiceDetailProps {
  title: string;
  description: string;
  images: any[];
  features?: string[];
  serviceTypes?: Array<{ name: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  amenities?: Array<{
    name: string;
    items: Array<{ label: string; description: string }>;
  }>;
}

export default function ServiceDetail({
  title,
  description,
  images,
  features = [],
  serviceTypes = [],
  faqs = [],
  amenities = [],
}: ServiceDetailProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="trv-detail-main-wrap">
      {/* Image Slider */}
      {images && images.length > 0 && (
        <div className="mb-6.25">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="trv_d-slider"
          >
            {images.map((image, idx) => (
              <SwiperSlide key={idx}>
                <div className="rounded-3xl overflow-hidden">
                  <Image
                    src={urlFor(image).url()}
                    alt={`Service image ${idx + 1}`}
                    width={834}
                    height={406}
                    className="rounded-3xl w-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Content */}
      <div className="rounded-3xl md:p-7.5 p-5 bg-white">
        <h3 className="md:text-36 text-28 mb-5">{title}</h3>
        <div className="mb-7.5">
          <p className="mb-1 font-title">{description}</p>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <>
            <h4 className="md:text-28 text-22 mb-6.25">Key Features</h4>
            <ul className="mb-10">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="md:text-lg text-base font-normal relative pl-11.25 mb-4.5 text-primary font-base"
                >
                  <i className="fa-solid fa-circle-check absolute text-2xl text-secondary left-0 top-px"></i>
                  {feature}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Service Types */}
        {serviceTypes.length > 0 && (
          <>
            <h4 className="md:text-28 text-22 mb-6.25">Types of Services</h4>
            <div className="border-[6px] mb-10 rounded-3xl bg-white border-aquagray">
              <ul>
                {serviceTypes.map((type, idx) => (
                  <li
                    key={idx}
                    className={`sm:flex flex-nowrap ${
                      idx < serviceTypes.length - 1 ? "border-b border-aquagray" : ""
                    }`}
                  >
                    <div className="sm:min-w-48.75 sm:w-48.75 py-3.75 md:px-7.5 px-3.75 max-sm:pb-0">
                      <span className="block text-xl font-title text-primary font-medium">
                        {type.name}
                      </span>
                    </div>
                    <div className="flex-1 py-3.75 px-5 border-l border-aquagray text-base">
                      <p>{type.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <>
            <h4 className="md:text-28 text-22 mb-6.25">
              Frequently Asked Questions
            </h4>
            <div className="border-[6px] border-aquagray mb-10 rounded-3xl bg-white sm:p-7.5 p-4.5 tab-content">
              <div className="custom-accordion style-2 myAccordion">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="relative duration-500 accordion-item">
                    <div
                      className="relative accordion-header duration-500 cursor-pointer"
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    >
                      <h4 className="text-lg">
                        <a className="sm:text-2xl text-xl bg-white border-b border-aquagray block py-5 pr-7.5">
                          {faq.question}
                          <span className="pt-5 pb-3.75 text-primary absolute right-3 top-1.5 h-full text-22 flex duration-500">
                            <i className="las la-angle-right relative top-1/2 left-1/2 -translate-1/2"></i>
                          </span>
                        </a>
                      </h4>
                    </div>
                    {activeFaq === idx && (
                      <div className="accordion-content">
                        <div className="content-inner sm:p-5 py-5 sm:pl-10 text-base border-b border-aquagray bg-white">
                          {faq.answer}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Amenities */}
        {amenities.length > 0 && (
          <>
            <h4 className="md:text-28 text-22 mb-6.25">Amenities</h4>
            {amenities.map((category, idx) => (
              <div
                key={idx}
                className={`rounded-3xl bg-eggshell ${idx < amenities.length - 1 ? "mb-10" : ""}`}
              >
                <ul>
                  <li className="flex flex-nowrap border-aquagray border-b">
                    <div className="text-2xl font-semibold font-title sm:pt-10 pt-5 px-7.5 pb-2.5">
                      {category.name}
                    </div>
                  </li>
                  {category.items.map((item, itemIdx) => (
                    <li
                      key={itemIdx}
                      className={`sm:flex flex-nowrap ${
                        itemIdx < category.items.length - 1 ? "border-aquagray border-b" : ""
                      }`}
                    >
                      <div className="sm:min-w-48.75 sm:w-48.75 py-3.75 md:px-7.5 px-3.75 max-sm:pb-0">
                        <span className="block text-xl font-title text-primary font-medium">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex-1 py-3.75 px-5 text-base sm:border-l border-aquagray">
                        <p>{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}