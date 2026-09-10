"use client"
import { ReactNode, useEffect, useRef, useState } from "react"
import { X } from "lucide-react";

type SlidePopupProps = {
    open: boolean,
    onClose: () => void,
    title: string,
    children: ReactNode,
    footer?: ReactNode
};

export default function SlidePopup({ open, onClose, title, children, footer }: SlidePopupProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const slideRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        const handleClickOutside = (event: MouseEvent) => {
            if (slideRef.current && !slideRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [open, onClose]);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            const rafId = requestAnimationFrame(() => {
                const rafId2 = requestAnimationFrame(() => {
                    setIsVisible(true);
                });
                return () => cancelAnimationFrame(rafId2);  
            });
            return () => cancelAnimationFrame(rafId);
        } else {
            setIsVisible(false);
            const timeoutId = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timeoutId);
        }
    }, [open]);

    if (!shouldRender) return null;

    return (
        <div className={`flex flex-row justify-end h-full p-3 fixed inset-0 z-50`}>
            <div
                onClick={onClose}
                className={`absolute inset-0 bg-black 
                            transition-opacity duration-300 ${open ? "opacity-50" : "opacity-0"}`} 
            />
            <div
                ref={slideRef}
                className={`relative flex flex-col w-full max-w-xl h-full bg-white rounded-lg 
                            transition-transform duration-300 ${isVisible ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-row justify-between items-center p-4 px-6 border-b">
                    <h2 className="text-lg font-bold">{title}</h2>
                    <button onClick={onClose}>
                        <X size={14} className="bg-gray-500 text-white h-6 w-6 p-1 rounded-full" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
                {footer && (
                    <div className="flex flex-row gap-3 p-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}