import { ProductWithId } from "@/app/types/products";
import Link from "next/link";

export default function ProductInfo({ product, variants }: { product: ProductWithId, variants: ProductWithId[] }) {
    const inStock = product.stockQuantity > 0;

    function statusBackgroundColor() {
        return inStock ? "bg-[#DFF9E8]" : "bg-[#F2F2F3]";
    }

    return (
        <div className="flex flex-col w-full gap-3">
            <div className="flex flex-col w-full justify-center items-center border border-[#84B1FB] bg-[#F6FAFF] rounded-2xl py-6">
                <h2 className="text-xl font-semibold">{product.price.toLocaleString("vi-VN")}đ</h2>
                <p className="text-medium text-gray-400 line-through">{product.originalPrice.toLocaleString("vi-VN")}đ</p>
            </div>
            <h3 className="font-bold">Phiên bản</h3>
            <div className="flex flex-row gap-4">
                {variants.map((variant) => {
                    const isActive = variant.id === product.id;
                    return (
                        <Link
                            key={variant.id}
                            href={`/products/${variant.slug}`}
                            className={`flex flex-1 border-2 h-15 rounded-md p-6 justify-center items-center font-semibold ${isActive ? "border-[#D70018]": "border-gray-300"}`}
                        >
                            <span>{variant.storageGB}</span>
                        </Link>
                    );
                })}
            </div>
            <h3 className="font-bold">Màu sắc</h3>
            <div className="flex flex-row gap-4">
                {product.colors.map((color) => (
                    <div
                        key={color}
                        className="flex flex-1 border-2 border-gray-300 h-15 rounded-md p-6 justify-center items-center text-center"
                    >
                        <span>{color}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}