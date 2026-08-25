import ProductCard from "./components/ProductCard";
import { getFeaturedProducts, getProductsByCategory } from "./lib/products";

export function generateMetadata() {
    return {
        title: "Trang chủ - Apple Store",
        description: "Apple Store homepage",
    }
}

export default async function Home() {
    const [products, iPhoneProducts] = await Promise.all([
        getFeaturedProducts(),
        getProductsByCategory("iphone", 8),
    ]);

    return (
        <div className="flex flex-col gap-6 justify-center items-center">

            <div className="flex flex-col gap-4">
                <span className="font-bold text-2xl">Sản phẩm nổi bật</span>
                <div className="grid grid-cols-4 gap-5">
                    {products.map((product, index) => (
                        <ProductCard key={product.id} product={product} priority={index === 0} />
                    ))}
                </div>
            </div>
            <div className="flex flex-col gap-4">
                <span className="font-bold text-2xl">iPhone bán chạy</span>
                <div className="grid grid-cols-4 gap-5">
                    {iPhoneProducts.map((product, index) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
