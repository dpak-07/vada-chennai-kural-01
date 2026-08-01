"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle } from "lucide-react";
import Button from "../common/Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  return (
    <section className="bg-primary relative overflow-hidden rounded-2xl py-12 px-6 sm:px-12 md:py-16 md:px-16 shadow-xl border border-white/10">
      {/* Background Decorative Gold Ring */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full border-[20px] border-secondary/10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full border-[20px] border-white/5 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 z-10">
        <div className="text-left space-y-3 max-w-xl">
          <span className="text-secondary font-sans font-bold text-xs uppercase tracking-wider">
            செய்திமடல் (Newsletter)
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-tight">
            புதிய இதழ்கள் மற்றும் செய்திகளை உடனுக்குடன் பெறுக!
          </h3>
          <p className="text-white/80 font-sans text-xs sm:text-sm font-light leading-relaxed">
            எங்கள் இதழ் வெளிவரும்போது உங்கள் மின்னஞ்சல் முகவரிக்கு நேரடியாகப் பெற இன்றே பதிவு செய்யவும்.
          </p>
        </div>

        <div className="w-full md:max-w-md shrink-0">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center border border-white/20"
            >
              <CheckCircle className="w-10 h-10 text-secondary mx-auto mb-3" />
              <h4 className="text-white font-serif font-bold text-lg mb-1">
                நன்றி! (Subscription Confirmed!)
              </h4>
              <p className="text-white/80 text-xs font-light">
                உங்கள் மின்னஞ்சல் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="உங்கள் மின்னஞ்சல் முகவரி (Your Email)"
                  required
                  className="w-full bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-secondary focus:outline-none rounded-lg py-3.5 pl-11 pr-4 text-sm transition-all font-sans"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={status === "loading"}
                className="py-3.5 px-6 font-bold cursor-pointer"
              >
                {status === "loading" ? "பதிவாகிறது..." : "பதிவு செய்க (Subscribe)"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
