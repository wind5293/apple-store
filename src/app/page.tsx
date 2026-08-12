import ProductCard from "./components/ProductCard";
import { getFeaturedProducts } from "./lib/products";

export default async function Home() {
    const products = await getFeaturedProducts();

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="grid grid-cols-4 gap-5">
                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index === 0} />
                ))}
            </div>
        </div>
    );
}
