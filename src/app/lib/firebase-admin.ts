import { cert, getApp, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth";

const envServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
if (!envServiceAccount) {
    throw new Error("Không có service account");
}

const decoded = Buffer.from(envServiceAccount, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decoded)

const app = getApps().length === 0 ? initializeApp({ credential: cert(serviceAccount) }) : getApp();
export const adminAuth = getAuth(app)