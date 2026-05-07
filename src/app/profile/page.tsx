"use client";

import { useState, useEffect } from "react";
import { saveProfile, getProfile, type ProfileData } from "@/app/actions/profile";
import { CountrySelect } from "@/components/CountrySelect";
import { EducationLevel, Gender, Ethnicity } from "@/generated/client";
import {
    Loader2, Plus, Trash2, GraduationCap, Briefcase, Award, Heart,
    Globe, User, Target, Home, Edit3, Check, X, Sparkles, ChevronDown, ChevronUp, Users
} from "lucide-react";

interface Entry {
    id: string;
    title: string;
    organization: string;
    date: string;
    description: string;
}

type TabId = "history" | "strategic" | "narrative";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>("history");
    const [formData, setFormData] = useState<ProfileData>({
        rawResumeText: "",
        education: [], experience: [], volunteering: [], achievements: [],
        skills: [], preferredFields: [],
        nationality: "", residency: "",
        isFirstGen: false, gender: "", ethnicity: "",
        householdContext: "", careerGoals: "", currentGPA: "", levelOfEducation: "",
    });

    useEffect(() => {
        getProfile().then(profile => {
            if (profile) {
                setFormData({
                    rawResumeText: profile.rawResumeText || "",
                    education:    (profile.education    as unknown as Entry[]) || [],
                    experience:   (profile.experience   as unknown as Entry[]) || [],
                    volunteering: (profile.volunteering as unknown as Entry[]) || [],
                    achievements: (profile.achievements as unknown as Entry[]) || [],
                    skills:           profile.skills           || [],
                    preferredFields:  profile.preferredFields  || [],
                    nationality:      profile.nationality      || "",
                    residency:        profile.residency        || "",
                    isFirstGen:       profile.isFirstGen       || false,
                    gender:           (profile.gender           as Gender)          || "",
                    ethnicity:        (profile.ethnicity        as Ethnicity)       || "",
                    householdContext: profile.householdContext || "",
                    careerGoals:      profile.careerGoals      || "",
                    currentGPA:       profile.currentGPA       || "",
                    levelOfEducation: (profile.levelOfEducation as EducationLevel) || "",
                });
            }
            setLoading(false);
        });
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await saveProfile(formData);
        } catch (e) {
            console.error(e);
            alert("Failed to save.");
        }
        setSaving(false);
    };

    const stampIds = (entries: any[]) =>
        (entries || []).map(e => ({ ...e, id: e.id || Math.random().toString(36).substr(2, 9) }));

    const addEntry = (type: keyof Pick<ProfileData, 'education' | 'experience' | 'volunteering' | 'achievements'>) => {
        const newEntry = { id: Math.random().toString(36).substr(2, 9), title: "", organization: "", date: "", description: "" };
        setFormData(prev => ({ ...prev, [type]: [...(prev[type] as Entry[]), newEntry] }));
    };

    const updateEntry = (type: keyof Pick<ProfileData, 'education' | 'experience' | 'volunteering' | 'achievements'>, id: string, field: keyof Entry, value: string) => {
        setFormData(prev => ({
            ...prev,
            [type]: (prev[type] as Entry[]).map(e => e.id === id ? { ...e, [field]: value } : e)
        }));
    };

    const removeEntry = (type: keyof Pick<ProfileData, 'education' | 'experience' | 'volunteering' | 'achievements'>, id: string) => {
        setFormData(prev => ({ ...prev, [type]: (prev[type] as Entry[]).filter(e => e.id !== id) }));
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
    );

    const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
        { id: "history",   label: "Academic History",  icon: <GraduationCap className="w-4 h-4" /> },
        { id: "strategic", label: "Strategic Details",  icon: <Globe className="w-4 h-4" /> },
        { id: "narrative", label: "Vision & Narrative", icon: <Target className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 px-6">
            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold text-white">Your <span className="text-brand-primary">Profile.</span></h1>
                        <p className="text-text-secondary text-lg">Review and update your academic identity.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary px-8 py-3 min-w-[140px]"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Save Changes</>}
                    </button>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 border-b border-white/10 pb-0">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-xl transition-all border-b-2 -mb-px ${
                                activeTab === tab.id
                                    ? "text-brand-primary border-brand-primary bg-brand-primary/5"
                                    : "text-text-muted border-transparent hover:text-white hover:border-white/20"
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Panels */}
                <div className="flex flex-col gap-10 animate-fade-in">

                    {/* --- HISTORY TAB --- */}
                    {activeTab === "history" && (
                        <>
                            <SectionEditor
                                title="Education"
                                icon={<GraduationCap />}
                                entries={stampIds(formData.education as Entry[])}
                                onAdd={() => addEntry('education')}
                                onUpdate={(id, f, v) => updateEntry('education', id, f, v)}
                                onRemove={(id) => removeEntry('education', id)}
                                titlePlaceholder="Degree / Field of Study"
                                orgPlaceholder="University / Institution"
                            />
                            <SectionEditor
                                title="Work Experience"
                                icon={<Briefcase />}
                                entries={stampIds(formData.experience as Entry[])}
                                onAdd={() => addEntry('experience')}
                                onUpdate={(id, f, v) => updateEntry('experience', id, f, v)}
                                onRemove={(id) => removeEntry('experience', id)}
                                titlePlaceholder="Job Title / Role"
                                orgPlaceholder="Organization / Company"
                            />
                            <SectionEditor
                                title="Volunteering"
                                icon={<Heart />}
                                entries={stampIds(formData.volunteering as Entry[])}
                                onAdd={() => addEntry('volunteering')}
                                onUpdate={(id, f, v) => updateEntry('volunteering', id, f, v)}
                                onRemove={(id) => removeEntry('volunteering', id)}
                                titlePlaceholder="Volunteer Role"
                                orgPlaceholder="Organization"
                            />
                            <SectionEditor
                                title="Achievements & Awards"
                                icon={<Award />}
                                entries={stampIds(formData.achievements as Entry[])}
                                onAdd={() => addEntry('achievements')}
                                onUpdate={(id, f, v) => updateEntry('achievements', id, f, v)}
                                onRemove={(id) => removeEntry('achievements', id)}
                                titlePlaceholder="Award / Achievement Name"
                                orgPlaceholder="Issuing Organization"
                            />
                        </>
                    )}

                    {/* --- STRATEGIC TAB --- */}
                    {activeTab === "strategic" && (
                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <CountrySelect
                                    label="Nationality"
                                    icon={<Globe className="w-4 h-4" />}
                                    value={formData.nationality}
                                    onChange={(val) => setFormData(prev => ({ ...prev, nationality: val }))}
                                    placeholder="Select your nationality..."
                                />
                                <CountrySelect
                                    label="Country of Residency"
                                    icon={<Globe className="w-4 h-4" />}
                                    value={formData.residency}
                                    onChange={(val) => setFormData(prev => ({ ...prev, residency: val }))}
                                    placeholder="Select country of residence..."
                                />
                                <SelectField
                                    label="Education Level"
                                    icon={<GraduationCap className="w-4 h-4" />}
                                    value={formData.levelOfEducation}
                                    onChange={(val) => setFormData(prev => ({ ...prev, levelOfEducation: val as EducationLevel }))}
                                    options={Object.values(EducationLevel)}
                                />
                                <div className="flex flex-col gap-4">
                                    <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                        <GraduationCap className="w-4 h-4" /> Current GPA
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all"
                                        placeholder="e.g. 3.9/4.0"
                                        value={formData.currentGPA}
                                        onChange={(e) => setFormData(prev => ({ ...prev, currentGPA: e.target.value }))}
                                    />
                                </div>
                                <SelectField
                                    label="Gender Identification"
                                    icon={<User className="w-4 h-4" />}
                                    value={formData.gender}
                                    onChange={(val) => setFormData(prev => ({ ...prev, gender: val as Gender }))}
                                    options={Object.values(Gender)}
                                />
                                <SelectField
                                    label="Ethnicity"
                                    icon={<Users className="w-4 h-4" />}
                                    value={formData.ethnicity}
                                    onChange={(val) => setFormData(prev => ({ ...prev, ethnicity: val as Ethnicity }))}
                                    options={Object.values(Ethnicity)}
                                />
                                <div className="flex flex-col gap-4 md:col-span-2">
                                    <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                        <User className="w-4 h-4" /> Identity
                                    </label>
                                    <button
                                        onClick={() => setFormData(prev => ({ ...prev, isFirstGen: !prev.isFirstGen }))}
                                        className={`w-fit px-8 py-3 rounded-2xl border transition-all ${formData.isFirstGen ? 'bg-brand-primary/20 border-brand-primary text-white' : 'bg-white/5 border-white/10 text-text-secondary'}`}
                                    >
                                        {formData.isFirstGen && <Check className="w-4 h-4 inline mr-2" />}
                                        First-Generation Student
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- NARRATIVE TAB --- */}
                    {activeTab === "narrative" && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                    <Home className="w-4 h-4" /> Financial & Household Context
                                </label>
                                <p className="text-xs text-text-muted -mt-2">Describe your family situation, financial need, or obstacles you've overcome. Used by the AI to craft authentic need-based narratives.</p>
                                <textarea
                                    className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all resize-none leading-relaxed"
                                    placeholder="e.g. I grew up in a single-parent household where..."
                                    value={formData.householdContext}
                                    onChange={(e) => setFormData(prev => ({ ...prev, householdContext: e.target.value }))}
                                />
                            </div>
                            <div className="flex flex-col gap-4">
                                <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                                    <Target className="w-4 h-4" /> Long-term Career Goals
                                </label>
                                <p className="text-xs text-text-muted -mt-2">Your 5-10 year vision. The more specific, the better the AI can connect your goals to scholarship values.</p>
                                <textarea
                                    className="w-full h-48 bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-brand-primary/50 transition-all resize-none leading-relaxed"
                                    placeholder="e.g. I plan to return to Ghana and build..."
                                    value={formData.careerGoals}
                                    onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Floating Save Bar */}
                <div className="fixed bottom-6 left-0 right-0 flex justify-center pointer-events-none">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary px-10 py-3 shadow-2xl shadow-brand-primary/20 pointer-events-auto"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> Save Profile</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionEditor({ title, icon, entries, onAdd, onUpdate, onRemove, titlePlaceholder, orgPlaceholder }: {
    title: string; icon: React.ReactNode;
    entries: Entry[];
    onAdd: () => void;
    onUpdate: (id: string, f: keyof Entry, v: string) => void;
    onRemove: (id: string) => void;
    titlePlaceholder: string;
    orgPlaceholder: string;
}) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">{icon}</div>
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <span className="text-xs font-medium text-text-muted bg-white/5 px-2 py-0.5 rounded-full">{entries.length}</span>
                </div>
                <button onClick={onAdd} className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors">
                    <Plus className="w-4 h-4" /> Add
                </button>
            </div>
            {entries.length === 0 && (
                <div className="py-8 text-center text-text-muted text-sm glass rounded-2xl border border-white/5">
                    No entries yet. Click <span className="text-brand-primary font-medium">Add</span> to get started.
                </div>
            )}
            <div className="flex flex-col gap-4">
                {entries.map((entry) => (
                    <div key={entry.id} className="p-6 rounded-3xl glass border-white/5 flex flex-col gap-4 group">
                        <div className="flex justify-between items-start gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                                <input
                                    className="bg-transparent border-b border-white/10 text-base font-semibold text-white focus:outline-none focus:border-brand-primary/50 transition-colors py-1 placeholder:text-white/20"
                                    placeholder={titlePlaceholder}
                                    value={entry.title}
                                    onChange={(e) => onUpdate(entry.id, 'title', e.target.value)}
                                />
                                <input
                                    className="bg-transparent border-b border-white/10 text-base text-brand-primary focus:outline-none focus:border-brand-primary/50 transition-colors py-1 placeholder:text-brand-primary/30"
                                    placeholder={orgPlaceholder}
                                    value={entry.organization}
                                    onChange={(e) => onUpdate(entry.id, 'organization', e.target.value)}
                                />
                            </div>
                            <button onClick={() => onRemove(entry.id)} className="text-red-400/30 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <input
                            className="bg-transparent border-none text-sm text-text-muted focus:outline-none py-1"
                            placeholder="Date range (e.g. Sept 2021 – June 2024)"
                            value={entry.date}
                            onChange={(e) => onUpdate(entry.id, 'date', e.target.value)}
                        />
                        <textarea
                            className="bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-text-secondary focus:outline-none focus:border-brand-primary/30 resize-none transition-colors"
                            placeholder="Describe your impact, responsibilities, or what made this significant..."
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

function SelectField({ label, icon, value, onChange, options }: { label: string; icon: React.ReactNode; value: string; onChange: (val: string) => void; options: string[]; }) {
    return (
        <div className="flex flex-col gap-4">
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">{icon} {label}</label>
            <div className="relative">
                <select
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-brand-primary/50 transition-all appearance-none cursor-pointer"
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
