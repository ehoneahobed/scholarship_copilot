"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle, FileText, User, Info } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma"; // This won't work on client, I need an action

export default function ApplicationReview({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [app, setApp] = useState<any>(null);
    const [content, setContent] = useState("");
    const router = useRouter();

    useEffect(() => {
        // I need to fetch the application details
        fetch("/api/application/" + id)
            .then(res => res.json())
            .then(data => {
                setApp(data);
                setContent(data.draft || "");
                setLoading(false);
            });
    }, [id]);

    const handleFinish = async () => {
        setSaving(true);
        // Save the final content and mark as APPLIED or READY
        await fetch("/api/application/" + id, {
            method: "PATCH",
            body: JSON.stringify({ draft: content, status: "READY" })
        });
        router.push("/dashboard");
    };

    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

    return (
        <div className="max-w-7xl mx-auto px-6 py-12">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <header className="mb-12 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full bg-green-400/10 text-green-400 text-xs font-bold uppercase tracking-wider">
                            Gate 3: Final Polish
                        </span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        {app.scholarship.title}
                    </h1>
                    <p className="text-text-secondary">Review and make your final edits before applying.</p>
                </div>
                <button 
                    onClick={handleFinish}
                    disabled={saving}
                    className="btn btn-primary px-8 py-3"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finalize Application"}
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editor Side */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="glass rounded-3xl p-8 border-white/5 h-[70vh] flex flex-col">
                        <div className="flex items-center gap-2 mb-4 text-text-muted text-sm font-medium uppercase tracking-widest">
                            <FileText className="w-4 h-4" /> Essay Draft
                        </div>
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="flex-1 bg-transparent border-none text-lg text-white/90 leading-relaxed focus:outline-none resize-none scrollbar-hide"
                        />
                    </div>
                </div>

                {/* Facts/Guidance Side */}
                <div className="flex flex-col gap-6">
                    <div className="glass rounded-3xl p-6 border-white/5">
                        <div className="flex items-center gap-2 mb-4 text-brand-primary text-sm font-medium uppercase tracking-widest">
                            <Info className="w-4 h-4" /> Review Checklist
                        </div>
                        <ul className="flex flex-col gap-4">
                            {[
                                "Factual accuracy of anecdotes",
                                "Word count limits",
                                "Tone matches provider values",
                                "Proper formatting"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                                    <div className="w-5 h-5 rounded-full border border-white/10 shrink-0 mt-0.5" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="glass rounded-3xl p-6 border-white/5">
                        <div className="flex items-center gap-2 mb-4 text-text-muted text-sm font-medium uppercase tracking-widest">
                            <User className="w-4 h-4" /> Sourced Facts
                        </div>
                        <div className="flex flex-col gap-3 text-xs text-text-muted">
                            <p>This draft was generated using your profile and context provided in Gate 2.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
