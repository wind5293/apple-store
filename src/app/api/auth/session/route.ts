import { adminAuth } from "@/app/lib/firebase-admin"
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const { idToken } = await request.json();
        
        await adminAuth.verifyIdToken(idToken);

        const expiresIn = 5 * 60 * 60 * 1000;
        const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

        const cookieStore = await cookies();
        cookieStore.set("session", sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: expiresIn / 1000,
            path: "/",
        });

        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ success: false, error }, { status: 401 });
    }
}