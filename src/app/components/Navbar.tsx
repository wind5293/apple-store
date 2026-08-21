"use client";
import { Bell, ChevronDown, ClipboardList, LayoutGrid, LogOut, Search, ShoppingCart, User, icons } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CategoryWithId } from "../types/category";

const USER_MENU_ITEMS = [
    {
        id: 'profile',
        name: 'Tài khoản của tôi',
        icon: User,
        path: '/profile'
    },
    {
        id: 'orders',
        name: 'Đơn mua',
        icon: ClipboardList,
        path: '/orders'
    },
    {
        id: 'notifications',
        name: 'Thông báo',
        icon: Bell,
        path: '/notifications'
    }
];

export default function Navbar({ username, categories }: {
    username: string,
    categories: CategoryWithId[];
}) {
    const router = useRouter();

    const [showCategory, setShowCategory] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const userRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);

    const isLoggedIn = true;

    function handleUserClick() {
        if (!isLoggedIn) {
            router.push("/login");
        } else {
            setIsUserMenuOpen(!isUserMenuOpen)
        }
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userRef.current && !userRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategory(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleLogout() {

    }

    return (
        <nav className="mx-auto flex w-full max-w-7xl items-center gap-3 px-2 py-4 xl:px-1">
            <Link href="/">
                <Image
                    width={100}
                    height={60}
                    style={{ width: "auto", height: "auto" }}
                    src="/store-logo.png"
                    alt="store logo"
                />
            </Link>
            <div className="relative" ref={categoryRef}>
                <div
                    onClick={() => setShowCategory(!showCategory)}
                    className="cursor-pointer hover:text-black/70 transition-colors flex items-center gap-1"
                >
                    <LayoutGrid />
                    <span className="hidden md:block text-sm">Danh mục</span>
                    <ChevronDown className={`${showCategory ? "rotate-180" : ""}`} />
                </div>
                {showCategory && (
                    <div className="absolute w-48 top-full right-0 mt-2 z-20 bg-white rounded p-1 border border-gray-200">
                        {categories.map((item) => {
                            const IconComponent = icons[item.icon as keyof typeof icons];
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => router.push(item.slug)}
                                    className="px-4 py-2 text-sm text-black hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-3"
                                >
                                    {IconComponent && <IconComponent className="w-5 text-center" />}
                                    <span className="">{item.name}</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <div className="relative flex flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input
                    placeholder="Search"
                    className="border w-full border-gray-300 pl-10 pr-4 py-2 rounded-xl focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-8">
                <Link href="/cart">
                    <div className="cursor-pointer hover:text-black/70 transition-colors flex items-center gap-1">
                        <span className="hidden md:block text-sm">Giỏ hàng</span>
                        <div className="relative">
                            <ShoppingCart />
                            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                        </div>
                    </div>
                </Link>
                <div className="relative" ref={userRef}>
                    <div
                        onClick={handleUserClick}
                        className="cursor-pointer hover:text-black/70 transition-colors flex items-center gap-1"
                    >
                        <User />
                        <span className="hidden md:block text-sm">{username}</span>
                    </div>

                    {isUserMenuOpen && (
                        <div className="absolute w-48 top-full right-0 mt-2 z-20 bg-white rounded p-1 border border-gray-200">
                            {USER_MENU_ITEMS.map((item) => {
                                const IconComponent = item.icon
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => router.push(item.path)}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black transition-colors cursor-pointer flex items-center gap-3"
                                    >
                                        <IconComponent className="w-5 text-center" />
                                        <span className="">{item.name}</span>
                                    </div>
                                );
                            })}
                            <hr className="text-gray-300 " />
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3 font-medium"
                            >
                                <LogOut className="w-5 text-center" />
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}