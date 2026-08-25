"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthErrorMessage, registerWithEmail, signInWithGoogle } from "@/app/lib/auth";
import { ChevronLeft } from "lucide-react";

export default function RegisterForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [tel, setTel] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorState, setErrorState] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
        tel?: string;
        dob?: string;
        name?: string;
        general?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneRegex = /^0\d{9,10}$/

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const newErrors: typeof errorState = {};
        if (!email) {
            newErrors.email = "Vui lòng nhập email";
        } else if (!emailRegex.test(email)) {
            newErrors.email = "Email không hợp lệ";
        }
        if (!phoneRegex.test(tel)) {
            newErrors.tel = "Số điện thoại không hợp lệ";
        }
        if (password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu nhập lại không khớp";
        }

        setErrorState(newErrors);
        if (Object.keys(newErrors).length > 0) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await registerWithEmail(email, password);
            if (result) {
                const idToken = await result.user.getIdToken();
                await fetch("/api/auth/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });
                router.push("/");
            }
        } catch (err) {
            const error = err as { code: string };
            if (error.code === "auth/email-already-in-use") {
                setErrorState({ email: getAuthErrorMessage(error.code) });
            } else {
                setErrorState({ general: getAuthErrorMessage(error.code) });
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-4 pb-40">
                <h1 className="font-bold text-[#D70018] text-3xl">Đăng ký</h1>
                <Image
                    width={300}
                    height={50}
                    src="/store-logo.png"
                    alt="store logo"
                />
                <p className="text-[#71717A] font-semibold">Đăng kí bằng các tài khoản</p>
                <div>
                    <button
                        onClick={() => signInWithGoogle}
                        className="w-40 shadow-md p-5 rounded-md font-semibold"
                    >
                        Google
                    </button>
                </div>

                <p className="text-[#71717A] font-semibold">Hoặc điền thông tin ở dưới</p>
                <div className="flex flex-col gap-4">
                    <form
                        id="signupForm"
                        onSubmit={handleSubmit}
                        className="grid grid-cols-2 gap-4"
                    >
                        <h2 className="col-span-2 font-bold text-lg">Thông tin cá nhân</h2>
                        <div className="flex flex-col">
                            <label className="font-semibold">Họ và tên</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập họ và tên"
                                className={`input-field ${errorState.name ? "border-red-400" : ""}`}
                            />
                            {errorState.name && <p className="text-red-500 text-sm">{errorState.name}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">Ngày sinh</label>
                            <input
                                type="date"
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                className={`input-field ${errorState.dob ? "border-red-400" : ""}`}
                            />
                            {errorState.dob && <p className="text-red-500 text-sm">{errorState.dob}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">Số điện thoại</label>
                            <input
                                type="tel"
                                value={tel}
                                onChange={(e) => setTel(e.target.value)}
                                placeholder="Nhập số điện thoại"
                                className={`input-field ${errorState.tel ? "border-red-400" : ""}`} />
                            {errorState.tel && <p className="text-red-500 text-sm">{errorState.tel}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email"
                                className={`input-field ${errorState.email ? "border-red-400" : ""}`} />
                            {errorState.email && <p className="text-red-500 text-sm">{errorState.email}</p>}
                        </div>

                        <h2 className="col-span-2 font-bold text-lg">Tạo mật khẩu</h2>
                        <div className="flex flex-col">
                            <label className="font-semibold">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu của bạn"
                                className={`input-field ${errorState.password ? "border-red-400" : ""}`} />
                            {errorState.password && <p className="text-red-500 text-sm">{errorState.password}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold">Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu của bạn"
                                className={`input-field ${errorState.confirmPassword ? "border-red-400" : ""}`} />
                            {errorState.confirmPassword && <p className="text-red-500 text-sm">{errorState.confirmPassword}</p>}
                        </div>
                    </form>

                    <p>Bằng việc Đăng ký, bạn đã đọc và đồng ý với <span className="text-blue-600 font-semibold hover:underline hover:cursor-pointer">Điều khoản sử dụng</span> và <span className="text-blue-600 font-semibold hover:underline hover:cursor-pointer">Chính sách bảo mật</span> của chúng tôi
                    </p>
                </div>
            </div>
            <div className="flex fixed bottom-0 gap-4 p-8 bg-white w-full justify-center shadow-md">
                <button
                    onClick={() => router.push("/login")}
                    className="py-2 px-4 rounded-md font-semibold border border-gray-300 w-80 hover:cursor-pointer flex flex-row items-center justify-center gap-4"
                >
                    <ChevronLeft className="" /> Quay lại đăng nhập
                </button>
                <button
                    form="signupForm"
                    type="submit"
                    disabled={isLoading}
                    className="bg-[#ff102b] text-white py-2 px-4 rounded-md font-semibold w-80 hover:cursor-pointer hover:bg-[#D70018] disabled:bg-gray-600"
                >
                    Hoàn tất đăng ký
                </button>
            </div>
        </div>
    );
}