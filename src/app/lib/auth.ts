import { 
    createUserWithEmailAndPassword, 
    EmailAuthProvider, 
    GoogleAuthProvider, 
    reauthenticateWithCredential, 
    signInWithEmailAndPassword, 
    signInWithPopup,
    updatePassword
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

export async function changeUserPassword(currentPassword: string, newPassword: string) {
    const user = auth.currentUser;
    if (!user || !user.email) {
        throw { code: "auth/no-current-user" };
    }

    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
}

export function getAuthErrorMessage(code: string): string {
    switch (code) {
        case "auth/email-already-in-use":
            return "Email này đã được sử dụng."
        case "auth/weak-password":
            return "Mật khẩu yếu."
        case "auth/invalid-credential":
            return "Thông tin đăng nhập không hợp lệ."
        case "auth/wrong-password":
            return "Mật khẩu hiện tại không đúng."
        case "auth/no-current-user":
            return "Đăng nhập hết hạn, vui lòng đăng nhập lại."
        default:
            return "Đăng nhập thất bại."
    }
}