import { getAuthenticatedUser } from "@/app/lib/firebase-admin";
import { redirect } from "next/navigation";
import PaymentInfoClient from "./PaymentInfoClient";
import { getOrderByIdAdmin } from "@/app/lib/orders-admin";

export function generateMetadata() {
    return {
        title: "Thông tin thanh toán - Apple Store",
        description: "Trang thông tin thanh toán",
    }
}

export default async function Page({ params }: { 
    params: Promise<{ orderId: string }> 
}) {
    const { orderId } = await params;

    const decodeClaims = await getAuthenticatedUser();
    
    const order = await getOrderByIdAdmin(orderId);
    if (!order) {
        redirect("/cart");
    }
    if (order.uid !== decodeClaims.uid) {
        redirect("/cart");
    }

    return (
        <PaymentInfoClient order={order} />
    );
}
