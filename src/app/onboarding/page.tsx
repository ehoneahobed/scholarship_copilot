"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, getProfile } from "@/app/actions/profile";
import { Loader2, ArrowRight, ArrowLeft, Plus, Trash2, GraduationCap, Briefcase, Award, Sparkles, Check } from "lucide-react";

interface Entry {
    id: string;
    title: string;
    organization: string;
    date: string;
    description: string;
}

interface FormData {
    rawResumeText: string;
    education: Entry[];
    experience: Entry[];
    achievements: Entry[];
    skills: string[];
    preferredFields: string[];
}

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        rawResumeText: "",
        education: [],
        experience: [],
        achievements: [],
        skills: [],
        preferredFields: [],
    });

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await getProfile();
            if (profile) {
                setFormData({
                    rawResumeText: profile.rawResumeText || "",
                    education: (profile.education as Entry[]) || [],
                    experience: (profile.experience as Entry[]) || [],
                    achievements: (profile.achievements as Entry[]) || [],
                    skills: profile.skills || [],
                    preferredFields: profile.preferredFields || [],
                });
            }
            setLoading(false);
        };
        loadProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveProfile(formData);
            router.push("/dashboard");
        } catch (error) {
            console.error(error);
            alert("Failed to save profile.");
        }
        setSaving(false);
    };

    const addEntry = (type: 'education' | 'experience' | 'achievements') => {
        const newEntry = { id: Math.random().toString(36).substr(2, 9), title: "", organization: "", date: "", description: "" };
        setFormData({ ...formData, [type]: [...formData[type], newEntry] });
    };

    const updateEntry = (type: 'education' | 'experience' | 'achievements', id: string, field: keyof Entry, value: string) => {
        const updated = formData[type].map(entry => entry.id === id ? { ...entry, [field]: value } : entry);
        setFormData({ ...formData, [type]: updated });
    };

    const removeEntry = (type: 'education' | 'experience' | 'achievements', id: string) => {
        setFormData({ ...formData, [type]: formData[type].filter(e => e.id !== id) });
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto flex flex-col gap-12">
                
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= s ? 'bg-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/20' : 'bg-white/5 text-text-muted border border-white/5'}`}>
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 3 && <div className={`w-12 h-0.5 rounded-full transition-all duration-1000 ${step > s ? 'bg-brand-primary' : 'bg-white/5'}`} />}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                                Your <span className="text-brand-primary">Source of Truth.</span>
                            </h1>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                                Paste your current resume or a comprehensive history. This forms the foundation of every application we draft.
                            </p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <textarea
                                className="w-full h-80 bg-white/5 border border-white/10 rounded-3xl p-8 text-lg focus:outline-none focus:border-brand-primary/50 transition-all resize-none font-sans leading-relaxed"
                                placeholder="Paste everything here..."
                                value={formData.rawResumeText}
                                onChange={(e) => setFormData({ ...formData, rawResumeText: e.target.value })}
                            />
                            <div className="flex justify-end pt-4">
                                <button onClick={() => setStep(2)} className="btn btn-primary px-10 py-4 text-base">
                                    Next: Structured Data <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-bold text-white">Structure your <span className="text-brand-primary">History.</span></h2>
                            <p className="text-lg text-text-secondary">Extracting specific details helps our agents draft more precise essays.</p>
                        </div>

                        <div className="flex flex-col gap-12">
                            <Section 
                                title="Education" 
                                icon={<GraduationCap />} 
                                entries={formData.education} 
                                onAdd={() => addEntry('education')}
                                onUpdate={(id, f, v) => updateEntry('education', id, f, v)}
                                onRemove={(id) => removeEntry('education', id)}
                            />
                            <Section 
                                title="Experience" 
                                icon={<Briefcase />} 
                                entries={formData.experience} 
                                onAdd={() => addEntry('experience')}
                                onUpdate={(id, f, v) => updateEntry('experience', id, f, v)}
                                onRemove={(id) => removeEntry('experience', id)}
                            />
                            <Section 
                                title="Achievements" 
                                icon={<Award />} 
                                entries={formData.achievements} 
                                onAdd={() => addEntry('achievements')}
                                onUpdate={(id, f, v) => updateEntry('achievements', id, f, v)}
                                onRemove={(id) => removeEntry('achievements', id)}
                            />
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <button onClick={() => setStep(1)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back to Raw Text
                            </button>
                            <button onClick={() => setStep(3)} className="btn btn-primary px-10 py-4 text-base">
                                Next: Final Preferences <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-bold text-white">Strategic <span className="text-brand-primary">Alignment.</span></h2>
                            <p className="text-lg text-text-secondary">Tell us what you want to achieve so we can prioritize the right scholarships.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Expertise & Skills</label>
                                <textarea
                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-brand-primary/50 transition-all resize-none"
                                    placeholder="e.g. Python, Public Speaking, Clinical Research (comma separated)"
                                    value={formData.skills.join(", ")}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(",").map(s => s.trim()) })}
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider">Target Fields</label>
                                <textarea
                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-brand-primary/50 transition-all resize-none"
                                    placeholder="e.g. Social Impact, BioTech, Environmental Law (comma separated)"
                                    value={formData.preferredFields.join(", ")}
                                    onChange={(e) => setFormData({ ...formData, preferredFields: e.target.value.split(",").map(s => s.trim()) })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/5">
                            <button onClick={() => setStep(2)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back to History
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="btn btn-primary px-12 py-4 text-base min-w-[200px]"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Complete Profile</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Section({ title, icon, entries, onAdd, onUpdate, onRemove }: { title: string, icon: React.ReactNode, entries: Entry[], onAdd: () => void, onUpdate: (id: string, f: keyof Entry, v: string) => void, onRemove: (id: string) => void }) {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <button onClick={onAdd} className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                    <Plus className="w-4 h-4" /> Add Entry
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {entries.map((entry) => (
                    <div key={entry.id} className="p-6 rounded-3xl glass border-white/5 flex flex-col gap-4 group">
                        <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                <input 
                                    className="bg-transparent border-none text-lg font-semibold text-white focus:outline-none placeholder:text-white/20" 
                                    placeholder="Title / Role"
                                    value={entry.title}
                                    onChange={(e) => onUpdate(entry.id, 'title', e.target.value)}
                                />
                                <input 
                                    className="bg-transparent border-none text-lg text-brand-primary focus:outline-none placeholder:text-brand-primary/20" 
                                    placeholder="Organization / Institution"
                                    value={entry.organization}
                                    onChange={(e) => onUpdate(entry.id, 'organization', e.target.value)}
                                />
                            </div>
                            <button onClick={() => onRemove(entry.id)} className="text-red-400/50 hover:text-red-400 transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <input 
                            className="bg-transparent border-none text-sm text-text-muted focus:outline-none placeholder:text-text-muted/20" 
                            placeholder="Date (e.g. 2021 - Present)"
                            value={entry.date}
                            onChange={(e) => onUpdate(entry.id, 'date', e.target.value)}
                        />
                        <textarea 
                            className="bg-transparent border-none text-text-secondary focus:outline-none resize-none placeholder:text-text-secondary/20" 
                            placeholder="Description of impact and responsibilities..."
                            rows={3}
                            value={entry.description}
                            onChange={(e) => onUpdate(entry.id, 'description', e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
