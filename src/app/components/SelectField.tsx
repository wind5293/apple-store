"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

type SelectFieldProps = {
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: SelectOption[],
    placeholder?: string,
}

type SelectOption = {
    value: string,
    label: string
}

export default function SelectField({ label, value, onChange, options, placeholder }: SelectFieldProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-1 relative">
            <label htmlFor={label} className="font-semibold">{label}</label>
            <select
                id={label}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border border-gray-300 placeholder:text-gray-400 rounded-lg p-4 w-full focus:border-gray-400 focus:outline-none appearance-none"
            >
                <option disabled value="">{placeholder || "Chọn..."}</option>
                {options.map((op) => (
                    <option
                        key={op.value}
                        value={op.value}
                    >
                        {op.label}
                    </option>
                ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-2/3 -translate-y-1/2 pointer-events-none" />
        </div>
    );
}