import Navbar from "./components/Navbar";
import { getCategories } from "./lib/category";
import "./globals.css";
import AuthProvider from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

export default async function RootLayout({ children }: LayoutProps<"/">) {
    const categories = await getCategories();

    return (
        <html
            lang="en"
            className=""
        >
            <body className="">
                <AuthProvider>
                    <CartProvider>
                        <Navbar categories={categories} />
                        {children}
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
