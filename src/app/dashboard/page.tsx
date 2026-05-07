"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { runScoutPipeline, getScoredApplications } from "@/app/actions/scout";
import { Search, Sparkles, Loader2, ExternalLink, ChevronRight } from "lucide-react";

export default function Dashboard() {
    const [loading, setLoading] = useState(false);
    const [applications, setApplications] = useState<any[]>([]);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        const apps = await getScoredApplications();
        setApplications(apps);
    };

    const handleScout = async () => {
        setLoading(true);
        try {
            await runScoutPipeline();
            await loadApplications();
        } catch (error) {
            console.error(error);
            alert("Scouting failed. Check console.");
        }
        setLoading(false);
    };

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-bold tracking-tight text-white">Dashboard</h1>
                    <p className="text-text-secondary text-lg">Your curated scholarship opportunities.</p>
                </div>
                
                <button 
                    onClick={handleScout}
                    disabled={loading}
                    className="btn btn-primary min-w-[180px]"
                >
                    {loading ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Scouting...</>
                    ) : (
                        <><Search className="w-4 h-4" /> Scout Scholarships</>
                    )}
                </button>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {applications.length === 0 && !loading && (
                    <div className="glass p-12 rounded-3xl text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-text-muted">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-semibold">No scholarships yet</h3>
                        <p className="text-text-secondary max-w-sm">
                            Click the Scout button to start finding opportunities matched to your profile.
                        </p>
                    </div>
                )}

                {applications.map((app) => (
                    <div key={app.id} className="glass-interactive p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex flex-col gap-1 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                    app.fitScore > 80 ? "bg-green-500/20 text-green-400" : "bg-brand-primary/20 text-brand-primary"
                                }`}>
                                    {app.fitScore}% Match
                                </span>
                                <span className="text-xs text-text-muted">• {app.scholarship.provider}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">{app.scholarship.title}</h3>
                            <p className="text-sm text-text-secondary line-clamp-1 max-w-2xl">
                                {app.fitJustification}
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <a 
                                href={app.scholarship.sourceUrl} 
                                target="_blank" 
                                className="p-2 rounded-full hover:bg-white/10 text-text-muted transition-colors"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </a>
                            <Link 
                                href={app.status === "REFINED" ? `/dashboard/application/${app.id}/review` : `/dashboard/application/${app.id}`}
                                className="btn btn-secondary py-2 px-4"
                            >
                                {app.status === "REFINED" ? "Final Polish" : "Review Details"} 
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
