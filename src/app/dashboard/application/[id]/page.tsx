"use client";

import { useState, useEffect, use } from "react";
import { getApplicationWithGaps, saveGapResponses } from "@/app/actions/prep";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Send, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ApplicationPrep({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [data, setData] = useState<any>(null);
    const [responses, setResponses] = useState<Record<string, string>>({});
    const router = useRouter();

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const result = await getApplicationWithGaps(id);
            setData(result);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await saveGapResponses(id, responses);
            // Optionally trigger drafting here or redirect
            // Let's redirect to dashboard which will now show "REFINED" status
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Failed to save responses.");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
            </div>
        );
    }

    if (!data) return <div className="text-center py-20">Application not found.</div>;

    const { application, gaps } = data;

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-8 group">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <header className="mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider">
                        Gate 2: Context Gathering
                    </span>
                    <span className="text-text-muted text-sm">• {application.scholarship.provider}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    {application.scholarship.title}
                </h1>
                <p className="text-lg text-text-secondary leading-relaxed">
                    Our AI has analyzed the requirements. To write a winning application, we need a bit more color on your specific experiences.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="flex flex-col gap-12">
                <div className="flex flex-col gap-8">
                    {gaps.map((gap: any, index: number) => (
                        <div key={gap.id || index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="flex flex-col gap-4 p-8 rounded-3xl glass border-white/5">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 mt-1">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h3 className="text-lg font-semibold text-white">{gap.question_for_user}</h3>
                                        <p className="text-sm text-text-muted leading-relaxed">
                                            Reason: {gap.reason}
                                        </p>
                                    </div>
                                </div>
                                <textarea
                                    required
                                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all resize-none"
                                    placeholder="Your anecdote or details..."
                                    value={responses[gap.id] || ""}
                                    onChange={(e) => setResponses({ ...responses, [gap.id]: e.target.value })}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {gaps.length === 0 && (
                    <div className="glass p-12 rounded-3xl text-center flex flex-col items-center gap-4">
                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                        <h3 className="text-xl font-semibold">Perfect! No gaps found.</h3>
                        <p className="text-text-secondary">
                            Your profile is already comprehensive enough to draft this application.
                        </p>
                    </div>
                )}

                <div className="flex justify-end pt-4">
                    <button 
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary min-w-[200px] py-4 text-base"
                    >
                        {saving ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                        ) : (
                            <><Send className="w-4 h-4" /> Move to Drafting</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
