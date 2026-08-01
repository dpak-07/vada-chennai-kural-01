"use client";
import TeamCard from "../ui/TeamCard";
import Button from "../common/Button";
import teamData from "@/data/team.json";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function EditorialPreview() {
  const { lang } = useLanguage();
  
  // Show first 3 team members
  const previewTeam = teamData.slice(0, 3);

  const t = {
    ta: {
      btnText: "முழு குழுவையும் காண்க (Meet the Editorial Team)"
    },
    en: {
      btnText: "Meet the Editorial Team"
    }
  }[lang];

  // Localized team members
  const localizedTeam = previewTeam.map(member => {
    if (lang === "en") {
      const enNames = {
        "சுபாஷ் சந்திரபோஸ்": "Subash Chandra Bose",
        "கார்த்திக் ராஜா": "Karthik Raja",
        "ஆனந்தி குமார்": "Anandhi Kumar"
      };
      const enRoles = {
        "தலைமை ஆசிரியர் (Editor-in-Chief)": "Editor-in-Chief",
        "இணை ஆசிரியர் (Associate Editor)": "Associate Editor",
        "புகைப்படக் கலைஞர் (Lead Photographer)": "Lead Photographer"
      };
      return {
        ...member,
        name: enNames[member.name] || member.name,
        role: enRoles[member.role] || member.role
      };
    }
    return member;
  });

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {localizedTeam.map((member) => (
          <TeamCard key={member.id} member={member} />
        ))}
      </div>

      <div className="text-center pt-4">
        <Button href="/editorial" variant="outline" className="group flex items-center justify-center gap-2 mx-auto cursor-pointer">
          {t.btnText}{" "}
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
