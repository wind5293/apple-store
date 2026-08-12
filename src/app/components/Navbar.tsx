import { ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="mx-auto flex w-full max-w-7xl justify-between items-center gap-3 px-2 py-4 xl:px-1">
            <Link href="/"></Link>
        </nav>
    );
}