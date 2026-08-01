"use client";
import TeamCard from "@/components/ui/TeamCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/common/SectionHeading";
import teamData from "@/data/team.json";
import { useLanguage } from "@/context/LanguageContext";

export default function EditorialClient() {
  const { lang } = useLanguage();

  const t = {
    ta: {
      breadcrumb: "ஆசிரியர்க்குழு",
      title: "எமது ஆசிரியர்க்குழு",
      subtitle: "MEET THE EDITORIAL BOARD",
      description: "வடசென்னையின் உண்மையான வரலாற்றையும் சமகால நிகழ்வுகளையும் நேர்மையுடனும் கலைநயத்துடனும் பதிவுசெய்யும் எங்களது அர்ப்பணிப்புள்ள ஆசிரியர்கள், புகைப்படக் கலைஞர்கள் மற்றும் சமூக ஆர்வலர்களின் குழுவை இங்கே அறிமுகப்படுத்துகிறோம்."
    },
    en: {
      breadcrumb: "Editorial Board",
      title: "Meet the Editorial Board",
      subtitle: "MEET THE EDITORIAL BOARD",
      description: "Here we introduce our dedicated team of editors, journalists, photographers, and social activists who write and document North Chennai's true history and contemporary events with honesty and artistic beauty."
    }
  }[lang];

  // Localized team members
  const localizedTeam = teamData.map(member => {
    if (lang === "en") {
      // Localize team member names and roles
      const enNames = {
        "சுபாஷ் சந்திரபோஸ்": "Subash Chandra Bose",
        "கார்த்திக் ராஜா": "Karthik Raja",
        "ஆனந்தி குமார்": "Anandhi Kumar",
        "விஜய் பாஸ்கர்": "Vijay Bhaskar"
      };
      const enRoles = {
        "தலைமை ஆசிரியர் (Editor-in-Chief)": "Editor-in-Chief",
        "இணை ஆசிரியர் (Associate Editor)": "Associate Editor",
        "புகைப்படக் கலைஞர் (Lead Photographer)": "Lead Photographer",
        "கள நிருபர் (Field Reporter)": "Field Reporter"
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
    <div className="py-12">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ name: t.breadcrumb, path: "/editorial" }]} />

        {/* Section Heading */}
        <SectionHeading
          title={t.title}
          subtitle={t.subtitle}
        />

        {/* Intro Text */}
        <div className="max-w-3xl mb-12">
          <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed font-light">
            {t.description}
          </p>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {localizedTeam.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </div>
  );
}
