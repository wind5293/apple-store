import { cache } from "react";
import { adminDb } from "./firebase-admin";
import { OrderWithId } from "./orders";

export async function getOrderByIdAdmin(orderId: string): Promise<OrderWithId | null> {
    const doc = await adminDb.collection("orders").doc(orderId).get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data()?.createdAt.toDate()
    } as OrderWithId;
}

export const getUserOrders = cache(async (uid: string): Promise<OrderWithId[]> => {
    const snapshot = await adminDb.collection("orders")
        .where("uid", "==", uid)
        .where("status", "==", "completed")
        .orderBy("createdAt", "desc")
        .get();

    return snapshot.docs.map(doc => (
        {
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data()?.createdAt?.toDate(),
        } as OrderWithId
    ));
});