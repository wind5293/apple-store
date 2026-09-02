"use client";
import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, productName }: {
    images: string[],
    productName: string;
}) {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div>
            <div className="relative aspect-square w-full max-w-md mx-auto overflow-hidden">
                <div
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                    className="flex flex-row transition-transform duration-500 ease-in-out h-full"
                >
                    {images.map((image, i) => (
                        <div key={i} className="relative w-full aspect-square shrink-0">
                            <Image
                                fill
                                priority={i === 0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                src={image}
                                alt={`${productName} ${i + 1} img`}
                                className="object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-row gap-2 mt-3 overflow-x-auto">
                {images.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveIndex(i)}
                        className={`flex flex-row border-2 rounded-md overflow-hidden ${activeIndex === i ? "border-[#D70018]" : "border-gray-300"
                            }`}
                    >
                        <Image
                            width={60}
                            height={60}
                            className="object-contain"
                            src={img}
                            alt={`${productName} ${i} img`}
                        />
                    </button>
                ))}
            </div>
        </div>
    );
}