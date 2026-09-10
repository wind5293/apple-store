"use client";
import { usePathname } from "next/navigation";
import { Scroll, Settings } from 'lucide-react'
import Link from "next/link";

export default function MeSidebar() {
    const pathname = usePathname();

    const LINKS = [
        {
            name: 'Lịch sử mua hàng',
            icon: Scroll,
            path: '/me/orders',
        },
        {
            name: 'Thông tin tài khoản',
            icon: Settings,
            path: '/me/profile',
        },
    ];

    return (
        <nav className="flex flex-col gap-2 bg-white rounded-lg w-62.5 py-2">
            {LINKS.map((link) => {
                const isActive = pathname.startsWith(link.path);
                const Icon = link.icon;

                return (
                    <Link
                        key={link.path}
                        href={link.path}
                        className={`flex flex-row gap-2 items-center text-base font-semibold ${isActive ? "bg-[#FBE6E8] text-[#D70018] border-l-4 border-l-[#D70018]" : "border-l-4 border-l-white"} py-3`}
                    >
                        <div className="flex flex-row gap-2 px-3">
                            <Icon />
                            {link.name}
                        </div>
                    </Link>
                );
            })}
        </nav>
    );
}