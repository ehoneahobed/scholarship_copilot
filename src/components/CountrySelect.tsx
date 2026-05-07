"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { COUNTRIES } from "@/lib/countries";

interface CountrySelectProps {
    label: string;
    icon: React.ReactNode;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
}

export function CountrySelect({ label, icon, value, onChange, placeholder = "Select country..." }: CountrySelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filtered = query.length > 0
        ? COUNTRIES.filter(c => c.toLowerCase().includes(query.toLowerCase()))
        : COUNTRIES;

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleSelect = (country: string) => {
        onChange(country);
        setOpen(false);
        setQuery("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setOpen(false);
        setQuery("");
    };

    return (
        <div className="flex flex-col gap-4" ref={containerRef}>
            <label className="text-sm font-semibold text-text-muted uppercase tracking-wider flex items-center gap-2">
                {icon} {label}
            </label>
            <div className="relative">
                {/* Trigger */}
                <button
                    type="button"
                    onClick={() => {
                        setOpen(o => !o);
                        setTimeout(() => inputRef.current?.focus(), 50);
                    }}
                    className={`w-full bg-white/5 border rounded-2xl px-6 py-4 text-left flex items-center justify-between transition-all ${
                        open ? "border-brand-primary/50 bg-white/8" : "border-white/10 hover:border-white/20"
                    }`}
                >
                    <span className={value ? "text-white" : "text-white/30"}>
                        {value || placeholder}
                    </span>
                    <div className="flex items-center gap-2">
                        {value && (
                            <span onClick={handleClear} className="text-text-muted hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </span>
                        )}
                        <ChevronDown className={`w-5 h-5 text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </div>
                </button>

                {/* Dropdown */}
                {open && (
                    <div className="absolute z-50 mt-2 w-full bg-[#111318] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Search */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                            <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                className="bg-transparent flex-1 text-white text-sm focus:outline-none placeholder:text-white/30"
                                placeholder="Search countries..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />
                        </div>
                        {/* List */}
                        <ul className="max-h-56 overflow-y-auto py-2">
                            {filtered.length > 0 ? filtered.map(country => (
                                <li key={country}>
                                    <button
                                        type="button"
                                        onClick={() => handleSelect(country)}
                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${
                                            value === country ? "text-brand-primary font-semibold bg-brand-primary/10" : "text-white/80"
                                        }`}
                                    >
                                        {country}
                                    </button>
                                </li>
                            )) : (
                                <li className="px-4 py-3 text-sm text-text-muted text-center">No results for "{query}"</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
