"use client";
import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, placeholder = "இதழ்களைத் தேடுக (Search issues...)" }) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-white border border-border-subtle hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg text-sm text-charcoal shadow-sm transition-all duration-300 font-sans"
      />
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="w-5 h-5 text-charcoal/40" />
      </div>
    </div>
  );
}
