"use client";
import { motion } from "framer-motion";
import { Award, Compass, Eye, BookOpen } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/common/SectionHeading";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutClient({ data }) {
  const { mission, vision, story, timeline } = data;
  const { lang } = useLanguage();

  const t = {
    ta: {
      breadcrumb: "எங்களைப் பற்றி",
      heading: "எங்களைப் பற்றி",
      subheading: "எங்களது கதை",
      intro: "வடசென்னையின் கலை, பண்பாடு மற்றும் உழைப்பை ஆவணப்படுத்தும் புதிய அத்தியாயம்.",
      story: story,
      quote: "“ஊடகங்களின் தவறான கண்ணோட்டங்களை மாற்றி, வடசென்னையின் உண்மையான பெருமையை உலகிற்கு அறிவிப்பதே எங்களது லட்சியம்.”",
      missionTitle: "எமது நோக்கம்",
      missionDesc: mission,
      visionTitle: "எமது பார்வை",
      visionDesc: vision,
      milestones: "வளர்ச்சிப் பாதை",
      milestonesSub: "எங்களது மைல்கற்கள்",
      timeline: timeline
    },
    en: {
      breadcrumb: "About Us",
      heading: "About Us",
      subheading: "OUR STORY",
      intro: "A new chapter documenting the art, culture, and labor of North Chennai.",
      story: "Vadachennai Kural is a digital magazine amplifying the art, literature, lifestyle, and social issues of North Chennai. Started to dismantle media stereotypes, we celebrate the talents and achievements of local working-class heroes while archiving our rich historic legacy and cultural heritage.",
      quote: "\"Our mission is to shift media stereotypes and project the true dignity and pride of North Chennai to the world.\"",
      missionTitle: "Our Mission",
      missionDesc: "To project the true life, culture, and arts of North Chennai to the world and serve as their authentic voice.",
      visionTitle: "Our Vision",
      visionDesc: "To build a positive narrative of North Chennai through digital media and support the upliftment of marginalized communities.",
      milestones: "Our Milestones",
      milestonesSub: "OUR ROADMAP",
      timeline: [
        {
          year: "2025",
          title: "The Conception",
          description: "Recognizing the need for an alternative media platform to document North Chennai's arts, sports, and lifestyle, the planning phase commenced."
        },
        {
          year: "2026",
          title: "First Digital Issue",
          description: "With contributions from various writers and local artists, 'Vadachennai Kural' published its inaugural monthly digital magazine."
        },
        {
          year: "2026",
          title: "Web Platform Launch",
          description: "This premium web platform was launched, enabling readers to seamlessly browse, read, and download issues online."
        },
        {
          year: "2027",
          title: "Future Roadmap",
          description: "Expanding Vadachennai Kural into a dedicated multimedia hub featuring local podcasts, short films, and art archives."
        }
      ]
    }
  }[lang];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-12">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ name: t.breadcrumb, path: "/about" }]} />

      <SectionHeading title={t.heading} subtitle={t.subheading} />

      {/* Grid: Mission, Vision, Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        {/* Story details (LHS) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal leading-tight">
            {t.intro}
          </h3>
          <p className="font-sans text-sm sm:text-base text-charcoal/70 leading-relaxed font-light">
            {t.story}
          </p>
          <div className="border-l-4 border-primary pl-4 py-1 italic text-charcoal/80 font-serif text-sm">
            {t.quote}
          </div>
        </div>

        {/* Mission / Vision Cards (RHS) */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white p-8 rounded-xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
          >
            <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif text-base font-bold text-charcoal">
                {t.missionTitle}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
                {t.missionDesc}
              </p>
            </div>
          </motion.div>

          <motion.div
            custom={1}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-white p-8 rounded-xl border border-border-subtle shadow-sm hover:shadow-md transition-shadow flex items-start gap-4"
          >
            <div className="p-3 bg-secondary/10 rounded-lg text-secondary shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h4 className="font-serif text-base font-bold text-charcoal">
                {t.visionTitle}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
                {t.visionDesc}
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="border-t border-border-subtle pt-20">
        <SectionHeading title={t.milestones} subtitle={t.milestonesSub} centered />

        <div className="relative border-l border-primary/30 max-w-3xl mx-auto pl-6 sm:pl-10 space-y-12">
          {t.timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Timeline dot */}
              <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white border-2 border-primary">
                <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              </span>

              <div className="bg-white rounded-xl border border-border-subtle p-6 shadow-sm hover:shadow-md transition-shadow space-y-2">
                <span className="font-serif text-sm font-bold text-secondary tracking-widest block">
                  {item.year}
                </span>
                <h4 className="font-serif text-lg font-bold text-charcoal">
                  {item.title}
                </h4>
                <p className="font-sans text-xs sm:text-sm text-charcoal/65 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
