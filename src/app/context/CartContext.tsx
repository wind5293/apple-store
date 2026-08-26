"use client";
import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { deleteCartItem, getCartItems, setCartItem } from "../lib/cart";
import { Timestamp } from "firebase/firestore";

export type CartItem = {
    productId: string,
    quantity: number,
    updateAt: Date
}

export type CartContextType = {
    items: CartItem[],
    addToCart: (productId: string, quantity: number) => Promise<void>,
    setQuantity: (productId: string, quantity: number) => Promise<void>,
    deleteFromCart: (productId: string) => Promise<void>,
}

export const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: async (): Promise<void> => { },
    setQuantity: async (): Promise<void> => { },
    deleteFromCart: async (): Promise<void> => { }
});

function getTimeStamp(value: Date | Timestamp): number {
    if (value instanceof Date) {
        return value.getTime();
    } else {
        return value.toDate().getTime();
    }
}

function mergeItem(firestoreItems: CartItem[], localItems: CartItem[]): CartItem[] {
    const map = new Map<string, CartItem>();

    firestoreItems.forEach(item => {
        map.set(item.productId, item);
    });

    localItems.forEach(item => {
        const product = map.get(item.productId);
        if (product) {
            const localTimeUpdate = getTimeStamp(item.updateAt);
            const firebaseTimeUpdate = getTimeStamp(product.updateAt);
            if (firebaseTimeUpdate < localTimeUpdate) {
                map.set(item.productId, item);
            }
        } else {
            map.set(item.productId, item);
        }
    });

    return Array.from(map.values());
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const user = useAuth().user;

    async function addToCart(productId: string, quantity: number) {
        const existingItem = items.find(item => item.productId === productId);
        const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

        if (existingItem) {
            setItems(prevItems => prevItems.map(item => {
                if (item.productId === productId) {
                    return { ...item, quantity: newQuantity }
                } else {
                    return item;
                }
            }));
        } else {
            const newItem: CartItem = { productId: productId, quantity: quantity, updateAt: new Date() }
            setItems(prevItems => [...prevItems, newItem]);
        }

        if (user) {
            await setCartItem(user.uid, productId, newQuantity);
        }
    }

    async function setQuantity(productId: string, quantity: number) {
        setItems(items.map(item => {
            if (item.productId === productId) {
                return { ...item, quantity: quantity }
            } else {
                return item;
            }
        }));

        if (user) {
            await setCartItem(user.uid, productId, quantity);
        }
    }

    async function deleteFromCart(productId: string) {
        setItems(prevItems => prevItems.filter(item => item.productId !== productId));
        if (user) {
            await deleteCartItem(user.uid, productId);
        }
    }

    useEffect(() => {
        async function syncCart(uid: string) {
            const fetchedItems = await getCartItems(uid);
            const mergeCart = mergeItem(fetchedItems, items);

            setItems(mergeCart);
            await Promise.all(mergeCart.map(item => setCartItem(uid, item.productId, item.quantity)));
        }

        if (user) {
            syncCart(user.uid);
        } else {
            setItems([]);
        }
    }, [user]); // Khó quá

    return (
        <CartContext.Provider value={{ items, addToCart, setQuantity, deleteFromCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
