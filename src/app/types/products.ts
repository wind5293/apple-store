import { Timestamp } from "firebase/firestore";

type ProductSpecs = {
    name: string,
    value: string,
};

export type Product = {
    brand: string,
    categoryId: string, 
    categoryName: string,
    categorySlug: string, 
    colors: string[],
    createdAt: Timestamp,
    description: string,
    discountPercent: number,
    images: string[],
    name: string,
    originalPrice: number,
    price: number,
    productGroupId: string,
    rating: number,
    shortDescription: string,
    sku: string,
    slug: string,
    sourceUrl: string,
    specs: ProductSpecs[],
    status: "active" | "inactive" | "out_of_stock" | "discontinued",
    stockQuantity: number,
    storageGB: string, 
    thumbnailUrl: string, 
    totalReviews: number,
    updatedAt: Timestamp
};

export type ProductWithId = Product & { id: string };