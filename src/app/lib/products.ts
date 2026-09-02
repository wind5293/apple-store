import { db } from "./firebase";
import { collection, getDocs, limit, query, where, QueryConstraint, documentId } from "firebase/firestore";
import { ProductWithId } from "../types/products";
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