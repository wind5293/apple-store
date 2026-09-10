"use client";
import Image from "next/image";
import { useState } from "react";
import { DollarSign, Eye, EyeClosed, ShoppingCart } from "lucide-react";

type MeBannerProps = {
    name: string;
    tel: string;
    totalOrders: number;
};

export default function MeBanner({ name, tel, totalOrders }: MeBannerProps) {
    const [hideTelephone, setHideTelephone] = useState(true);

    function hideTelephoneNumber(tel: string) {
        if (!tel || tel.length) return "-";
        return tel.slice(0, 3) + "*".repeat(tel.length - 5) + tel.slice(-2);
    }

    return (
        <div className="flex flex-row bg-white rounded-lg justify-between p-3">
            <div className="flex flex-row items-center gap-2 px-6">
                <Image
                    width={20}
                    height={20}
                    src=""
                    alt=""
                />
                <div className="flex flex-col gap-1">
                    <p className="font-bold">{name}</p>
                    <div className="flex flex-row gap-1 items-center">
                        <p className="text-sm text-gray-500">
                            {hideTelephone ? hideTelephoneNumber(tel) : (tel || "-")}
                        </p>
                        <button
                            type="button"
                            onClick={() => setHideTelephone(!hideTelephone)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            {hideTelephone ? <Eye size={16} /> : <EyeClosed size={16} />}
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <ShoppingCart />
                <div className="flex flex-col gap-1">
                    <p className="font-bold">{totalOrders}</p>
                    <p className="text-sm text-gray-500">Tổng số đơn hàng đã mua</p>
                </div>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <DollarSign />
                <div className="flex flex-col gap-1">
                    <p className="font-bold">"0đ"</p>
                    <p className="text-sm text-gray-500">Tổng tiền tích luỹ</p>
                </div>
            </div>
        </div>
    );
}