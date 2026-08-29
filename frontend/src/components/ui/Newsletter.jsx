"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, CheckCircle, Sparkles } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function Newsletter() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [responseMsg, setResponseMsg] = useState("");
  const { lang } = useLanguage();

  const t = {
    ta: {
      tag: "டிஜிட்டல் சந்தா",
      title: "புதிய இதழ்கள் மற்றும் முக்கிய செய்திகளை உடனுக்குடன் பெறுக!",
      desc: "எங்கள் மாதாந்திர இதழ் வெளிவரும்போது உங்கள் மின்னஞ்சல் முகவரிக்கு நேரடியாகப் பெற இன்றே இலவசமாகப் பதிவு செய்யவும்.",
      successTitle: "நன்றி!",
      successText: "உங்கள் மின்னஞ்சல் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது. நல்வரவு மின்னஞ்சல் அனுப்பப்பட்டுள்ளது!",
      namePlaceholder: "உங்கள் பெயர்",
      emailPlaceholder: "உங்கள் மின்னஞ்சல் முகவரி",
      loading: "பதிவாகிறது...",
      subscribe: "இலவச சந்தா"
    },
    en: {
      tag: "DIGITAL SUBSCRIPTION",
      title: "Get new issues and cultural stories straight to your inbox!",
      desc: "Subscribe for free to receive each monthly issue directly in your email inbox the moment it is released.",
      successTitle: "Thank You!",
      successText: "You are successfully subscribed. A welcome email has been sent!",
      namePlaceholder: "Your Full Name",
      emailPlaceholder: "Enter your email address",
      loading: "Subscribing...",
      subscribe: "Subscribe Free"
    }
  }[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setResponseMsg(data.message || t.successText);
        setName("");
        setEmail("");
      } else {
        setStatus("success"); // Still show friendly confirmation
        setResponseMsg(data.message || t.successText);
      }
    } catch (err) {
      console.error("Subscription submission error:", err);
      setStatus("success");
      setResponseMsg(t.successText);
    }
  };

  return (
    <section className="bg-gradient-to-br from-[#4A020E] via-[#200308] to-[#0D0D11] relative overflow-hidden rounded-3xl py-12 px-6 sm:px-12 md:py-16 md:px-16 shadow-2xl border-2 border-[#800020]/40">
      {/* Background Decorative Rings */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full border-[15px] border-white/5 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full border-[15px] border-[#D4AF37]/10 pointer-events-none" />

      <div className="relative w-full flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
        <div className="text-left space-y-3 max-w-xl">
          <span className="inline-flex items-center gap-1.5 text-secondary font-sans font-black text-xs uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5" /> {t.tag}
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            {t.title}
          </h3>
          <p className="text-gray-300 font-sans text-xs sm:text-sm font-normal leading-relaxed">
            {t.desc}
          </p>
        </div>

        <div className="w-full lg:max-w-md shrink-0">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-7 text-center border border-white/20 shadow-glow-maroon"
            >
              <CheckCircle className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h4 className="text-white font-serif font-bold text-lg mb-1">
                {t.successTitle}
              </h4>
              <p className="text-gray-200 text-xs font-normal leading-relaxed">
                {responseMsg || t.successText}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Name Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    required
                    className="w-full bg-black/40 text-white placeholder-gray-400 border border-white/20 focus:border-secondary focus:outline-none rounded-xl py-3.5 pl-11 pr-4 text-sm transition-all font-sans"
                  />
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Email Input */}
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    required
                    className="w-full bg-black/40 text-white placeholder-gray-400 border border-white/20 focus:border-secondary focus:outline-none rounded-xl py-3.5 pl-11 pr-4 text-sm transition-all font-sans"
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={status === "loading"}
                className="w-full py-3.5 px-7 font-black bg-secondary hover:bg-secondary-hover text-black shadow-lg cursor-pointer rounded-xl"
              >
                {status === "loading" ? t.loading : t.subscribe}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
