"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, getProfile, type ProfileData } from "@/app/actions/profile";
import { Loader2, ArrowRight, ArrowLeft, Plus, Trash2, GraduationCap, Briefcase, Award, Sparkles, Check, Globe, Heart, User, Target, Home } from "lucide-react";

interface Entry {
    id: string;
    title: string;
    organization: string;
    date: string;
    description: string;
}

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<ProfileData>({
        rawResumeText: "",
        education: [],
        experience: [],
        volunteering: [],
        achievements: [],
        skills: [],
        preferredFields: [],
        nationality: "",
        residency: "",
        isFirstGen: false,
        gender: "",
        ethnicity: "",
        householdContext: "",
        careerGoals: "",
        currentGPA: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            const profile = await getProfile();
            if (profile) {
                setFormData({
                    rawResumeText: profile.rawResumeText || "",
                    education: (profile.education as Entry[]) || [],
                    experience: (profile.experience as Entry[]) || [],
                    volunteering: (profile.volunteering as Entry[]) || [],
                    achievements: (profile.achievements as Entry[]) || [],
                    skills: profile.skills || [],
                    preferredFields: profile.preferredFields || [],
                    nationality: profile.nationality || "",
                    residency: profile.residency || "",
                    isFirstGen: profile.isFirstGen || false,
                    gender: profile.gender || "",
                    ethnicity: profile.ethnicity || "",
                    householdContext: profile.householdContext || "",
                    careerGoals: profile.careerGoals || "",
                    currentGPA: profile.currentGPA || "",
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

    const addEntry = (type: 'education' | 'experience' | 'volunteering' | 'achievements') => {
        const newEntry = { id: Math.random().toString(36).substr(2, 9), title: "", organization: "", date: "", description: "" };
        setFormData({ ...formData, [type]: [...(formData[type] as Entry[]), newEntry] });
    };

    const updateEntry = (type: 'education' | 'experience' | 'volunteering' | 'achievements', id: string, field: keyof Entry, value: string) => {
        const updated = (formData[type] as Entry[]).map(entry => entry.id === id ? { ...entry, [field]: value } : entry);
        setFormData({ ...formData, [type]: updated });
    };

    const removeEntry = (type: 'education' | 'experience' | 'volunteering' | 'achievements', id: string) => {
        setFormData({ ...formData, [type]: (formData[type] as Entry[]).filter(e => e.id !== id) });
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto flex flex-col gap-12">
                
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-4">
                    {[1, 2, 3, 4].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= s ? 'bg-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/20' : 'bg-white/5 text-text-muted border border-white/5'}`}>
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 4 && <div className={`w-12 h-0.5 rounded-full transition-all duration-1000 ${step > s ? 'bg-brand-primary' : 'bg-white/5'}`} />}
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
                            <Section title="Education" icon={<GraduationCap />} entries={formData.education as Entry[]} onAdd={() => addEntry('education')} onUpdate={(id, f, v) => updateEntry('education', id, f, v)} onRemove={(id) => removeEntry('education', id)} />
                            <Section title="Experience" icon={<Briefcase />} entries={formData.experience as Entry[]} onAdd={() => addEntry('experience')} onUpdate={(id, f, v) => updateEntry('experience', id, f, v)} onRemove={(id) => removeEntry('experience', id)} />
                            <Section title="Volunteering" icon={<Heart />} entries={formData.volunteering as Entry[]} onAdd={() => addEntry('volunteering')} onUpdate={(id, f, v) => updateEntry('volunteering', id, f, v)} onRemove={(id) => removeEntry('volunteering', id)} />
                            <Section title="Achievements" icon={<Award />} entries={formData.achievements as Entry[]} onAdd={() => addEntry('achievements')} onUpdate={(id, f, v) => updateEntry('achievements', id, f, v)} onRemove={(id) => removeEntry('achievements', id)} />
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <button onClick={() => setStep(1)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button onClick={() => setStep(3)} className="btn btn-primary px-10 py-4 text-base">
                                Next: Strategic Context <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-bold text-white">Strategic <span className="text-brand-primary">Context.</span></h2>
                            <p className="text-lg text-text-secondary">Details that help us match you with specific eligibility requirements.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><Globe className="w-4 h-4" /> Nationality</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 transition-all" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><Globe className="w-4 h-4" /> Residency</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 transition-all" value={formData.residency} onChange={(e) => setFormData({ ...formData, residency: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Current GPA</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 transition-all" placeholder="e.g. 3.9/4.0" value={formData.currentGPA} onChange={(e) => setFormData({ ...formData, currentGPA: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-6">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><User className="w-4 h-4" /> Demographic Context</label>
                                <div className="flex items-center gap-4">
                                    <button 
                                        onClick={() => setFormData({ ...formData, isFirstGen: !formData.isFirstGen })}
                                        className={`flex-1 py-3 rounded-2xl border transition-all ${formData.isFirstGen ? 'bg-brand-primary/20 border-brand-primary text-white' : 'bg-white/5 border-white/10 text-text-secondary'}`}
                                    >
                                        First-Gen Student
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <button onClick={() => setStep(2)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button onClick={() => setStep(4)} className="btn btn-primary px-10 py-4 text-base">
                                Next: Vision & Narrative <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-bold text-white">Vision & <span className="text-brand-primary">Narrative.</span></h2>
                            <p className="text-lg text-text-secondary">The "Soul" of your application. These narratives are the biggest factors in winning.</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><Home className="w-4 h-4" /> Household & Financial Context</label>
                                <textarea
                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-brand-primary/50 transition-all resize-none leading-relaxed"
                                    placeholder="Explain your family situation, financial need, or obstacles you've overcome..."
                                    value={formData.householdContext}
                                    onChange={(e) => setFormData({ ...formData, householdContext: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><Target className="w-4 h-4" /> Long-term Career Goals</label>
                                <textarea
                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-brand-primary/50 transition-all resize-none leading-relaxed"
                                    placeholder="Where do you see yourself in 10 years? How will your education impact your community?"
                                    value={formData.careerGoals}
                                    onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/5">
                            <button onClick={() => setStep(3)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="btn btn-primary px-12 py-4 text-base min-w-[220px]"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Finalize Profile</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Section({ title, icon, entries, onAdd, onUpdate, onRemove }: { title: string, icon: React.ReactNode, entries: Entry[], onAdd: () => void, onUpdate: (id: string, f: keyof Entry, v: string) => void, onRemove: (id: string) => void }) {
    const isEducation = title === "Education";
    const isAchievement = title === "Achievements";
    const isVolunteering = title === "Volunteering";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">{icon}</div>
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <button onClick={onAdd} className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                    <Plus className="w-4 h-4" /> Add Entry
                </button>
            </div>
            <div className="flex flex-col gap-4">
                {entries.map((entry) => (
                    <div key={entry.id} className="p-6 rounded-3xl glass border-white/5 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                <input className="bg-transparent border-none text-lg font-semibold text-white focus:outline-none placeholder:text-white/20" placeholder={isEducation ? "Degree / Field" : isAchievement ? "Award Name" : isVolunteering ? "Volunteer Role" : "Job Title"} value={entry.title} onChange={(e) => onUpdate(entry.id, 'title', e.target.value)} />
                                <input className="bg-transparent border-none text-lg text-brand-primary focus:outline-none placeholder:text-brand-primary/20" placeholder={isEducation ? "University" : "Organization"} value={entry.organization} onChange={(e) => onUpdate(entry.id, 'organization', e.target.value)} />
                            </div>
                            <button onClick={() => onRemove(entry.id)} className="text-red-400/50 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                        <input className="bg-transparent border-none text-sm text-text-muted focus:outline-none" placeholder="Dates (e.g. 2021-2024)" value={entry.date} onChange={(e) => onUpdate(entry.id, 'date', e.target.value)} />
                        <textarea className="bg-transparent border-none text-text-secondary focus:outline-none resize-none" placeholder="Description of impact..." rows={3} value={entry.description} onChange={(e) => onUpdate(entry.id, 'description', e.target.value)} />
                    </div>
                ))}
            </div>
        </div>
    );
}
