import { adminAuth } from "@/app/lib/firebase-admin";
import { cookies } from "next/headers";
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

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) {
        redirect("/login");
    }

    let decodeClaims;
    try {
        decodeClaims = await adminAuth.verifySessionCookie(sessionCookie); 
    } catch(error) {
        console.error("Phiên đăng nhập hết hạn");
        redirect("/login");
    }
    
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
