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
      btnText: "முழு குழுவையும் காண்க"
    },
    en: {
      btnText: "Meet the Editorial Team"
    }
  }[lang];

  // Localized team members
  const localizedTeam = previewTeam.map(member => {
    if (lang === "en") {
      const enNames = {
        "முனைவர். அ. இளங்கோவன்": "Dr. A. Elangovan",
        "க. செல்வி": "K. Selvi",
        "இரா. சரவணன்": "R. Saravanan"
      };
      const enRoles = {
        "தலைமை ஆசிரியர்": "Editor-in-Chief",
        "துணை ஆசிரியர்": "Deputy Editor",
        "புகைப்படக் கலைஞர் & வடிவமைப்பாளர்": "Photojournalist & Designer"
      };
      const enDescriptions = {
        "முனைவர். அ. இளங்கோவன்": "With over 20 years of experience in Tamil literature and a deep engagement with North Chennai historical research.",
        "க. செல்வி": "A field researcher with 10 years of experience covering the social issues of marginalized communities and women's livelihoods.",
        "இரா. சரவணன்": "Has documented the lives of North Chennai's working people and their traditional art forms through his camera."
      };
      return {
        ...member,
        name: enNames[member.name] || member.name,
        role: enRoles[member.role] || member.role,
        description: enDescriptions[member.name] || member.description
      };
    }
    return member;
  });

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {localizedTeam.map((member, i) => (
          <TeamCard key={member.id} member={member} index={i} />
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
