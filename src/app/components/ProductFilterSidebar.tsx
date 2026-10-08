"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductFilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
    const [storage, setStorage] = useState(searchParams.get("storage") ?? "");
    const [color, setColor] = useState(searchParams.get("color") ?? "");
    const [sort, setSort] = useState(searchParams.get("sort") ?? "");

    function applyFilters() {
        const params = new URLSearchParams(searchParams.toString());

        function setOrDelete(key: string, value: string) {
            if (value) params.set(key, value);
            else params.delete(key);
        }

        setOrDelete("minPrice", minPrice);
        setOrDelete("maxPrice", maxPrice);
        setOrDelete("storage", storage);
        setOrDelete("color", color);
        setOrDelete("sort", sort);

        router.push(`/products?${params.toString()}`);
    }

    function clearFilters() {
        const params = new URLSearchParams(searchParams.toString());
        ["minPrice", "maxPrice", "storage", "color", "sort"].forEach((key) => params.delete(key));
        setMinPrice("");
        setMaxPrice("");
        setStorage("");
        setColor("");
        setSort("");
        router.push(`/products?${params.toString()}`);
    }

    return (
        <div className="col-span-1 flex flex-col gap-4 h-fit bg-white rounded-md border border-gray-200 p-4 text-sm">
            <h3 className="font-semibold">Bộ lọc</h3>

            <div className="flex flex-col gap-1">
                <label className="text-gray-600">Khoảng giá</label>
                <div className="flex flex-row items-center gap-2">
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Từ"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                    />
                    <span>-</span>
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Đến"
                        className="border border-gray-300 rounded-md px-2 py-1 w-full"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-600">Bộ nhớ (VD: 128GB)</label>
                <input
                    type="text"
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    placeholder="128GB"
                    className="border border-gray-300 rounded-md px-2 py-1"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-600">Màu sắc</label>
                <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="Đen"
                    className="border border-gray-300 rounded-md px-2 py-1"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label className="text-gray-600">Sắp xếp</label>
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border border-gray-300 rounded-md px-2 py-1"
                >
                    <option value="">Mặc định</option>
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                </select>
            </div>

            <div className="flex flex-row gap-2">
                <button
                    onClick={applyFilters}
                    className="flex-1 bg-[#D70018] text-white rounded-md py-2 font-semibold hover:bg-[#B00015]"
                >
                    Áp dụng
                </button>
                <button
                    onClick={clearFilters}
                    className="flex-1 border border-gray-300 rounded-md py-2 hover:bg-gray-50"
                >
                    Xoá lọc
                </button>
            </div>
        </div>
    );
}