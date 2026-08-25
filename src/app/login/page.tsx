import LoginForm from "../components/Auth/LoginForm";

export function generateMetadata() {
    return {
        title: "Đăng nhập - Apple Store",
        description: "Apple Store login page",
    }
}

export default function Login() {
    return (
        <LoginForm />
    );
}