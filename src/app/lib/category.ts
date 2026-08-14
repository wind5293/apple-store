import { collection, getDocs, query } from "firebase/firestore";
import { CategoryWithId } from "../types/category";
import { db } from "./firebase";

export async function getCategories(): Promise<CategoryWithId[]> {
    const querySnapshot = await getDocs(query(collection(db, "categories")));
    const docs = querySnapshot.docs.map((item) => (
        { 
            id: item.id,
            ...item.data()
        } as CategoryWithId
    ));

    return docs;
}