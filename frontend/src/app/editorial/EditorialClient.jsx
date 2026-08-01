"use client";
import TeamCard from "@/components/ui/TeamCard";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/common/SectionHeading";
import teamData from "@/data/team.json";
import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";
import { staggerItem, VIEWPORT_ONCE } from "@/lib/motion";

export default function EditorialClient() {
  const { lang } = useLanguage();

  const t = {
    ta: {
      breadcrumb: "ஆசிரியர்க்குழு",
      title: "எமது ஆசிரியர்க்குழு",
      subtitle: "ஆசிரியர்க்குழுவை சந்திக்க",
      description: "வடசென்னையின் உண்மையான வரலாற்றையும் சமகால நிகழ்வுகளையும் நேர்மையுடனும் கலைநயத்துடனும் பதிவுசெய்யும் எங்களது அர்ப்பணிப்புள்ள ஆசிரியர்கள், புகைப்படக் கலைஞர்கள் மற்றும் சமூக ஆர்வலர்களின் குழுவை இங்கே அறிமுகப்படுத்துகிறோம்."
    },
    en: {
      breadcrumb: "Editorial Board",
      title: "Meet the Editorial Board",
      subtitle: "OUR TEAM",
      description: "Here we introduce our dedicated team of editors, journalists, photographers, and social activists who write and document North Chennai's true history and contemporary events with honesty and artistic beauty."
    }
  }[lang];

  // Localized team members
  const localizedTeam = teamData.map(member => {
    if (lang === "en") {
      // Localize team member names and roles
      const enNames = {
        "முனைவர். அ. இளங்கோவன்": "Dr. A. Elangovan",
        "க. செல்வி": "K. Selvi",
        "இரா. சரவணன்": "R. Saravanan",
        "சு. கபிலன்": "S. Kabilan"
      };
      const enRoles = {
        "தலைமை ஆசிரியர்": "Editor-in-Chief",
        "துணை ஆசிரியர்": "Deputy Editor",
        "புகைப்படக் கலைஞர் & வடிவமைப்பாளர்": "Photojournalist & Designer",
        "விளையாட்டுப் பிரிவு செய்தியாளர்": "Sports Correspondent"
      };
      const enDescriptions = {
        "முனைவர். அ. இளங்கோவன்": "With over 20 years of experience in Tamil literature and a deep engagement with North Chennai historical research.",
        "க. செல்வி": "A field researcher with 10 years of experience covering the social issues of marginalized communities and women's livelihoods.",
        "இரா. சரவணன்": "Has documented the lives of North Chennai's working people and their traditional art forms through his camera.",
        "சு. கபிலன்": "Compiles news and interviews about North Chennai's football, boxing, and carrom players."
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
    <div className="py-12">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        {/* Breadcrumb */}
        <Breadcrumb items={[{ name: t.breadcrumb, path: "/editorial" }]} />

        {/* Section Heading */}
        <SectionHeading
          title={t.title}
          subtitle={t.subtitle}
        />

        {/* Intro Text */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT_ONCE}
          variants={staggerItem({ y: 18, duration: 0.5 })}
          className="max-w-3xl mb-12"
        >
          <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed font-light">
            {t.description}
          </p>
        </motion.div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {localizedTeam.map((member, i) => (
            <TeamCard key={member.id} member={member} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
