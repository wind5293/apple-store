"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SelectField from "@/app/components/SelectField";
import { getDistrictsByProvince, provinces } from "@/app/lib/location";
import { Address, updateUserAddress } from "@/app/lib/users";

type AddressUpdateFormProps = {
    uid: string;
    address?: Address;
    onSuccess: () => void;
};

export default function AddressUpdateForm({ uid, address, onSuccess }: AddressUpdateFormProps) {
    const [province, setProvince] = useState(address?.province ?? "");
    const [district, setDistrict] = useState(address?.district ?? "");
    const [commune, setCommune] = useState(address?.commune ?? "");
    const [recipientAddress, setRecipientAddress] = useState(address?.recipientAddress ?? "");

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");

        if (!province || !district || !commune || !recipientAddress) {
            setError("Vui lòng điền đầy đủ thông tin địa chỉ");
            return;
        }

        try {
            setIsLoading(true);
            await updateUserAddress(uid, { province, district, commune, recipientAddress });
            router.refresh();
            onSuccess();
        } catch (err) {
            console.error("Lỗi không lưu được địa chỉ. Mã lỗi: ", err);
            setError("Không thể lưu địa chỉ, vui lòng thử lại");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form id="address-form" onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
                <SelectField
                    label="Tỉnh/Thành phố"
                    value={province}
                    onChange={(value) => {
                        setProvince(value);
                        setDistrict("");
                    }}
                    options={provinces}
                />
                <SelectField
                    label="Quận/Huyện"
                    value={district}
                    onChange={setDistrict}
                    options={getDistrictsByProvince(province)}
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-semibold">Phường/Xã</label>
                <input
                    type="text"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="Nhập phường/xã"
                    className="input-field w-full"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="font-semibold">Địa chỉ nhà</label>
                <input
                    type="text"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    placeholder="Số nhà, tên đường..."
                    className="input-field w-full"
                />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {isLoading && <p className="text-gray-400 text-sm">Đang lưu...</p>}
        </form>
    );
}