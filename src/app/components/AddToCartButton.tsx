"use client";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function AddToCartButton({ productId }: { productId: string }) {
    const { addToCart } = useCart();

    return (
        <button
            onClick={() => addToCart(productId, 1)}
            className=" flex flex-row justify-center items-center gap-2 text-sm text-white font-bold bg-[#FF102B] hover:bg-[#D70018] rounded-b-md p-2 absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200"
        >
            <ShoppingBasket size={16} />Thêm vào giỏ hàng
        </button>
    );
}