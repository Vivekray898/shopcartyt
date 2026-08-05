// components/GallerySection.tsx
import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

interface GallerySectionProps {
  images: any[];
  columns?: number;
}

export default function GallerySection({
  images,
  columns = 3,
}: GallerySectionProps) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    6: "grid-cols-3 md:grid-cols-6",
  }[columns] || "grid-cols-2 md:grid-cols-3";

  return (
    <ul className={`grid ${colClass} gap-4`}>
      {images.map((image, index) => (
        <li key={index} className="group">
          <div className="relative z-1 overflow-hidden rounded-xl">
            <a
              className="block text-center relative bg-primary"
              href={urlFor(image).url()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={urlFor(image).url()}
                alt={`Gallery image ${index + 1}`}
                width={400}
                height={300}
                className="h-52 w-full object-cover object-center duration-500 group-hover:opacity-30 group-hover:scale-110"
              />
              <i className="fa fa-file-image opacity-0 size-12 !leading-12 rounded-full bg-white text-primary absolute top-1/2 left-1/2 -translate-1/2 duration-500 group-hover:opacity-100"></i>
            </a>
          </div>
        </li>
      ))}
    </ul>
  );
}