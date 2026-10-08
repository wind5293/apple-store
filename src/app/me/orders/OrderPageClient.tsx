"use client";

import { useEffect, useMemo, useState } from "react";
import { CompletedOrder, OrderStatus, OrderWithId } from "@/app/lib/orders";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Calendar, ChevronRight } from "lucide-react";

type ProductInfo = { name: string; image?: string };

const TABS: { key: "all" | OrderStatus; label: string }[] = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đang xử lý" },
    { key: "shipped", label: "Đang vận chuyển" },
    { key: "completed", label: "Đã nhận hàng" },
    { key: "cancelled", label: "Đã huỷ" },
];

const STATUS_LABEL: Record<OrderStatus, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đang xử lý",
    shipped: "Đang vận chuyển",
    completed: "Đã nhận hàng",
    cancelled: "Đã huỷ",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
    pending: "bg-yellow-50 text-yellow-600",
    confirmed: "bg-blue-50 text-blue-600",
    shipped: "bg-indigo-50 text-indigo-600",
    completed: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-[#D70018]",
};

function toDate(value: unknown): Date | null {
    if (!value) return null;

    if (value instanceof Date) return value;

    if (typeof value === "object" &&
        value !== null &&
        "toDate" in value
    ) {
        return (value as {
            toDate: () => Date
        }).toDate();
    }
    return null;
}

function formatDate(value: unknown) {
    const date = toDate(value);
    return date ? date.toLocaleDateString("vi-VN") : "-";
}

function formatCurrency(amount: number) {
    return amount.toLocaleString("vi-VN") + "đ";
}

function orderTotal(order: OrderWithId) {
    return order.items.reduce((sum, item) => sum + item.priceAtOrder * item.quantity, 0);
}

export default function OrderPageClient({ orders }: { orders: OrderWithId[] }) {
    const completedOrders = orders as CompletedOrder[];

    const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");
    const [dateFrom, setDateFrom] = useState("2020-12-01");
    const [dateTo, setDateTo] = useState(new Date().toISOString().slice(0, 10));
    const [productMap, setProductMap] = useState<Record<string, ProductInfo>>({});

    useEffect(() => {
        const uniqueIds = Array.from(
            new Set(
                completedOrders.flatMap(
                    o => o.items.map(i => i.productId)
                )
            )
        );
        const missingIds = uniqueIds.filter(id => !productMap[id]);
        if (missingIds.length === 0) return;

        Promise.all(
            missingIds.map(async (id) => {
                const snap = await getDoc(doc(db, "products", id));
                if (!snap.exists()) return null;
                const data = snap.data();
                return { id, name: data?.name as string, image: data?.images?.[0] as string | undefined };
            })
        ).then((results) => {
            setProductMap(prev => {
                const next = { ...prev };
                results.forEach(r => { if (r) next[r.id] = { name: r.name, image: r.image }; });
                return next;
            });
        });
    }, [completedOrders, productMap]);

    const filteredOrders = useMemo(() => {
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo + "T23:59:59") : null;

        return completedOrders.filter(order => {
            if (activeTab !== "all" && order.status !== activeTab) return false;

            const createdAt = toDate(order.createdAt);
            if (from && createdAt && createdAt < from) return false;
            if (to && createdAt && createdAt > to) return false;

            return true;
        });
    }, [completedOrders, activeTab, dateFrom, dateTo]);

    return (
        <div className="flex flex-col gap-5 bg-white px-5 py-4 rounded-lg">
            <div className="flex flex-row gap-6 border-b border-gray-200">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`pb-3 text-sm font-semibold border-b-2 -mb-px transition-colors ${activeTab === tab.key
                            ? "border-[#D70018] text-[#D70018]"
                            : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex flex-row items-center gap-3">
                <p className="text-sm font-semibold whitespace-nowrap">Lịch sử mua hàng</p>
                <div className="flex flex-row items-center gap-2 border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="outline-none"
                    />
                    <span>→</span>
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="outline-none"
                    />
                    <Calendar size={16} className="text-gray-500" />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                {filteredOrders.length === 0 && (
                    <p className="text-center text-gray-500 py-10">Không có đơn hàng nào</p>
                )}

                {filteredOrders.map(order => {
                    const firstItem = order.items[0];
                    const firstProduct = firstItem ? productMap[firstItem.productId] : undefined;
                    const extraCount = order.items.length - 1;

                    return (
                        <div key={order.id} className="bg-white rounded-md border border-gray-200 p-4">
                            <div className="flex flex-row justify-between items-center text-sm text-gray-500 mb-3">
                                <div className="flex flex-row items-center gap-2">
                                    <span>Đơn hàng: <span className="font-semibold text-black">#{order.id.slice(0, 10).toUpperCase()}</span></span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span>Ngày đặt hàng: {formatDate(order.createdAt)}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[order.status]}`}>
                                    {STATUS_LABEL[order.status]}
                                </span>
                            </div>

                            <div className="flex flex-row justify-between items-center">
                                <div className="flex flex-row items-center gap-3">
                                    {firstProduct?.image && (
                                        <img
                                            src={firstProduct.image}
                                            alt={firstProduct.name}
                                            className="w-14 h-14 object-cover rounded-md"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold text-sm">{firstProduct?.name ?? "Sản phẩm"}</p>
                                        <p className="text-sm text-gray-600">{formatCurrency(firstItem?.priceAtOrder ?? 0)}</p>
                                        {extraCount > 0 && (
                                            <p className="text-sm text-gray-500">Cùng {extraCount} sản phẩm khác</p>
                                        )}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-600">
                                        Tổng thanh toán: <span className="font-semibold text-[hsl(353,100%,42%)]">{formatCurrency(orderTotal(order))}</span>
                                    </p>
                                    <button className="flex flex-row items-center gap-1 text-sm text-gray-600 hover:text-black justify-end w-full mt-1">
                                        Xem chi tiết <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}