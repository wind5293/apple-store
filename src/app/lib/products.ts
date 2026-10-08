import { db } from "./firebase";
import { collection, getDocs, limit, query, where, QueryConstraint, documentId } from "firebase/firestore";
import { ProductFilters, ProductWithId } from "../types/products";
import { cache } from "react";

export async function getFeaturedProducts(count: number = 8): Promise<ProductWithId[]> {
    const q = query(collection(db, "products"), limit(count));

    const querySnapshot = await getDocs(q);
    const docs = querySnapshot.docs.map((item) => (
        {
            id: item.id,
            ...item.data()
        } as ProductWithId
    ));

    return docs;
}

export async function getProductsByCategory(categorySlug: string, count?: number): Promise<ProductWithId[]> {
    const cond: QueryConstraint[] = [where("categorySlug", "==", categorySlug)];
    if (count) {
        cond.push(limit(count));
    }

    const querySnapshot = await getDocs(query(collection(db, "products"), ...cond));
    const docs = querySnapshot.docs.map((item) => (
        {
            id: item.id,
            ...item.data()
        } as ProductWithId
    ));

    return docs;
}

export const getProductBySlug = cache(async(productSlug: string): Promise<ProductWithId | null> => {
    const querySnapshot = await getDocs(query(
        collection(db, "products"), 
        where("slug", "==", productSlug),
        limit(1)
    ));

    const docs = querySnapshot.docs[0];
    if (docs) {
        const productDetail = {
            id: docs.id,
            ...docs.data()
        } as ProductWithId;

        return productDetail;
    } 
    return null;
});

export async function getProductsByGroupId(productGroupId: string): Promise<ProductWithId[]> {
    const querySnapshot = await getDocs(query(
        collection(db, "products"),
        where("productGroupId", "==", productGroupId),
    ));

    const docs = querySnapshot.docs.map((item) => (
        {
            id: item.id,
            ...item.data()
        } as ProductWithId
    ));

    return docs;
}

export async function getProductsByIds(productIds: string[]) : Promise<ProductWithId[]> {
    if (productIds.length === 0) return [];

    const querySnapshot = await getDocs(query(
        collection(db, "products"),
        where(documentId(), "in", productIds)
    ));

    const docs = querySnapshot.docs.map((item) => (
        {
            id: item.id,
            ...item.data()
        } as ProductWithId
    ));
    return docs;
}

export async function searchProducts(filters: ProductFilters): Promise<ProductWithId[]> {
    const cond: QueryConstraint[] = [where("status", "==", "active")];
    if (filters.category) {
        cond.push(where("categorySlug", "==", filters.category));
    }
    cond.push(limit(200));

    const querySnapshot = await getDocs(query(collection(db, "products"), ...cond));
    let docs = querySnapshot.docs.map((item) => (
        {
            id: item.id,
            ...item.data()
        } as ProductWithId
    ));

    if (filters.search) {
        const keyword = filters.search.trim().toLowerCase();
        docs = docs.filter(p => p.name.toLowerCase().includes(keyword));
    }
    if (filters.minPrice !== undefined) {
        docs = docs.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
        docs = docs.filter(p => p.price <= filters.maxPrice!);
    }
    if (filters.storageGB) {
        docs = docs.filter(p => p.storageGB === filters.storageGB);
    }
    if (filters.color) {
        docs = docs.filter(p => p.colors.includes(filters.color!));
    }

    switch (filters.sort) {
        case "price_asc":
            docs = [...docs].sort((a, b) => a.price - b.price);
            break;
        case "price_desc":
            docs = [...docs].sort((a, b) => b.price - a.price);
            break;
        case "newest":
            docs = [...docs].sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
            break;
    }

    return docs;
}