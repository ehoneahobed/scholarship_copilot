"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, getProfile, magicAutoFill, type ProfileData } from "@/app/actions/profile";
import { Loader2, ArrowRight, ArrowLeft, Plus, Trash2, GraduationCap, Briefcase, Award, Sparkles, Check, Globe, Heart, User, Target, Home, FileText, Wand2, ChevronDown, ChevronUp, Users } from "lucide-react";
import { EducationLevel, Gender, Ethnicity } from "@/generated/client";

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
    const [extracting, setExtracting] = useState(false);
    const [expandedReview, setExpandedReview] = useState<string | null>("strategic");
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
        levelOfEducation: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getProfile();
                if (profile) {
                    setFormData({
                        rawResumeText: profile.rawResumeText || "",
                        education: (profile.education as unknown as Entry[]) || [],
                        experience: (profile.experience as unknown as Entry[]) || [],
                        volunteering: (profile.volunteering as unknown as Entry[]) || [],
                        achievements: (profile.achievements as unknown as Entry[]) || [],
                        skills: profile.skills || [],
                        preferredFields: profile.preferredFields || [],
                        nationality: profile.nationality || "",
                        residency: profile.residency || "",
                        isFirstGen: profile.isFirstGen || false,
                        gender: (profile.gender as Gender) || "",
                        ethnicity: (profile.ethnicity as Ethnicity) || "",
                        householdContext: profile.householdContext || "",
                        careerGoals: profile.careerGoals || "",
                        currentGPA: profile.currentGPA || "",
                        levelOfEducation: (profile.levelOfEducation as EducationLevel) || "",
                    });
                }
            } catch (error) {
                console.error("Failed to load profile:", error);
            }
            setLoading(false);
        };
        loadProfile();
    }, []);

    const stampIds = (entries: any[]) =>
        (entries || []).map(e => ({ ...e, id: e.id || Math.random().toString(36).substr(2, 9) }));

    const handleMagicFill = async () => {
        if (!formData.rawResumeText) return;
        setExtracting(true);
        try {
            const result = await magicAutoFill(formData.rawResumeText);
            if (result) {
                setFormData(prev => ({
                    ...prev,
                    education:    result.education    ? stampIds(result.education)    : prev.education,
                    experience:   result.experience   ? stampIds(result.experience)   : prev.experience,
                    volunteering: result.volunteering ? stampIds(result.volunteering) : prev.volunteering,
                    achievements: result.achievements ? stampIds(result.achievements) : prev.achievements,
                    skills:           result.skills           || prev.skills,
                    nationality:      result.nationality      || prev.nationality,
                    residency:        result.residency        || prev.residency,
                    currentGPA:       result.currentGPA       || prev.currentGPA,
                    levelOfEducation: result.levelOfEducation || prev.levelOfEducation,
                }));
                setStep(2);
            }
        } catch (error) {
            console.error(error);
            alert("Magic extraction failed. Please proceed manually.");
        }
        setExtracting(false);
    };

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
        setFormData(prev => ({ ...prev, [type]: [...(prev[type] as Entry[]), newEntry] }));
    };

    const updateEntry = (type: 'education' | 'experience' | 'volunteering' | 'achievements', id: string, field: keyof Entry, value: string) => {
        setFormData(prev => ({
            ...prev,
            [type]: (prev[type] as Entry[]).map(entry => entry.id === id ? { ...entry, [field]: value } : entry)
        }));
    };

    const removeEntry = (type: 'education' | 'experience' | 'volunteering' | 'achievements', id: string) => {
        setFormData(prev => ({ ...prev, [type]: (prev[type] as Entry[]).filter(e => e.id !== id) }));
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>;

    return (
        <div className="min-h-screen pt-24 pb-20 px-6 text-white">
            <div className="max-w-4xl mx-auto flex flex-col gap-12">
                
                {/* Progress Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= s ? 'bg-brand-primary text-white scale-110 shadow-lg shadow-brand-primary/20' : 'bg-white/5 text-text-muted border border-white/5'}`}>
                                {step > s ? <Check className="w-4 h-4" /> : s}
                            </div>
                            {s < 5 && <div className={`w-8 md:w-12 h-0.5 rounded-full transition-all duration-1000 ${step > s ? 'bg-brand-primary' : 'bg-white/5'}`} />}
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                                Start with <span className="text-brand-primary">Magic.</span>
                            </h1>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl">
                                Paste your resume, LinkedIn profile, or a short bio. Our AI will extract your entire history to save you time.
                            </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            <textarea
                                className="w-full h-80 bg-white/5 border border-white/10 rounded-3xl p-8 text-lg focus:outline-none focus:border-brand-primary/50 transition-all resize-none font-sans leading-relaxed text-white placeholder:text-white/20"
                                placeholder="Paste your resume or bio here..."
                                value={formData.rawResumeText}
                                onChange={(e) => setFormData({ ...formData, rawResumeText: e.target.value })}
                            />
                            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                                <button onClick={() => setStep(2)} className="text-text-muted hover:text-white transition-colors text-sm font-medium">
                                    I'll enter data manually
                                </button>
                                <button 
                                    onClick={handleMagicFill} 
                                    disabled={!formData.rawResumeText || extracting}
                                    className="btn btn-primary px-10 py-4 text-base min-w-[240px] group"
                                >
                                    {extracting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Wand2 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> Extract with AI</>}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-bold">Review your <span className="text-brand-primary">History.</span></h2>
                            <p className="text-lg text-text-secondary">AI has pre-filled what it found. Review it and add anything missing.</p>
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
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-bold">Strategic <span className="text-brand-primary">Details.</span></h2>
                            <p className="text-lg text-text-secondary">Standardized metrics that determine exact eligibility.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><Globe className="w-4 h-4" /> Nationality</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 transition-all text-white" value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><Globe className="w-4 h-4" /> Residency</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 transition-all text-white" value={formData.residency} onChange={(e) => setFormData({ ...formData, residency: e.target.value })} />
                            </div>
                            
                            <SelectField 
                                label="Current Education Level" 
                                icon={<GraduationCap className="w-4 h-4" />}
                                value={formData.levelOfEducation}
                                onChange={(val) => setFormData({ ...formData, levelOfEducation: val as EducationLevel })}
                                options={Object.values(EducationLevel)}
                            />

                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Current GPA</label>
                                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 transition-all text-white" placeholder="e.g. 3.9/4.0" value={formData.currentGPA} onChange={(e) => setFormData({ ...formData, currentGPA: e.target.value })} />
                            </div>

                            <SelectField 
                                label="Gender Identification" 
                                icon={<User className="w-4 h-4" />}
                                value={formData.gender}
                                onChange={(val) => setFormData({ ...formData, gender: val as Gender })}
                                options={Object.values(Gender)}
                            />

                            <SelectField 
                                label="Ethnicity" 
                                icon={<Users className="w-4 h-4" />}
                                value={formData.ethnicity}
                                onChange={(val) => setFormData({ ...formData, ethnicity: val as Ethnicity })}
                                options={Object.values(Ethnicity)}
                            />

                            <div className="flex flex-col gap-6 md:col-span-2">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><User className="w-4 h-4" /> Identity</label>
                                <button 
                                    onClick={() => setFormData({ ...formData, isFirstGen: !formData.isFirstGen })}
                                    className={`w-full md:w-fit px-8 py-3 rounded-2xl border transition-all ${formData.isFirstGen ? 'bg-brand-primary/20 border-brand-primary text-white' : 'bg-white/5 border-white/10 text-text-secondary'}`}
                                >
                                    {formData.isFirstGen ? <Check className="w-4 h-4 inline mr-2" /> : null} First-Gen Student
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <button onClick={() => setStep(2)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button onClick={() => setStep(4)} className="btn btn-primary px-10 py-4 text-base">
                                Continue <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-10 animate-fade-in">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-bold">Vision & <span className="text-brand-primary">Narrative.</span></h2>
                            <p className="text-lg text-text-secondary">The "Soul" of your application.</p>
                        </div>

                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><Home className="w-4 h-4" /> Financial Context</label>
                                <textarea
                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-brand-primary/50 transition-all resize-none leading-relaxed text-white placeholder:text-white/20"
                                    placeholder="Explain your family situation, financial need, or obstacles..."
                                    value={formData.householdContext}
                                    onChange={(e) => setFormData({ ...formData, householdContext: e.target.value })}
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2"><Target className="w-4 h-4" /> Long-term Goals</label>
                                <textarea
                                    className="w-full h-40 bg-white/5 border border-white/10 rounded-3xl p-6 focus:outline-none focus:border-brand-primary/50 transition-all resize-none leading-relaxed text-white placeholder:text-white/20"
                                    placeholder="Where do you see yourself in 10 years?"
                                    value={formData.careerGoals}
                                    onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8">
                            <button onClick={() => setStep(3)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button onClick={() => setStep(5)} className="btn btn-primary px-10 py-4 text-base">
                                Review Profile <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="flex flex-col gap-10 animate-fade-in pb-20">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-4xl font-bold">Review & <span className="text-brand-primary">Finalize.</span></h2>
                            <p className="text-lg text-text-secondary">Your profile is complete. Review everything one last time.</p>
                        </div>

                        <div className="flex flex-col gap-4 text-white">
                            <Accordion 
                                title="Strategic & Demographic Details" 
                                icon={<Globe className="w-5 h-5 text-brand-primary" />} 
                                isOpen={expandedReview === "strategic"} 
                                onToggle={() => setExpandedReview(expandedReview === "strategic" ? null : "strategic")}
                            >
                                <div className="grid grid-cols-2 gap-y-6 gap-x-12 p-8">
                                    <ReviewField label="Nationality" value={formData.nationality} />
                                    <ReviewField label="Residency" value={formData.residency} />
                                    <ReviewField label="Education Level" value={formData.levelOfEducation.replace(/_/g, ' ')} />
                                    <ReviewField label="Current GPA" value={formData.currentGPA} />
                                    <ReviewField label="Gender" value={formData.gender.replace(/_/g, ' ')} />
                                    <ReviewField label="Ethnicity" value={formData.ethnicity.replace(/_/g, ' ')} />
                                    <ReviewField label="First-Gen" value={formData.isFirstGen ? "Yes" : "No"} />
                                </div>
                            </Accordion>

                            <Accordion 
                                title="Academic & Professional History" 
                                icon={<FileText className="w-5 h-5 text-brand-primary" />} 
                                isOpen={expandedReview === "history"} 
                                onToggle={() => setExpandedReview(expandedReview === "history" ? null : "history")}
                            >
                                <div className="flex flex-col gap-8 p-8">
                                    <HistoryList title="Education" items={formData.education as Entry[]} />
                                    <HistoryList title="Experience" items={formData.experience as Entry[]} />
                                    <HistoryList title="Achievements" items={formData.achievements as Entry[]} />
                                    <HistoryList title="Volunteering" items={formData.volunteering as Entry[]} />
                                </div>
                            </Accordion>

                            <Accordion 
                                title="Narrative Context" 
                                icon={<Target className="w-5 h-5 text-brand-primary" />} 
                                isOpen={expandedReview === "narrative"} 
                                onToggle={() => setExpandedReview(expandedReview === "narrative" ? null : "narrative")}
                            >
                                <div className="flex flex-col gap-8 p-8">
                                    <ReviewField label="Financial Context" value={formData.householdContext} multiline />
                                    <ReviewField label="Career Goals" value={formData.careerGoals} multiline />
                                </div>
                            </Accordion>
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/5">
                            <button onClick={() => setStep(4)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                            <button 
                                onClick={handleSave}
                                disabled={saving}
                                className="btn btn-primary px-12 py-4 text-base min-w-[220px]"
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

function SelectField({ label, icon, value, onChange, options }: { label: string, icon: React.ReactNode, value: string, onChange: (val: string) => void, options: string[] }) {
    return (
        <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">{icon} {label}</label>
            <div className="relative">
                <select 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-brand-primary/50 transition-all appearance-none text-white cursor-pointer"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                >
                    <option value="" className="bg-[#0A0A0A]">Select...</option>
                    {options.map(opt => (
                        <option key={opt} value={opt} className="bg-[#0A0A0A]">{opt.replace(/_/g, ' ')}</option>
                    ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

function Accordion({ title, icon, children, isOpen, onToggle }: { title: string, icon: React.ReactNode, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) {
    return (
        <div className="glass rounded-3xl border-white/5 overflow-hidden transition-all duration-300">
            <button onClick={onToggle} className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">{icon}</div>
                    <span className="text-xl font-bold text-white">{title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-6 h-6 text-text-muted" /> : <ChevronDown className="w-6 h-6 text-text-muted" />}
            </button>
            <div className={`transition-all duration-300 ${isOpen ? 'max-h-[3000px] opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 invisible'}`}>
                {children}
            </div>
        </div>
    );
}

function ReviewField({ label, value, multiline = false }: { label: string, value: string, multiline?: boolean }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-widest">{label}</span>
            <p className={`text-white/90 ${multiline ? 'text-sm leading-relaxed' : 'text-lg font-medium'}`}>{value || "Not provided"}</p>
        </div>
    );
}

function HistoryList({ title, items }: { title: string, items: Entry[] }) {
    if (items.length === 0) return null;
    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-brand-primary uppercase tracking-widest">{title}</h4>
            <div className="flex flex-col gap-4">
                {items.map(item => (
                    <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-white">{item.title}</span>
                            <span className="text-xs text-text-muted">{item.date}</span>
                        </div>
                        <div className="text-sm text-brand-primary/80 mb-2">{item.organization}</div>
                        <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                    </div>
                ))}
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
            <div className="flex flex-col gap-4 text-white">
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
