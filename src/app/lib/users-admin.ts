import { cache } from "react";
import { UserProfile } from "./users";
import { adminDb } from "./firebase-admin";

export const getUserProfile = cache(async (uid: string): Promise<UserProfile | null> => {
    const doc = await adminDb.collection("users").doc(uid).get();

    if (!doc.exists) return null;
    return doc.data() as UserProfile;
});