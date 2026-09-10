import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { adminDb } from "./firebase-admin";
import { cache } from "react";

export type Gender = "male" | "female" | "other";

export type Address = {
    id: string,
    province: string,
    district: string,
    commune: string,
    recipientAddress: string,
};

export type UserProfile = {
    name: string;
    dob: string;
    tel: string;
    email: string;
    gender?: Gender;
    defaultAddress?: Address;
};

export async function createUserProfile(
    uid: string, 
    data: Pick<UserProfile, "name" | "dob" | "tel" | "email">
) {
    const userRef = doc(db, "users", uid);
    try {
        await setDoc(userRef, data); 
    } catch(error) {
        console.error("Failed to create user profile:", error);
        throw error;
    }
}

export async function updateUserProfile(
    uid: string,
    data: Partial<Pick<UserProfile, "name" | "dob" | "tel" | "gender">>
) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
}


