import Navbar from "./components/Navbar";
import { getCategories } from "./lib/category";
import "./globals.css";

export default async function RootLayout({ children }: LayoutProps<"/">) {
    const categories = await getCategories();

    return (
        <html
            lang="en"
            className=""
        >
            <body className="">
                <Navbar categories={categories} username="Welcome"/>
                {children}
            </body>
        </html>
    );
}
