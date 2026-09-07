import { collection, doc, getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { CartItem } from "../context/CartContext";

export async function getCartItems(uid: string): Promise<CartItem[]> {
    const itemsRef = collection(db, "carts", uid, "items");
    const querySnapshot = await getDocs(itemsRef);
    const docs = querySnapshot.docs.map((item) => (
        {
            productId: item.id,
            ...item.data()
        } as CartItem
    ));

    return docs;
}

export async function setCartItem(uid: string, productId: string, quantity: number) {
    const itemRef = doc(db, "carts", uid, "items", productId);
    await setDoc(itemRef, {
        quantity,
        updateAt: serverTimestamp(),
    });

}

export async function deleteCartItem(uid: string, productId: string) {
    const itemRef = doc(db, "carts", uid, "items", productId);
    await deleteDoc(itemRef);
}

