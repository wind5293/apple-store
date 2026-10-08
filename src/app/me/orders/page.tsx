import { getAuthenticatedUser } from "@/app/lib/firebase-admin";
import { getUserOrders } from "@/app/lib/orders-admin";
import OrderPageClient from "./OrderPageClient";

export function generateMetadata() {
    return {
        title: "Đơn hàng của tôi - Apple Store",
        description: "Lịch sử đơn hàng của bạn",
    };
}

export default async function Page() {
    const uid = (await getAuthenticatedUser()).uid;
    const orders = await getUserOrders(uid);

    return <OrderPageClient orders={orders} />;
}