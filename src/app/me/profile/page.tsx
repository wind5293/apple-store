import { getAuthenticatedUser } from "@/app/lib/firebase-admin";
import ProfileClient from "./ProfileClient";
import { getUserProfile } from "@/app/lib/users-admin";

export function generateMetadata() {
    return {
        title: "Thông tin tài khoản - Apple Store",
        description: "Trang thông tin tài khoản",
    };
}

export default async function Page() {
    const uid = (await getAuthenticatedUser()).uid;
    const userProfile = await getUserProfile(uid);

    return (
        <ProfileClient userProfile={userProfile} uid={uid} />
    );
}