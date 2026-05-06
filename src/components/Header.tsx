"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { LogOut, User, LayoutDashboard, Sparkles } from "lucide-react";

export function Header() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login");
                },
            },
        });
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight">Scholarship Copilot</span>
                </Link>

                <nav className="flex items-center gap-4">
                    {isPending ? (
                        <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />
                    ) : session ? (
                        <>
                            <Link href="/dashboard" className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-white transition-colors">
                                <LayoutDashboard className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <Link href="/onboarding" className="flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-white transition-colors">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">Profile</span>
                            </Link>
                            <div className="w-px h-4 bg-white/10 mx-2" />
                            <button 
                                onClick={handleSignOut}
                                className="flex items-center gap-2 text-sm font-medium text-red-400/80 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline">Log out</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
                                Log in
                            </Link>
                            <Link href="/signup" className="btn btn-primary py-1.5 px-4 text-xs">
                                Get Started
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
