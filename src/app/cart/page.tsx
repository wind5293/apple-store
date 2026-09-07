"use client";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { ProductWithId } from "../types/products";
import { getProductsByIds } from "../lib/products";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { createOrder } from "../lib/orders";

export default function CartPage() {
    const [products, setProducts] = useState<ProductWithId[]>([]);
    const [draftQuantiies, setDraftQuantities] = useState<Record<string, string>>({});
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { items, setQuantity, deleteFromCart } = useCart();
    const { user } = useAuth();

    const router = useRouter();

    const totalPrice = items.reduce((sum, item) => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return sum;
        if (!selectedIds.has(item.productId)) return sum;
        return sum + product.price * item.quantity;
    }, 0);

    function toggleSelect(productId: string) {
        const newSelectedIds = new Set(selectedIds);
        if (newSelectedIds.has(productId)) {
            newSelectedIds.delete(productId);
        } else {
            newSelectedIds.add(productId);
        }
        setSelectedIds(newSelectedIds);
    }

    function toggleSelectAll() {
        if (selectedIds.size === items.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map(item => item.productId)));
        }
    }

    function deleteItemFromCart(productId: string) {
        if (selectedIds.has(productId)) {
            const newSelectedIds = new Set(selectedIds);
            newSelectedIds.delete(productId);

            setSelectedIds(newSelectedIds);
        }
        deleteFromCart(productId);
    }

    function onBlur(productId: string) {
        const draft = draftQuantiies[productId];
        const draftNumber = Number(draft);
        if (isNaN(draftNumber) || !Number.isInteger(draftNumber) || draftNumber < 0) return;

        if (draftNumber === 0) {
            requestDelete(productId);
            return;
        }
        setQuantity(productId, draftNumber);
        clearDraft(productId);
    }

    function requestDelete(productId: string) {
        setPendingDeleteId(productId);
    }

    function clearDraft(productId: string) {
        const newDraft = { ...draftQuantiies };
        delete newDraft[productId];

        setDraftQuantities(newDraft);
    }

    useEffect(() => {
        const productIds = items.map(item => item.productId);
        let ignore = false;
        async function saveProducts() {
            try {
                if (products.length === 0) setIsLoading(true);
                setError(null);
                const fetchProducts = await getProductsByIds(productIds);
                if (!ignore) setProducts(fetchProducts);
            } catch {
                if (!ignore) setError("Lỗi khi tải dữ liệu giỏ hàng");
            } finally {
                if (!ignore) setIsLoading(false);
            }
        }
        saveProducts();

        return () => {
            ignore = true;
        }
    }, [items]);

    return (
        <div className="bg-[#F5F5F5] min-h-screen">
            {pendingDeleteId && (
                <ConfirmDialog
                    message={<>Bạn có muốn bỏ <span className="font-bold">{products.find(p => p.id === pendingDeleteId)?.name}</span> ra khỏi giỏ hàng?</>}
                    title="Xác nhận xoá sản phẩm"
                    onConfirm={() => {
                        deleteItemFromCart(pendingDeleteId);
                        setPendingDeleteId(null);

                        clearDraft(pendingDeleteId);
                    }}
                    onCancel={() => {
                        setPendingDeleteId(null);

                        clearDraft(pendingDeleteId);
                    }}
                />
            )}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center min-h-screen fixed inset-0">
                    <p>Đang tải giỏ hàng...</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4 w-7xl ml-auto mr-auto p-3">
                    <div className="flex flex-row items-center gap-4 p-4 text-sm text-gray-500 bg-white">
                        <input
                            type="checkbox"
                            className="w-8"
                            checked={selectedIds.size === items.length}
                            onChange={toggleSelectAll}
                        />
                        <div className="flex-1">Sản Phẩm</div>
                        <div className="w-32 text-center">Đơn Giá</div>
                        <div className="w-32 text-center">Số Lượng</div>
                        <div className="w-32 text-center">Số Tiền</div>
                        <div className="w-20 text-center">Thao Tác</div>
                    </div>
                    {items.map((item) => {
                        const product = products.find(p => p.id === item.productId);
                        if (!product) return null;

                        return (
                            <div key={item.productId} className="flex flex-row items-center gap-4 p-4 text-sm bg-white">
                                <input
                                    type="checkbox"
                                    className="w-8"
                                    checked={selectedIds.has(item.productId)}
                                    onChange={() => toggleSelect(item.productId)}
                                />
                                <div className="flex flex-row flex-1 items-center gap-2">
                                    <Image
                                        width={80}
                                        height={80}
                                        src={product.thumbnailUrl}
                                        alt={product.name}
                                    />
                                    {product.name}
                                </div>
                                <div className="w-32 text-center">{product.price.toLocaleString("vi-VN")}</div>
                                <div className="flex flex-row w-32 justify-center text-center gap-4 items-center">
                                    <button
                                        onClick={() => {
                                            if (item.quantity > 1) {
                                                setQuantity(item.productId, item.quantity - 1);
                                            } else {
                                                requestDelete(item.productId)
                                            }
                                        }}
                                        className="border border-gray-300 px-1 bg-gray-200"
                                    >-</button>
                                    <input
                                        type="number"
                                        value={draftQuantiies[item.productId] !== undefined ? draftQuantiies[item.productId] : String(item.quantity)}
                                        onChange={(e) => {
                                            e.preventDefault();
                                            setDraftQuantities(prevDraft => ({ ...prevDraft, [item.productId]: e.target.value }));
                                        }}
                                        onBlur={() => onBlur(item.productId)}
                                        onKeyDown={(e) => { if (e.key === "Enter") onBlur(item.productId) }}
                                        className="w-10 text-center border border-gray-300"
                                    />
                                    <button
                                        onClick={() => { setQuantity(item.productId, item.quantity + 1) }}
                                        className="border border-gray-300 px-1 bg-gray-200"
                                    >+</button>
                                </div>
                                <div className="w-32 text-center text-[#D70018] font-semibold">{(product.price * item.quantity).toLocaleString("vi-VN")}</div>
                                <div className="w-20 text-center">
                                    <button onClick={() => { requestDelete(item.productId) }}>Xoá</button>
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex flex-row justify-end items-center gap-4 p-4 bg-white sticky bottom-0">
                        <span>Tổng cộng: <span className="text-[#D70018] font-bold text-lg">
                            {totalPrice.toLocaleString("vi-VN")}đ</span></span>
                        <button
                            disabled={selectedIds.size === 0 || isCheckingOut || user === null} 
                            onClick={async () => {
                                setIsCheckingOut(true);
                                try {
                                    if (user) {
                                        const orderId = await createOrder(user.uid, items, products, selectedIds);
                                        router.push(`/cart/payment-info/${orderId}`);
                                    } else {
                                        setError("Không lấy được thông tin người dùng");
                                    }
                                } catch {
                                    setError("Không thể tải trang thanh toán do lỗi kết nối");
                                } finally {
                                    setIsCheckingOut(false);
                                }
                            }}
                            className="bg-[#D70018] text-white px-8 py-3 rounded-md font-semibold disabled:bg-gray-400"
                        >
                            Thanh toán
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}