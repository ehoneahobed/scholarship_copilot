"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveProfile } from "@/app/actions/profile";
import { Loader2, ArrowRight, User, GraduationCap, Briefcase, Award } from "lucide-react";

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        rawResumeText: "",
        education: [],
        experience: [],
        achievements: [],
        skills: [],
        preferredFields: [],
    });

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveProfile({
                education: formData.education,
                experience: formData.experience,
                achievements: formData.achievements,
                rawResumeText: formData.rawResumeText,
                skills: formData.skills,
                preferredFields: formData.preferredFields,
            });
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Failed to save profile.");
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 max-w-4xl mx-auto">
            <div className="w-full animate-fade-in">
                {step === 1 && (
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                                Let's build your <span className="text-brand-primary">academic identity.</span>
                            </h1>
                            <p className="text-xl text-text-secondary leading-relaxed max-w-2xl">
                                Paste your resume or a summary of your achievements below. Our AI will use this as the absolute source of truth for all applications.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <textarea
                                className="w-full h-80 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-brand-primary/50 transition-all resize-none font-sans"
                                placeholder="Paste your resume text here..."
                                value={formData.rawResumeText}
                                onChange={(e) => setFormData({ ...formData, rawResumeText: e.target.value })}
                            />
                            <div className="flex justify-end">
                                <button 
                                    onClick={() => setStep(2)}
                                    disabled={!formData.rawResumeText}
                                    className="btn btn-primary"
                                >
                                    Continue <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-3xl font-bold">Preferences & Goals</h2>
                            <p className="text-text-secondary">Which fields of study or types of scholarships should we prioritize?</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PreferenceInput 
                                label="Key Skills" 
                                placeholder="e.g. Python, Public Speaking, Research"
                                onChange={(val) => setFormData({ ...formData, skills: val.split(",").map(s => s.trim()) })}
                            />
                            <PreferenceInput 
                                label="Target Fields" 
                                placeholder="e.g. STEM, Social Impact, Arts"
                                onChange={(val) => setFormData({ ...formData, preferredFields: val.split(",").map(s => s.trim()) })}
                            />
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <button onClick={() => setStep(1)} className="text-text-secondary hover:text-white transition-colors">
                                Back to resume
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={loading}
                                className="btn btn-primary min-w-[140px]"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PreferenceInput({ label, placeholder, onChange }: { label: string, placeholder: string, onChange: (val: string) => void }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-secondary">{label}</label>
            <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-primary/50 transition-all"
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
