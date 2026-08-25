import RegisterForm from "../components/Auth/RegisterForm";

export function generateMetadata() {
    return {
        title: "Đăng kí - Apple Store",
        description: "Apple Store signup page",
    }
}

export default function Register() {
    return (
        <RegisterForm />
    );
}