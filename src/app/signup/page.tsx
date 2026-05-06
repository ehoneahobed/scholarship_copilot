"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await authClient.signUp.email({
            email,
            password,
            name,
        });
        if (error) {
            alert(error.message);
        } else {
            router.push("/dashboard");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
            <div className="w-full max-w-md animate-fade-in">
                <div className="flex flex-col items-center gap-4 mb-8 text-center">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Create your account</h1>
                    <p className="text-text-secondary">Start winning scholarships with AI automation.</p>
                </div>

                <form onSubmit={handleSignup} className="glass p-8 rounded-2xl flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Full Name</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-text-secondary">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-bg-primary border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-brand-primary transition-colors"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full mt-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                    </button>

                    <p className="text-center text-sm text-text-secondary mt-2">
                        Already have an account?{" "}
                        <Link href="/login" className="text-brand-primary hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
