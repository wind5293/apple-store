import { db } from "./firebase";
import { collection, getDocs, limit, query, where, QueryConstraint } from "firebase/firestore";
import { ProductWithId } from "../types/products";

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