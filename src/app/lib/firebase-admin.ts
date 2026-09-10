import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const envServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
if (!envServiceAccount) {
    throw new Error("Không có service account");
}

const decoded = Buffer.from(envServiceAccount, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decoded)

export const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApp();
export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

export const getAuthenticatedUser = cache(async () => {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) {
        redirect("/login");
    }

    let decodeClaims;
    try {
        decodeClaims = await adminAuth.verifySessionCookie(sessionCookie);
    } catch (error) {
        console.error("Phiên đăng nhập hết hạn");
        redirect("/login");
    }

    return decodeClaims;
});