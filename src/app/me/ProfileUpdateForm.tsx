"use client";
import { useState } from "react";
import { Gender, updateUserProfile, UserProfile } from "@/app/lib/users";

type ProfileUpdateFormProps = {
    userProfile: UserProfile | null;
    uid: string;
}

export default function ProfileUpdateForm({ userProfile, uid }: ProfileUpdateFormProps) {
    const [name, setName] = useState(userProfile?.name ?? "");
    const [gender, setGender] = useState<Gender | "">(userProfile?.gender ?? "");
    const [dob, setDob] = useState(userProfile?.dob ?? "");
    const [tel, setTel] = useState(userProfile?.tel ?? "");
    const [email, setEmail] = useState(userProfile?.email ?? "");
    
    const [errorState, setErrorState] = useState<{
        email?: string;
        tel?: string;
        dob?: string;
        name?: string;
        general?: string;
    }>({});

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await updateUserProfile(uid, { name, dob, tel, gender: gender || undefined });
        } catch (error) {
            console.error("Lỗi không cập nhật được thông tin người dùng. Mã lỗi: ", error);
        }
    }

    return (
        <form id="profile-form" onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex flex-col w-full">
                <label className="font-semibold">Họ và tên</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập họ và tên"
                    className={`input-field w-full ${errorState.name ? "border-red-400" : ""}`}
                />
                {errorState.name && <p className="text-red-500 text-sm">{errorState.name}</p>}
            </div>
            <div className="flex flex-col w-full">
                <label className="font-semibold">Giới tính</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender | "")}
                    className="input-field w-full"
                >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                </select>
            </div>
            <div className="flex flex-col w-full">
                <label className="font-semibold">Ngày sinh</label>
                <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`input-field w-full ${errorState.dob ? "border-red-400" : ""}`}
                />
                {errorState.dob && <p className="text-red-500 text-sm">{errorState.dob}</p>}
            </div>
            <div className="flex flex-col w-full">
                <label className="font-semibold">Email</label>
                <input
                    disabled
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email"
                    className={`input-field w-full ${errorState.email ? "border-red-400" : ""} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
                {errorState.email && <p className="text-red-500 text-sm">{errorState.email}</p>}
            </div>
            <div className="flex flex-col w-full">
                <label className="font-semibold">Số điện thoại</label>
                <input
                    disabled
                    type="text"
                    value={tel}
                    onChange={(e) => setTel(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className={`input-field w-full ${errorState.tel ? "border-red-400" : ""} disabled:bg-gray-100 disabled:cursor-not-allowed`}
                />
                {errorState.tel && <p className="text-red-500 text-sm">{errorState.tel}</p>}
            </div>
        </form>
    );
}