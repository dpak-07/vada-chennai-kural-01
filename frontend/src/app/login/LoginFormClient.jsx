"use client";
import { useState } from "react";
import Link from "next/link";
import { Shield, Eye, EyeOff, Lock, User, AlertCircle, ArrowLeft } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginFormClient() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { lang } = useLanguage();

  const t = {
    ta: {
      errorFields: "பயனர் பெயர் மற்றும் கடவுச்சொல்லை உள்ளிடவும்",
      backHome: "முகப்பு பக்கத்திற்குச் செல்ல",
      heading: "நிர்வாகி உள்நுழைவு",
      portal: "ADMINISTRATION PORTAL",
      successTitle: "உள்நுழைவு வெற்றிகரமாக முடிந்தது!",
      successText: "நிர்வாகப் பகுதிக்குச் செல்ல பின்வரும் பொத்தானை அழுத்தவும்.",
      goAdmin: "நிர்வாகப் பகுதிக்குச் செல்ல",
      logout: "மீண்டும் உள்நுழைய",
      username: "பயனர் பெயர்",
      usernamePlaceholder: "உள்நுழையும் பெயர்",
      password: "கடவுச்சொல்",
      rememberMe: "என்னை நினைவில் கொள்க",
      forgot: "கடவுச்சொல் மறந்ததா?",
      forgotAlert: "கடவுச்சொல் மீட்பு அஞ்சல் அனுப்பப்பட்டது.",
      checking: "சரிபார்க்கப்படுகிறது...",
      signIn: "உள்நுழைக"
    },
    en: {
      errorFields: "Please enter both username and password",
      backHome: "Back to Home",
      heading: "Admin Login",
      portal: "ADMINISTRATION PORTAL",
      successTitle: "Login Successful!",
      successText: "Press the button below to go to the admin area.",
      goAdmin: "Go to Admin Panel",
      logout: "Logout",
      username: "Username",
      usernamePlaceholder: "Enter username",
      password: "Password",
      rememberMe: "Remember Me",
      forgot: "Forgot Password?",
      forgotAlert: "Password reset email has been sent.",
      checking: "Checking...",
      signIn: "Sign In"
    }
  }[lang];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!formData.username.trim() || !formData.password.trim()) {
      setError(t.errorFields);
      return;
    }

    setLoading(true);
    // Simulate premium login validation
    setTimeout(() => {
      setLoading(false);
      // Let's mock a success if they type anything
      setSuccess(true);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas relative overflow-hidden px-4">
      {/* Abstract Design Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Back Link */}
        <div className="text-left">
          <Link href="/" className="inline-flex items-center text-xs font-semibold text-charcoal/50 hover:text-primary transition gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> {t.backHome}
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-border-subtle p-8 space-y-8">
          {/* Brand Logo & Header */}
          <div className="text-center space-y-2">
            <img
              src="/logo/vadachennai%20kural%20logo.jpg"
              alt="Vadachennai Kural Logo"
              className="w-12 h-12 rounded-full object-cover shadow-md mx-auto"
            />
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-bold text-charcoal tracking-tight">
                {t.heading}
              </h2>
              <p className="font-sans text-[10px] tracking-widest text-secondary font-bold uppercase">
                {t.portal}
              </p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-6 space-y-4">
              <Shield className="w-16 h-16 text-emerald-500 mx-auto animate-pulse" />
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-charcoal">{t.successTitle}</h3>
                <p className="text-xs text-charcoal/60 max-w-xs mx-auto leading-relaxed">
                  {t.successText}
                </p>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Button href="/admin" variant="primary" size="sm" className="w-full text-center cursor-pointer">
                  {t.goAdmin}
                </Button>
                <button onClick={() => setSuccess(false)} className="text-xs text-charcoal/50 hover:underline py-1 cursor-pointer">
                  {t.logout}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label htmlFor="username" className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider block">
                  {t.username}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-canvas border border-border-subtle hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg text-sm transition font-sans"
                    placeholder={t.usernamePlaceholder}
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider block">
                  {t.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-canvas border border-border-subtle hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg text-sm transition font-sans"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-black/5 rounded text-charcoal/40 hover:text-charcoal transition cursor-pointer"
                    aria-label={showPassword ? (lang === "ta" ? "கடவுச்சொல்லை மறை" : "Hide password") : (lang === "ta" ? "கடவுச்சொல்லை காட்டு" : "Show password")}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 text-charcoal/70 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="rounded border-border-subtle focus:ring-primary text-primary h-4 w-4"
                  />
                  <span>{t.rememberMe}</span>
                </label>
                <a href="#" className="text-primary hover:underline font-semibold" onClick={(e) => { e.preventDefault(); alert(t.forgotAlert); }}>
                  {t.forgot}
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3.5 font-bold justify-center cursor-pointer"
                disabled={loading}
              >
                {loading ? t.checking : t.signIn}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
