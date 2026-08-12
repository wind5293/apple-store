import { db } from "./firebase";
import { collection, getDocs, limit, query } from "firebase/firestore";
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