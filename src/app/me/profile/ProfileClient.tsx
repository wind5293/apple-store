"use client";

import { UserProfile } from "@/app/lib/users";
import { Plus, SquarePen } from "lucide-react";
import SlideOverModal from "../SlideOverModal";
import { useState } from "react";
import ProfileUpdateForm from "../ProfileUpdateForm";

function formatDob(dob: string) {
    if (!dob) return "-";
    const [year, month, day] = dob.split("-");
    if (!year || !month || !day) return "-";
    return `${day}/${month}/${year}`;
}

export default function UserProfileInformation({ userProfile, uid }: { userProfile: UserProfile | null, uid: string }) {
    const [activePopup, setActivePopup] = useState<'profile' | 'address' | 'password' | null>(null);

    function renderPopupContent() {
        switch (activePopup) {
            case 'profile':
                return <ProfileUpdateForm userProfile={userProfile} uid={uid} />;
            case 'address':
                return <div>Address form goes here</div>;
            case 'password':
                return <div>Password form goes here</div>;
            default:
                return null;
        }
    }

    function renderPopupTitle() {
        switch (activePopup) {
            case 'profile':
                return "Cập nhật thông tin cá nhân";
            case 'address':
                return "Thêm địa chỉ mới";
            case 'password':
                return "Đổi mật khẩu";
            default:
                return "";
        }
    }

    return (
        <div className="bg-[#E4E4E7] grid grid-cols-2 gap-3 text-sm">
            <div className="bg-[#FFFFFF] rounded-md p-5 col-span-2" >
                <div className="flex flex-row justify-between items-center">
                    <h3 className="text-base font-bold">Thông tin cá nhân</h3>
                    <button
                        onClick={() => setActivePopup('profile')}
                        className="flex flex-row items-center gap-1"
                    >
                        <SquarePen size={16} className="text-[#D70018]" />
                        <p className="text-[#D70018]">Cập nhật</p>
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-3 gap-x-7 mt-3">
                    <div className="flex flex-row justify-between items-center ">
                        <p className="text-gray-500">Họ và tên: </p>
                        <p className="font-semibold">{userProfile?.name ?? "-"}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-gray-500">Số điện thoại: </p>
                        <p className="font-semibold">{userProfile?.tel ?? "-"}</p>
                    </div>
                    <div className="border-b border-gray-200"></div>
                    <div className="border-b border-gray-200"></div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-gray-500">Giới tính: </p>
                        <p className="font-semibold">{userProfile?.gender ?? "-"}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-gray-500">Email: </p>
                        <p className="font-semibold">{userProfile?.email ?? "-"}</p>
                    </div>
                    <div className="border-b border-gray-200"></div>
                    <div className="border-b border-gray-200"></div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-gray-500">Ngày sinh: </p>
                        <p className="font-semibold">{formatDob(userProfile?.dob ?? "")}</p>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-gray-500">Địa chỉ mặc định: </p>
                        <p className="font-semibold">{userProfile?.defaultAddress?.recipientAddress ?? "-"}</p>
                    </div>
                </div>
            </div>
            <div className="bg-[#FFFFFF] rounded-md p-5 col-span-2" >
                <div className="flex flex-row justify-between items-center">
                    <h3 className="text-base font-bold">Sổ địa chỉ</h3>
                    <button
                        onClick={() => setActivePopup('address')}
                        className="flex flex-row items-center gap-1"
                    >
                        <Plus size={16} className="text-[#D70018]" />
                        <p className="text-[#D70018]">Thêm địa chỉ</p>
                    </button>
                </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-md p-5">
                <div className="flex flex-row justify-between items-center">
                    <h3 className="text-base font-bold">Mật khẩu</h3>
                    <button
                        onClick={() => setActivePopup('password')}
                        className="flex flex-row items-center gap-1"
                    >
                        <SquarePen size={16} className="text-[#D70018]" />
                        <p className="text-[#D70018]">Thay đổi mật khẩu</p>
                    </button>

                </div>
                <div className="flex flex-row justify-between items-center mt-3">
                    <p className="text-gray-500">Cập nhật lần cuối lúc: </p>
                    <p className="font-semibold">26/08/2026 16:02</p>
                </div>
            </div>
            <div className="bg-[#FFFFFF] rounded-md p-5">
                <h3 className="text-base font-bold">Tài khoản liên kết</h3>

            </div>
            <SlideOverModal
                open={activePopup !== null}
                onClose={() => setActivePopup(null)}
                title={renderPopupTitle()}
                footer={
                    <div className="flex flex-row justify-between min-w-full gap-3">
                        <button
                            type="button"
                            className="py-4 px-4 rounded-md w-full font-semibold border border-gray-600 bg-white text-black hover:bg-gray-400"
                        >
                            Thiết lập lại
                        </button>
                        <button
                            type="submit"
                            form="profile-form"
                            className="py-4 px-4 rounded-md w-full font-semibold bg-[#D70018] text-white hover:bg-[#B00015]"
                        >
                            Cập nhật thông tin
                        </button>
                    </div>
                }
            >
                {renderPopupContent()}
            </SlideOverModal>
        </div>
    );
}