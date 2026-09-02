import { Check } from "lucide-react";
import { useEffect, useRef } from "react";

type ConfirmDialogProps = {
    message: React.ReactNode;
    title: string,
    onConfirm: () => void;
    onCancel: () => void;
};

export function ConfirmDialog({ message, title, onConfirm, onCancel }: ConfirmDialogProps) {
    const cancelButtonFocusRef = useRef<HTMLButtonElement>(null);
    const dialogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
                onCancel();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onCancel]);

    useEffect(() => {
        const handleClickEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onCancel();
        }

        document.addEventListener('keydown', handleClickEscape);
        return () => document.removeEventListener('keydown', handleClickEscape);
    }, [onCancel]);

    useEffect(() => {
        cancelButtonFocusRef.current?.focus();
    }, []);

    return (
        <div className="flex justify-center items-center fixed inset-0 z-50 bg-black/50">
            <div
                role="dialog" aria-modal="true" aria-label={title}
                ref={dialogRef}
                className="bg-white flex flex-col justify-between items-center w-96 h-72 rounded-md p-8"
            >
                <Check size={80} className="bg-[#ff102b] rounded-full text-white p-4" />
                <p>{message}</p>
                <div className="flex flex-row gap-2 items-center">
                    <button
                        onClick={onCancel}
                        ref={cancelButtonFocusRef}
                        className="py-2 px-4 rounded-md font-semibold border border-gray-300 w-30 hover:cursor-pointer flex flex-row items-center justify-center gap-4"
                    >
                        Huỷ bỏ
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-[#ff102b] text-white py-2 px-4 rounded-md font-semibold w-30 hover:cursor-pointer hover:bg-[#D70018] disabled:bg-gray-600"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}