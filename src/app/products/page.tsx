import { searchProducts } from "@/app/lib/products";
import ProductFilterSidebar from "@/app/components/ProductFilterSidebar";
import ProductCard from "@/app/components/ProductCard";

export function generateMetadata() {
    return {
        title: "Tìm kiếm sản phẩm - Apple Store",
        description: "Kết quả tìm kiếm và lọc sản phẩm",
    };
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const params = await searchParams;

    const products = await searchProducts({
        search: params.search,
        category: params.category,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        storageGB: params.storage,
        color: params.color,
        sort: params.sort as "price_asc" | "price_desc" | "newest" | undefined,
    });

    return (
        <div className="max-w-7xl mx-auto px-2 py-6 grid grid-cols-4 gap-6">
            <ProductFilterSidebar />
            <div className="col-span-3">
                <p className="text-sm text-gray-500 mb-3">{products.length} sản phẩm</p>
                {products.length === 0 ? (
                    <p className="text-center text-gray-500 py-20">Không tìm thấy sản phẩm nào</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}