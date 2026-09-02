"use client";
import { signInWithEmail, getAuthErrorMessage } from "@/app/lib/auth";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorState, setErrorState] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await signInWithEmail(email, password);
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
            setErrorState(getAuthErrorMessage(error.code));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="grid grid-cols-2 min-w-screen">
            <div>

            </div>
            <div className="flex flex-col justify-center items-center gap-6 px-8 max-w-full">
                <h1 className="font-bold text-[#D70018] text-3xl">Đăng nhập</h1>
                <form
                    action=""
                    className="flex flex-col gap-4 max-w-full"
                    onSubmit={(e) => 
                        handleSubmit(e)
                    }
                >
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Email</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Nhập email của bạn"
                            className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-96 focus:border-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nhập mật khẩu của bạn"
                            className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-96 focus:border-gray-400 focus:outline-none"
                        />
                    </div>
                    <div className="mt-3">
                        {errorState && <p className="text-red-500">{errorState}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-[#FF102B] hover:bg-[#D70018] rounded-lg p-3 text-center font-semibold text-white mt-2 w-96 disabled:bg-gray-600"
                        >
                            Đăng nhập
                        </button>
                    </div>
                </form>
                <Link href="/" className="text-[#3B82F6] font-medium hover:underline">Quên mật khẩu?</Link>
                <div>

                </div>
                <div>
                    <p>Bạn chưa có tài khoản? <Link href="/register" className="text-[#D70018] font-semibold">Đăng kí ngay</Link></p>
                </div>
            </div>
        </div>
    );

}