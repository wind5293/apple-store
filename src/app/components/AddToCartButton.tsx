"use client";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ productId }: { productId: string }) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => addToCart(productId, 1)}
            className=" flex flex-row justify-center items-center gap-2 mt-auto text-sm text-white font-bold bg-[#FF102B] hover:bg-[#D70018] rounded-md p-2"
        >
            <ShoppingBasket size={16} />Thêm vào giỏ hàng
        </button>
    );
}