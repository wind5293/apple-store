import { getAuthenticatedUser } from "@/app/lib/firebase-admin";
import { getUserProfile } from "@/app/lib/users-admin";
import { getUserOrders } from "@/app/lib/orders-admin";
import MeBanner from "./MeBanner";
import MeSidebar from "./MeSidebar";

export default async function MeLayout({ children }: { children: React.ReactNode }) {
    const uid = (await getAuthenticatedUser()).uid;

    const [userProfile, orders] = await Promise.all([
        getUserProfile(uid),
        getUserOrders(uid),
    ]);

    return (
        <div className="bg-[#E4E4E7] min-h-screen ">
            <div className="max-w-7xl mx-auto flex flex-col gap-3 p-4">
                <MeBanner
                    name={userProfile?.name ?? "-"}
                    tel={userProfile?.tel ?? ""}
                    totalOrders={orders.length}
                />
                <div className="flex flex-row gap-3">
                    <MeSidebar />
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}