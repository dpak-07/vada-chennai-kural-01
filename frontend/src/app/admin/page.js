"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, BookOpen, Users, LogOut, Plus, Trash2, Edit2, 
  Download, Search, CheckCircle, X, ShieldCheck, Languages, MapPin, 
  Phone, Mail, Globe, Sparkles, HelpCircle, Save, Info, Users2, Calendar
} from "lucide-react";
import Button from "@/components/common/Button";

// Initial imports
import issuesData from "@/data/issues.json";
import { issueTranslations } from "@/data/translations";
import aboutData from "@/data/about.json";
import teamData from "@/data/team.json";
import contactData from "@/data/contact.json";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [lang, setLang] = useState("ta");
  const [notification, setNotification] = useState("");

  // Content states
  const [issues, setIssues] = useState(issuesData);
  const [translations, setTranslations] = useState(issueTranslations);
  const [about, setAbout] = useState(aboutData);
  const [team, setTeam] = useState(teamData);
  const [contact, setContact] = useState(contactData);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [editIssueId, setEditIssueId] = useState(null);

  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editTeamId, setEditTeamId] = useState(null);

  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [editTimelineIdx, setEditTimelineIdx] = useState(null);

  // Debounced translation trigger indicator
  const [isTranslating, setIsTranslating] = useState(false);

  // Forms states
  const [issueForm, setIssueForm] = useState({
    titleEn: "",
    titleTa: "",
    monthEn: "",
    monthTa: "",
    pages: 48,
    descriptionEn: "",
    descriptionTa: "",
    coverImage: "/coming_soon_cover.jpg",
    pdfUrl: "",
    featuresEn: "",
    featuresTa: "",
    comingSoon: true
  });

  const [teamForm, setTeamForm] = useState({
    name: "",
    role: "",
    description: "",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
  });

  const [timelineForm, setTimelineForm] = useState({
    year: "",
    title: "",
    description: ""
  });

  // Global save trigger
  const saveContent = async (type, payload) => {
    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data: payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save data");
      showNotification(lang === "ta" ? "மாற்றங்கள் சேமிக்கப்பட்டன!" : "Changes saved successfully!");
      return true;
    } catch (err) {
      console.error(err);
      alert("Error saving: " + err.message);
      return false;
    }
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  // Translate helper (API fallback)
  const autoTranslateText = async (text, setter, fallbackText = "") => {
    if (!text.trim()) {
      setter("");
      return;
    }
    setIsTranslating(true);
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        setter(data[0][0][0]);
      } else {
        setter(fallbackText || text);
      }
    } catch (err) {
      setter(fallbackText || text);
    } finally {
      setIsTranslating(false);
    }
  };

  // Issue title translation trigger
  useEffect(() => {
    if (activeTab === "issues" && isIssueModalOpen && !editIssueId) {
      const timer = setTimeout(() => {
        autoTranslateText(issueForm.titleEn, (val) => setIssueForm(prev => ({ ...prev, titleTa: val })));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [issueForm.titleEn]);

  // Handle Input Changes
  const handleIssueInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIssueForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // ISSUE CRUD
  const openCreateIssue = () => {
    setEditIssueId(null);
    setIssueForm({
      titleEn: "",
      titleTa: "",
      monthEn: "",
      monthTa: "",
      pages: 0,
      descriptionEn: "",
      descriptionTa: "",
      coverImage: "/coming_soon_cover.jpg",
      pdfUrl: "",
      featuresEn: "",
      featuresTa: "",
      comingSoon: true
    });
    setIsIssueModalOpen(true);
  };

  const openEditIssue = (issue) => {
    setEditIssueId(issue.id);
    const trans = translations[issue.id] || {};
    setIssueForm({
      titleEn: issue.titleEn || trans.title || issue.title,
      titleTa: issue.title,
      monthEn: issue.monthEn || trans.month || issue.month,
      monthTa: issue.month,
      pages: issue.pages || 0,
      descriptionEn: issue.descriptionEn || trans.description || "",
      descriptionTa: issue.description || "",
      coverImage: issue.coverImage,
      pdfUrl: issue.pdfUrl || "",
      featuresEn: issue.featuresEn ? issue.featuresEn.join(", ") : (trans.features ? trans.features.join(", ") : ""),
      featuresTa: issue.features ? issue.features.join(", ") : "",
      comingSoon: issue.comingSoon || false
    });
    setIsIssueModalOpen(true);
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    const featEn = issueForm.featuresEn ? issueForm.featuresEn.split(",").map(f => f.trim()) : [];
    const featTa = issueForm.featuresTa ? issueForm.featuresTa.split(",").map(f => f.trim()) : [];

    let updatedIssues;
    let updatedTranslations = { ...translations };

    if (editIssueId) {
      updatedIssues = issues.map(i => i.id === editIssueId ? {
        ...i,
        title: issueForm.titleTa,
        titleEn: issueForm.titleEn,
        month: issueForm.monthTa,
        monthEn: issueForm.monthEn,
        pages: parseInt(issueForm.pages),
        description: issueForm.descriptionTa,
        descriptionEn: issueForm.descriptionEn,
        coverImage: issueForm.coverImage,
        pdfUrl: issueForm.pdfUrl,
        features: featTa,
        featuresEn: featEn,
        comingSoon: issueForm.comingSoon
      } : i);

      updatedTranslations[editIssueId] = {
        title: issueForm.titleEn,
        month: issueForm.monthEn,
        description: issueForm.descriptionEn,
        features: featEn
      };
    } else {
      const newId = `v1-i${issues.length + 1}`;
      const newIssue = {
        id: newId,
        title: issueForm.titleTa,
        titleEn: issueForm.titleEn,
        month: issueForm.monthTa,
        monthEn: issueForm.monthEn,
        date: new Date().toISOString().split("T")[0],
        coverImage: issueForm.coverImage,
        description: issueForm.descriptionTa,
        descriptionEn: issueForm.descriptionEn,
        pdfUrl: issueForm.pdfUrl,
        isLatest: issues.length === 0,
        pages: parseInt(issueForm.pages),
        features: featTa,
        featuresEn: featEn,
        comingSoon: issueForm.comingSoon
      };

      updatedIssues = [newIssue, ...issues];
      updatedTranslations[newId] = {
        title: issueForm.titleEn,
        month: issueForm.monthEn,
        description: issueForm.descriptionEn,
        features: featEn
      };
    }

    const success = await saveContent("issues", updatedIssues);
    if (success) {
      await saveContent("translations", updatedTranslations);
      setIssues(updatedIssues);
      setTranslations(updatedTranslations);
      setIsIssueModalOpen(false);
    }
  };

  const handleDeleteIssue = async (id) => {
    if (confirm(lang === "ta" ? "இதனை நீக்க வேண்டுமா?" : "Delete this issue?")) {
      const updated = issues.filter(i => i.id !== id);
      const success = await saveContent("issues", updated);
      if (success) setIssues(updated);
    }
  };

  // TEAM CRUD
  const openCreateTeam = () => {
    setEditTeamId(null);
    setTeamForm({
      name: "",
      role: "",
      description: "",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    });
    setIsTeamModalOpen(true);
  };

  const openEditTeam = (member) => {
    setEditTeamId(member.id);
    setTeamForm({
      name: member.name,
      role: member.role,
      description: member.description,
      photo: member.photo
    });
    setIsTeamModalOpen(true);
  };

  const handleTeamSubmit = async (e) => {
    e.preventDefault();
    let updated;
    if (editTeamId) {
      updated = team.map(m => m.id === editTeamId ? { ...m, ...teamForm } : m);
    } else {
      updated = [...team, { id: String(Date.now()), ...teamForm }];
    }
    const success = await saveContent("team", updated);
    if (success) {
      setTeam(updated);
      setIsTeamModalOpen(false);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (confirm(lang === "ta" ? "ஆசிரியரை நீக்க வேண்டுமா?" : "Delete this team member?")) {
      const updated = team.filter(m => m.id !== id);
      const success = await saveContent("team", updated);
      if (success) setTeam(updated);
    }
  };

  // TIMELINE CRUD
  const openCreateTimeline = () => {
    setEditTimelineIdx(null);
    setTimelineForm({ year: "", title: "", description: "" });
    setIsTimelineModalOpen(true);
  };

  const openEditTimeline = (item, idx) => {
    setEditTimelineIdx(idx);
    setTimelineForm({
      year: item.year,
      title: item.title,
      description: item.description
    });
    setIsTimelineModalOpen(true);
  };

  const handleTimelineSubmit = async (e) => {
    e.preventDefault();
    let updatedList = [...about.timeline];
    if (editTimelineIdx !== null) {
      updatedList[editTimelineIdx] = timelineForm;
    } else {
      updatedList.push(timelineForm);
    }

    const updatedAbout = { ...about, timeline: updatedList };
    const success = await saveContent("about", updatedAbout);
    if (success) {
      setAbout(updatedAbout);
      setIsTimelineModalOpen(false);
    }
  };

  const handleDeleteTimeline = async (idx) => {
    if (confirm(lang === "ta" ? "மைல்கல்லை நீக்க வேண்டுமா?" : "Delete this timeline event?")) {
      const updatedList = about.timeline.filter((_, i) => i !== idx);
      const updatedAbout = { ...about, timeline: updatedList };
      const success = await saveContent("about", updatedAbout);
      if (success) setAbout(updatedAbout);
    }
  };

  // ABOUT SAVE
  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    await saveContent("about", about);
  };

  // CONTACT SAVE
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    await saveContent("contact", contact);
  };

  // Local Dictionary
  const t = {
    ta: {
      portal: "நிர்வாகக் கட்டுப்பாட்டு பலகை",
      dashboard: "முகப்பு சுருக்கம்",
      issues: "இதழ்கள் மேலாண்மை",
      about: "பக்க விபரங்கள்",
      team: "ஆசிரியர்க்குழு",
      contact: "தொடர்பு விபரங்கள்",
      subscribers: "சந்தாதாரர்கள்",
      logout: "வெளியேற",
      secure: "பாதுகாப்பானது",
      totalIssues: "மொத்த இதழ்கள்",
      activeReaders: "வாசகர்கள்",
      saveChanges: "மாற்றங்களைச் சேமி",
      add: "புதியது சேர்",
      edit: "திருத்து",
      delete: "நீக்கு",
      cancel: "ரத்து செய்",
      email: "மின்னஞ்சல் முகவரி",
      status: "நிலை",
      timeline: "காலவரிசை மைல்கற்கள்",
      officeAddress: "அலுவலக முகவரி (தமிழ்)",
      officeAddressEn: "அலுவலக முகவரி (ஆங்கிலம்)",
      phone: "தொலைபேசி",
      socialLinks: "சமூக வலைத்தள இணைப்புகள்",
      mission: "எமது நோக்கம் (தமிழ்)",
      vision: "எமது பார்வை (தமிழ்)",
      story: "எமது வரலாறு (தமிழ்)"
    },
    en: {
      portal: "Admin Control Dashboard",
      dashboard: "Dashboard Overview",
      issues: "Manage Issues",
      about: "About Page Content",
      team: "Editorial Board Team",
      contact: "Contact & Socials",
      subscribers: "Subscribers",
      logout: "Logout",
      secure: "Secure",
      totalIssues: "Total Issues",
      activeReaders: "Active Readers",
      saveChanges: "Save Changes",
      add: "Add New",
      edit: "Edit",
      delete: "Delete",
      cancel: "Cancel",
      email: "Subscriber Email",
      status: "Status",
      timeline: "Timeline Milestones",
      officeAddress: "Office Address (Tamil)",
      officeAddressEn: "Office Address (English)",
      phone: "Phone Number",
      socialLinks: "Social Links",
      mission: "Our Mission (Tamil)",
      vision: "Our Vision (Tamil)",
      story: "Our Story (Tamil)"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row text-charcoal">
      
      {/* 1. SIDEBAR */}
      <aside className="w-full md:w-64 bg-charcoal text-white flex flex-col md:justify-between shrink-0">
        <div>
          <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/logo/vadachennai%20kural%20logo.jpg"
                alt="Logo"
                className="w-8 h-8 rounded-full object-cover shadow-sm"
              />
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold text-white tracking-wide">
                  {lang === "ta" ? "நிர்வாகக் குழு" : "Admin Panel"}
                </span>
                <span className="text-[8px] text-secondary font-bold uppercase tracking-wider">
                  Vadachennai Kural
                </span>
              </div>
            </div>
          </div>

          <nav className="p-2 md:p-4 flex md:flex-col overflow-x-auto md:overflow-visible gap-1 w-full border-b border-white/10 md:border-b-0">
            {[
              { id: "dashboard", label: t.dashboard, icon: LayoutDashboard },
              { id: "issues", label: t.issues, icon: BookOpen },
              { id: "about", label: t.about, icon: Info },
              { id: "team", label: t.team, icon: Users2 },
              { id: "contact", label: t.contact, icon: Globe },
              { id: "subscribers", label: t.subscribers, icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id ? "bg-primary text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" /> <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 hidden md:block">
          <Link href="/" className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition">
            <LogOut className="w-4 h-4" /> {t.logout}
          </Link>
        </div>
      </aside>

      {/* 2. MAIN */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-border-subtle py-4 px-6 flex items-center justify-between shadow-sm">
          <h2 className="font-serif text-sm sm:text-base font-bold text-charcoal">{t.portal}</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setLang(prev => prev === "ta" ? "en" : "ta")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle hover:border-primary text-xs font-semibold hover:bg-canvas transition cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-primary" /> {lang === "ta" ? "English" : "தமிழ்"}
            </button>
            <span className="hidden sm:flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> {t.secure}
            </span>
          </div>
        </header>

        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-white px-5 py-3 rounded-lg text-xs font-bold flex items-center gap-2 shadow-2xl">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> {notification}
          </div>
        )}

        <div className="p-4 sm:p-8 space-y-8 max-w-5xl">
          
          {/* TAB: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider block">{t.totalIssues}</span>
                    <h3 className="text-2xl font-serif font-black mt-1">{issues.length}</h3>
                  </div>
                  <BookOpen className="w-8 h-8 text-primary opacity-80" />
                </div>
                <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider block">{t.activeReaders}</span>
                    <h3 className="text-2xl font-serif font-black mt-1">2,840</h3>
                  </div>
                  <Users className="w-8 h-8 text-secondary opacity-80" />
                </div>
                <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-charcoal/40 font-bold uppercase tracking-wider block">{lang === "ta" ? "ஆசிரியர்கள் குழு" : "Board Editors"}</span>
                    <h3 className="text-2xl font-serif font-black mt-1">{team.length}</h3>
                  </div>
                  <Users2 className="w-8 h-8 text-primary opacity-80" />
                </div>
              </div>

              {/* Quick Info Box */}
              <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
                <h4 className="font-serif text-base font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" /> {lang === "ta" ? "தற்போதைய இதழ் நிலை" : "Current Magazine Status"}
                </h4>
                <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light mb-4">
                  {lang === "ta" 
                    ? "வடசென்னை குரல் இணைய இதழ் தற்பொழுது அறிமுக நிலையில் அமைக்கப்பட்டுள்ளது. முதல் இதழ் 'விரைவில்' வெளியாகும் என அறிவிக்கப்பட்டுள்ளது. புதிய இதழ்களை மேலாண்மை செய்ய அல்லது இதர பக்க விபரங்களை மாற்ற அடுத்தடுத்த பக்கங்களைப் பயன்படுத்தவும்."
                    : "Vadachennai Kural is currently configured in a pre-launch state with the first issue marked as 'Coming Soon'. Use the navigation tabs to configure issues, about pages, contact details, or view subscriber alerts."}
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setActiveTab("issues")} className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-dark transition cursor-pointer">
                    {lang === "ta" ? "இதழ்களை மேலாண்மை செய்" : "Manage Issues"}
                  </button>
                  <button onClick={() => setActiveTab("about")} className="bg-canvas text-charcoal text-xs font-bold px-4 py-2 border border-border-subtle rounded-lg hover:bg-gray-100 transition cursor-pointer">
                    {lang === "ta" ? "முகப்பு பக்கங்களை திருத்து" : "Edit Home Sections"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ISSUES */}
          {activeTab === "issues" && (
            <div className="space-y-6 bg-white p-6 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <h3 className="font-serif text-base font-bold">{t.issues}</h3>
                <button onClick={openCreateIssue} className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-4 h-4" /> {lang === "ta" ? "புதிய இதழ் சேர்" : "Add Issue"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border-subtle text-charcoal/50">
                      <th className="py-2.5 font-bold">Cover</th>
                      <th className="py-2.5 font-bold">Month</th>
                      <th className="py-2.5 font-bold">Title</th>
                      <th className="py-2.5 font-bold text-center">Status</th>
                      <th className="py-2.5 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => {
                      const trans = translations[issue.id] || {};
                      const title = lang === "en" ? (issue.titleEn || trans.title || issue.title) : issue.title;
                      const month = lang === "en" ? (issue.monthEn || trans.month || issue.month) : issue.month;
                      return (
                        <tr key={issue.id} className="border-b border-border-subtle hover:bg-canvas/50">
                          <td className="py-3">
                            <div className="w-9 h-12 relative overflow-hidden rounded border bg-gray-100 shrink-0 shadow-sm aspect-[3/4]">
                              <img src={issue.coverImage} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-3 font-bold text-primary">{month}</td>
                          <td className="py-3 font-medium">{title}</td>
                          <td className="py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${issue.comingSoon ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}>
                              {issue.comingSoon ? (lang === "ta" ? "விரைவில்" : "Coming Soon") : (lang === "ta" ? "வெளியானது" : "Published")}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-2">
                            <button onClick={() => openEditIssue(issue)} className="p-1 text-secondary hover:bg-canvas rounded inline-flex border border-border-subtle cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteIssue(issue.id)} className="p-1 text-red-500 hover:bg-canvas rounded inline-flex border border-border-subtle cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ABOUT PAGE CONTENT */}
          {activeTab === "about" && (
            <div className="space-y-6">
              <form onSubmit={handleAboutSubmit} className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <h3 className="font-serif text-base font-bold">{t.about}</h3>
                  <button type="submit" className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                    <Save className="w-4 h-4" /> {t.saveChanges}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{t.mission}</label>
                    <textarea
                      value={about.mission}
                      onChange={e => setAbout(prev => ({ ...prev, mission: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary resize-none bg-canvas"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{t.vision}</label>
                    <textarea
                      value={about.vision}
                      onChange={e => setAbout(prev => ({ ...prev, vision: e.target.value }))}
                      rows="3"
                      className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary resize-none bg-canvas"
                    />
                  </div>

                  <div className="flex flex-col space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{t.story}</label>
                    <textarea
                      value={about.story}
                      onChange={e => setAbout(prev => ({ ...prev, story: e.target.value }))}
                      rows="5"
                      className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary resize-none bg-canvas"
                    />
                  </div>
                </div>
              </form>

              {/* TIMELINE LIST */}
              <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                  <h3 className="font-serif text-base font-bold">{t.timeline}</h3>
                  <button onClick={openCreateTimeline} className="bg-secondary text-charcoal hover:bg-secondary-hover text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" /> {t.add}
                  </button>
                </div>

                <div className="space-y-4">
                  {about.timeline.map((item, idx) => (
                    <div key={idx} className="flex items-start justify-between border border-border-subtle p-4 rounded-xl hover:shadow-sm transition bg-canvas/30">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-sans font-bold text-xs bg-primary text-white px-2 py-0.5 rounded">{item.year}</span>
                          <h4 className="font-serif text-sm font-bold text-charcoal">{item.title}</h4>
                        </div>
                        <p className="text-xs text-charcoal/60 leading-relaxed font-light">{item.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => openEditTimeline(item, idx)} className="p-1 text-secondary hover:bg-canvas rounded border border-border-subtle cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDeleteTimeline(idx)} className="p-1 text-red-500 hover:bg-canvas rounded border border-border-subtle cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: TEAM */}
          {activeTab === "team" && (
            <div className="space-y-6 bg-white p-6 rounded-xl border border-border-subtle shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <h3 className="font-serif text-base font-bold">{t.team}</h3>
                <button onClick={openCreateTeam} className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Plus className="w-4 h-4" /> {t.add}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {team.map((member) => (
                  <div key={member.id} className="border border-border-subtle p-4 rounded-xl flex gap-4 bg-canvas/20 hover:shadow-sm transition">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border border-border-subtle">
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-serif text-sm font-bold text-charcoal">{member.name}</h4>
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider font-sans">{member.role}</span>
                        </div>
                        <div className="flex space-x-1.5">
                          <button onClick={() => openEditTeam(member)} className="p-1 text-secondary hover:bg-canvas rounded border border-border-subtle cursor-pointer"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => handleDeleteTeam(member.id)} className="p-1 text-red-500 hover:bg-canvas rounded border border-border-subtle cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                      <p className="text-xs text-charcoal/60 leading-relaxed font-light">{member.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CONTACT */}
          {activeTab === "contact" && (
            <form onSubmit={handleContactSubmit} className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                <h3 className="font-serif text-base font-bold">{t.contact}</h3>
                <button type="submit" className="bg-primary hover:bg-primary-dark text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                  <Save className="w-4 h-4" /> {t.saveChanges}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{t.officeAddress}</label>
                  <input
                    type="text"
                    value={contact.officeAddress}
                    onChange={e => setContact(prev => ({ ...prev, officeAddress: e.target.value }))}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary bg-canvas"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{t.officeAddressEn}</label>
                  <input
                    type="text"
                    value={contact.officeAddressEn}
                    onChange={e => setContact(prev => ({ ...prev, officeAddressEn: e.target.value }))}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary bg-canvas"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{t.phone}</label>
                  <input
                    type="text"
                    value={contact.phone}
                    onChange={e => setContact(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary bg-canvas"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{lang === "ta" ? "மின்னஞ்சல்" : "Email"}</label>
                  <input
                    type="text"
                    value={contact.email}
                    onChange={e => setContact(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary bg-canvas"
                  />
                </div>
                <div className="flex flex-col space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{lang === "ta" ? "கூகுள் மேப் ஐபிரேம் URL" : "Google Map Embed Iframe URL"}</label>
                  <input
                    type="text"
                    value={contact.mapEmbedUrl}
                    onChange={e => setContact(prev => ({ ...prev, mapEmbedUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary bg-canvas"
                  />
                </div>
              </div>

              <div className="border-t border-border-subtle pt-5 space-y-4">
                <h4 className="font-serif text-sm font-bold">{t.socialLinks}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.keys(contact.socialLinks || {}).map((platform) => (
                    <div key={platform} className="flex flex-col space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">{platform}</label>
                      <input
                        type="text"
                        value={contact.socialLinks[platform]}
                        onChange={e => setContact(prev => {
                          const updatedSocials = { ...prev.socialLinks, [platform]: e.target.value };
                          return { ...prev, socialLinks: updatedSocials };
                        })}
                        className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs font-sans focus:outline-none focus:border-primary bg-canvas"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </form>
          )}

          {/* TAB: SUBSCRIBERS */}
          {activeTab === "subscribers" && (
            <div className="bg-white p-6 rounded-xl border border-border-subtle shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold pb-2 border-b border-border-subtle">
                {t.subscribers}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="border-b border-border-subtle text-charcoal/50">
                      <th className="py-2.5 font-bold">{t.email}</th>
                      <th className="py-2.5 font-bold">Date Joined</th>
                      <th className="py-2.5 font-bold">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 font-medium">anbu@mail.com</td>
                      <td className="py-3 font-sans text-charcoal/50">2026-07-30</td>
                      <td className="py-3"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-semibold">Active</span></td>
                    </tr>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 font-medium">malar@example.com</td>
                      <td className="py-3 font-sans text-charcoal/50">2026-07-28</td>
                      <td className="py-3"><span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 text-[10px] font-semibold">Active</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ISSUE CREATION/EDITING MODAL */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-border-subtle flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <h3 className="font-serif text-base font-bold text-charcoal">
                {editIssueId ? (lang === "ta" ? "இதழ் திருத்துக" : "Edit Issue") : (lang === "ta" ? "புதிய இதழ்" : "New Issue")}
              </h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">Cover Preview</span>
                  <div className="relative aspect-[3/4] w-full max-w-[150px] rounded-lg overflow-hidden border border-border-subtle shadow bg-gray-50 flex items-center justify-center">
                    <img src={issueForm.coverImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Issue Title (En)</label>
                      <input
                        type="text"
                        name="titleEn"
                        value={issueForm.titleEn}
                        onChange={handleIssueInputChange}
                        className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">இதழ் தலைப்பு (Ta)</label>
                      <input
                        type="text"
                        name="titleTa"
                        value={issueForm.titleTa}
                        onChange={handleIssueInputChange}
                        className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary font-semibold text-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Month (En)</label>
                      <input
                        type="text"
                        name="monthEn"
                        value={issueForm.monthEn}
                        onChange={handleIssueInputChange}
                        placeholder="e.g. September 2026"
                        className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                    <div className="flex flex-col space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">மாதம் (Ta)</label>
                      <input
                        type="text"
                        name="monthTa"
                        value={issueForm.monthTa}
                        onChange={handleIssueInputChange}
                        placeholder="உதாரணம்: செப்டம்பர் 2026"
                        className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Pages</label>
                  <input
                    type="number"
                    name="pages"
                    value={issueForm.pages}
                    onChange={handleIssueInputChange}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Cover Image URL</label>
                  <input
                    type="text"
                    name="coverImage"
                    value={issueForm.coverImage}
                    onChange={handleIssueInputChange}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">PDF URL</label>
                  <input
                    type="text"
                    name="pdfUrl"
                    value={issueForm.pdfUrl}
                    onChange={handleIssueInputChange}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  id="comingSoon"
                  name="comingSoon"
                  checked={issueForm.comingSoon}
                  onChange={handleIssueInputChange}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-subtle rounded"
                />
                <label htmlFor="comingSoon" className="text-xs font-bold text-charcoal/80 cursor-pointer">
                  {lang === "ta" ? "அறிமுக நிலையில் உள்ளது (வெளியாகவில்லை)" : "Under Pre-launch status (Coming Soon)"}
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Description (En)</label>
                  <textarea
                    name="descriptionEn"
                    value={issueForm.descriptionEn}
                    onChange={handleIssueInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary resize-none bg-canvas"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">விபரம் (Ta)</label>
                  <textarea
                    name="descriptionTa"
                    value={issueForm.descriptionTa}
                    onChange={handleIssueInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary resize-none bg-canvas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Highlights (En - comma separated)</label>
                  <input
                    type="text"
                    name="featuresEn"
                    value={issueForm.featuresEn}
                    onChange={handleIssueInputChange}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">முக்கிய கட்டுரைகள் (Ta - காற்புள்ளி பிரிப்பு)</label>
                  <input
                    type="text"
                    name="featuresTa"
                    value={issueForm.featuresTa}
                    onChange={handleIssueInputChange}
                    className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button type="button" onClick={() => setIsIssueModalOpen(false)} className="px-4 py-2 border border-border-subtle rounded-lg text-xs font-bold hover:bg-gray-50">{t.cancel}</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-dark">{lang === "ta" ? "சேமி" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TEAM CREATION/EDITING MODAL */}
      {isTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-border-subtle flex flex-col">
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <h3 className="font-serif text-base font-bold text-charcoal">
                {editTeamId ? (lang === "ta" ? "ஆசிரியர் திருத்தம்" : "Edit Board Member") : (lang === "ta" ? "புதிய ஆசிரியர்" : "Add Board Member")}
              </h3>
              <button onClick={() => setIsTeamModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleTeamSubmit} className="p-5 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Name</label>
                <input
                  type="text"
                  value={teamForm.name}
                  onChange={e => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Role</label>
                <input
                  type="text"
                  value={teamForm.role}
                  onChange={e => setTeamForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Description</label>
                <textarea
                  value={teamForm.description}
                  onChange={e => setTeamForm(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary resize-none bg-canvas"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Photo URL</label>
                <input
                  type="text"
                  value={teamForm.photo}
                  onChange={e => setTeamForm(prev => ({ ...prev, photo: e.target.value }))}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button type="button" onClick={() => setIsTeamModalOpen(false)} className="px-4 py-2 border border-border-subtle rounded-lg text-xs font-bold hover:bg-gray-50">{t.cancel}</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-dark">{lang === "ta" ? "சேமி" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TIMELINE CREATION/EDITING MODAL */}
      {isTimelineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-border-subtle flex flex-col">
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <h3 className="font-serif text-base font-bold text-charcoal">
                {editTimelineIdx !== null ? (lang === "ta" ? "மைல்கல் திருத்தம்" : "Edit Milestone") : (lang === "ta" ? "புதிய மைல்கல்" : "Add Milestone")}
              </h3>
              <button onClick={() => setIsTimelineModalOpen(false)} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleTimelineSubmit} className="p-5 space-y-4">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Year</label>
                <input
                  type="text"
                  value={timelineForm.year}
                  onChange={e => setTimelineForm(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="e.g. 2026"
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Milestone Title</label>
                <input
                  type="text"
                  value={timelineForm.title}
                  onChange={e => setTimelineForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal/70">Description</label>
                <textarea
                  value={timelineForm.description}
                  onChange={e => setTimelineForm(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  className="w-full px-3 py-2 border border-border-subtle rounded-lg text-xs focus:outline-none focus:border-primary resize-none bg-canvas"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button type="button" onClick={() => setIsTimelineModalOpen(false)} className="px-4 py-2 border border-border-subtle rounded-lg text-xs font-bold hover:bg-gray-50">{t.cancel}</button>
                <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-dark">{lang === "ta" ? "சேமி" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
