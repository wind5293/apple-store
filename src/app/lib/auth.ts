import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithEmailAndPassword, 
    signInWithPopup
} from "firebase/auth";
import { auth } from "./firebase";

export async function registerWithEmail(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password);
}

export async function signInWithEmail(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithGoogle() {
    const googleProvider = new GoogleAuthProvider();
    return await signInWithPopup(auth, googleProvider);
}

export function getAuthErrorMessage(code: string): string {
    switch (code) {
        case "auth/email-already-in-use":
            return "Email này đã được sử dụng."
        case "auth/weak-password":
            return "Mật khẩu yếu."
        case "auth/invalid-credential":
            return "Thông tin đăng nhập không hợp lệ."
        default:
            return "Đăng nhập thất bại."
    }
}