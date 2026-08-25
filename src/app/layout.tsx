import Navbar from "./components/Navbar";
import { getCategories } from "./lib/category";
import "./globals.css";
import AuthProvider from "./context/AuthContext";

export default async function RootLayout({ children }: LayoutProps<"/">) {
    const categories = await getCategories();

    return (
        <html
            lang="en"
            className=""
        >
            <body className="">
                <AuthProvider>
                    <Navbar categories={categories} />
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
