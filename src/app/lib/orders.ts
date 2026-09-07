import { CartItem } from "../context/CartContext";
import { ProductWithId } from "../types/products";
import { db } from "./firebase";
import { addDoc, collection, doc, getDoc, serverTimestamp, Timestamp, writeBatch } from "firebase/firestore";

type OrderItem = {
    productId: string,
    quantity: number,
    priceAtOrder: number,
}

type PickupInfo = {
    type: "pickup",
    province: string,
    district: string,
    shopAddress: string
}

type DeliveryInfo = {
    type: "delivery",
    recipientName: string,
    recipientNumber: string,
    province: string,
    district: string,
    commune: string,
    recipientAddress: string
}

export type ShippingInfo = PickupInfo | DeliveryInfo;

type DraftOrder = {
    id: string,
    uid: string,
    items: OrderItem[],
    status: "draft",
    createdAt: Timestamp,
}

export type CompletedOrder = {
    id: string,
    uid: string,
    items: OrderItem[],
    status: "completed",
    createdAt: Timestamp,
    shippingInfo: ShippingInfo,
    email?: string,
    note?: string,
    paymentMethod: "" | "store" | "qr" | "vnpay" | "momo",
}

export type OrderWithId = DraftOrder | CompletedOrder;

export async function createOrder(uid: string, items: CartItem[], products: ProductWithId[], selectedIds: Set<string>): Promise<string> {
    const selectedItems = items.filter(item => selectedIds.has(item.productId));
    const orderItems = selectedItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Không tìm thấy sản phẩm");

        return {
            productId: item.productId,
            quantity: item.quantity,
            priceAtOrder: product.price
        }
    });

    const docRef = await addDoc(collection(db, "orders"), {
        uid: uid,
        items: orderItems,
        status: "draft",
        createdAt: serverTimestamp()
    });

    return docRef.id;
}

export async function getOrderById(orderId: string): Promise<OrderWithId | null> {

    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...docSnap.data()
    } as OrderWithId;
} 

export async function completeOrder(
    completionData: Pick<CompletedOrder, "shippingInfo" | "email" | "note" | "paymentMethod">,
    orderId: string,
    uid: string, 
    productIds: string[]
) {
    const batch = writeBatch(db);

    const orderRef = doc(db, "orders", orderId);
    batch.update(orderRef, {
        ...completionData,
        status: "completed",
    });

    productIds.forEach(productId => {
        const productRef = doc(db, "carts", uid, "items", productId);
        
        batch.delete(productRef);
    });
    await batch.commit();
}
