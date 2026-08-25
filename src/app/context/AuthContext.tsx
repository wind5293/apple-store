"use client";
import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase";

type AuthContextType = {
    user: User | null;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
});

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoading }} >
            {children}
        </AuthContext.Provider>
    );
} 

export function useAuth() {
    return useContext(AuthContext);
}