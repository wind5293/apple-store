import Image from "next/image";
import { ProductWithId } from "../types/products"
import Link from "next/link";
import { hasDiscount } from "../lib/helpers";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product, priority }: {
    product: ProductWithId,
    priority?: boolean
}) {
    const inStock = product.stockQuantity > 0;
    const ramSpec = product.specs.find((spec) => spec.name === "Dung lượng RAM");
    const storageGBSpec = product.storageGB;

    function statusBackgroundColor() {
        return inStock ? "bg-[#DFF9E8]" : "bg-[#F2F2F3]";
    }

    return (
        <div className="flex flex-col items-stretch gap-3 p-5 w-68 max-h-120 bg-white hover:shadow-sm border border-gray-200 rounded-md relative">
            {product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                    -{product.discountPercent}%
                </span>
            )}
            <Link href={`/products/${product.slug}`} className="flex flex-col gap-3">
                <div className="relative aspect-square w-full">
                    <Image
                        fill
                        sizes="25vw"
                        priority={priority}
                        src={product.thumbnailUrl}
                        alt={`thumbnail ${product.name}`}
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-bold line-clamp-2">{product.name}</h3>
                    <div className="flex flex-row items-center gap-2">
                        <h2 className="text-lg font-extrabold text-red-500">
                            {product.price.toLocaleString("vi-VN")}đ
                        </h2>
                        {hasDiscount(product) &&
                            <h3 className={`font-bold text-gray-400 line-through`}>
                                {product.originalPrice.toLocaleString("vi-VN") + "đ"}
                            </h3>
                        }
                    </div>
                    <p className={`text-xs p-1 ${statusBackgroundColor()} w-fit rounded-sm`}>
                        {inStock ? "Còn hàng" : "Hết hàng"}
                    </p>
                    <div className="flex flex-row gap-1 mt-1">
                        {ramSpec && (
                            <div className="border border-gray-400 text-[11px] p-1 rounded-md">{ramSpec.value}</div>
                        )}
                        {storageGBSpec && (
                            <div className="border border-gray-400 text-[11px] p-1 rounded-md">{storageGBSpec}</div>
                        )}
                    </div>
                </div>
            </Link>
            <AddToCartButton productId={product.id} />
        </div>
    );
}
