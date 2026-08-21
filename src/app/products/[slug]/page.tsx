import ProductGallery from "@/app/components/ProductDetail/ProductGallery";
import ProductHeader from "@/app/components/ProductDetail/ProductHeader";
import ProductInfo from "@/app/components/ProductDetail/ProductInfo";
import SpecsTable from "@/app/components/ProductDetail/SpecsTable";
import { getProductBySlug, getProductsByGroupId } from "@/app/lib/products";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = await getProductBySlug(slug);

    if (!product) {
        return { title: "Không tìm thấy sản phẩm" };
    } 

    return {
        title: product.name,
        description: product.shortDescription,
        openGraph: {
            title: product.name,
            description: product.shortDescription,
            images: [product.thumbnailUrl]
        }
    }
}

export default async function ProductDetailPage({ params }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);
    if (!product) return notFound();

    const variants = await getProductsByGroupId(product.productGroupId);

    return (
        <div className="min-h-screen">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white max-w-7xl mx-auto px-4 py-8">
                <div className="">
                    <ProductHeader name={product.name} rating={product.rating} totalReviews={product.totalReviews} />
                    <ProductGallery images={product.images} productName={product.name} />
                    <SpecsTable specs={product.specs} />
                </div>
                <div>
                    <ProductInfo product={product} variants={variants}/>
                </div>
            </div>
        </div>
    );
}