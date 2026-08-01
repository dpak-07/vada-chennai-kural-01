"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, BookOpen, Users, LogOut, Plus, Trash2, Edit2, 
  Download, Search, CheckCircle, X, ShieldCheck, Languages
} from "lucide-react";
import Button from "@/components/common/Button";
import issuesData from "@/data/issues.json";
import { issueTranslations } from "@/data/translations";

// Local translation fallbacks
const translateMonth = (engMonth) => {
  const monthMap = {
    january: "ஜனவரி",
    february: "பிப்ரவரி",
    march: "மார்ச்",
    april: "ஏப்ரல்",
    may: "மே",
    june: "ஜூன்",
    july: "ஜூலை",
    august: "ஆகஸ்ட்",
    september: "செப்டம்பர்",
    october: "அக்டோபர்",
    november: "நவம்பர்",
    december: "டிசம்பர்"
  };
  
  const clean = engMonth.toLowerCase().trim();
  const match = clean.match(/([a-z]+)\s*(\d{4})/);
  if (match) {
    const m = monthMap[match[1]] || match[1];
    const y = match[2];
    return `${m} ${y}`;
  }
  return monthMap[clean] || engMonth;
};

const translateWord = (word) => {
  const dictionary = {
    gana: "கானா",
    music: "இசை",
    heritage: "மரபு",
    history: "வரலாறு",
    boxing: "குத்துச்சண்டை",
    boxer: "குத்துச்சண்டை வீரர்",
    port: "துறைமுகம்",
    harbor: "துறைமுகம்",
    street: "தெரு",
    streets: "தெருக்கள்",
    fishermen: "மீனவர்கள்",
    weavers: "நெசவாளர்கள்",
    north: "வட",
    chennai: "சென்னை",
    voice: "குரல்",
    issue: "இதழ்",
    intro: "அறிமுகம்",
    traditional: "பாரம்பரிய",
    arts: "கலைகள்",
    football: "கால்பந்து",
    stadium: "மைதானம்",
    play: "விளையாட்டு",
    story: "கதை",
    stories: "கதைகள்",
    life: "வாழ்வியல்",
    culture: "பண்பாடு"
  };

  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  return dictionary[clean] || word;
};

const translateText = (text) => {
  if (!text) return "";
  const words = text.split(/\s+/);
  const translated = words.map(translateWord);
  return translated.join(" ");
};

export default function AdminDashboard() {
  const [issues, setIssues] = useState(issuesData);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIssueId, setEditIssueId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState("ta");
  
  // Form State
  const [formData, setFormData] = useState({
    titleEn: "",
    titleTa: "",
    monthEn: "",
    monthTa: "",
    pages: 48,
    descriptionEn: "",
    descriptionTa: "",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=800&fit=crop",
    pdfUrl: "/pdf/dummy_issue.pdf",
    featuresEn: "",
    featuresTa: ""
  });

  const [notification, setNotification] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  // Debounced API translation for Title
  useEffect(() => {
    if (!formData.titleEn.trim()) {
      setFormData(prev => ({ ...prev, titleTa: "" }));
      return;
    }

    setIsTranslating(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(
            formData.titleEn
          )}`
        );
        const data = await response.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          setFormData((prev) => ({
            ...prev,
            titleTa: data[0][0][0],
          }));
        }
      } catch (err) {
        setFormData((prev) => ({
          ...prev,
          titleTa: translateText(prev.titleEn),
        }));
      } finally {
        setIsTranslating(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.titleEn]);

  // Debounced API translation for Month
  useEffect(() => {
    if (!formData.monthEn.trim()) {
      setFormData(prev => ({ ...prev, monthTa: "" }));
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q=${encodeURIComponent(
            formData.monthEn
          )}`
        );
        const data = await response.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          setFormData((prev) => ({
            ...prev,
            monthTa: data[0][0][0],
          }));
        }
      } catch (err) {
        setFormData((prev) => ({
          ...prev,
          monthTa: translateMonth(prev.monthEn),
        }));
      }
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.monthEn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrEdit = (e) => {
    e.preventDefault();

    if (!formData.titleTa || !formData.titleEn || !formData.monthTa || !formData.monthEn) {
      alert(lang === "ta" ? "தமிழ் மற்றும் ஆங்கில தலைப்புகள்/மாதங்கள் தேவை" : "Tamil and English titles/months are required");
      return;
    }

    const featuresTaList = formData.featuresTa
      ? formData.featuresTa.split(",").map((f) => f.trim())
      : ["சிறப்புக் கட்டுரை"];
    
    const featuresEnList = formData.featuresEn
      ? formData.featuresEn.split(",").map((f) => f.trim())
      : ["Featured Article"];

    if (editIssueId) {
      setIssues((prev) =>
        prev.map((i) =>
          i.id === editIssueId
            ? {
                ...i,
                title: formData.titleTa,
                titleEn: formData.titleEn,
                month: formData.monthTa,
                monthEn: formData.monthEn,
                pages: parseInt(formData.pages),
                description: formData.descriptionTa,
                descriptionEn: formData.descriptionEn,
                coverImage: formData.coverImage,
                pdfUrl: formData.pdfUrl,
                features: featuresTaList,
                featuresEn: featuresEnList
              }
            : i
        )
      );
      showNotification(
        lang === "ta" ? "இதழ் வெற்றிகரமாக மாற்றப்பட்டது!" : "Issue updated successfully!"
      );
    } else {
      const newIssue = {
        id: `v1-i${issues.length + 1}`,
        title: formData.titleTa,
        titleEn: formData.titleEn,
        month: formData.monthTa,
        monthEn: formData.monthEn,
        date: new Date().toISOString().split("T")[0],
        coverImage: formData.coverImage,
        description: formData.descriptionTa,
        descriptionEn: formData.descriptionEn,
        pdfUrl: formData.pdfUrl,
        isLatest: false,
        pages: parseInt(formData.pages),
        downloadCount: 0,
        features: featuresTaList,
        featuresEn: featuresEnList
      };
      setIssues((prev) => [newIssue, ...prev]);
      showNotification(
        lang === "ta"
          ? "புதிய இதழ் வெற்றிகரமாக சேர்க்கப்பட்டது!"
          : "New Issue created successfully!"
      );
    }

    closeModal();
  };

  const handleDelete = (id) => {
    const confirmMsg = lang === "ta" 
      ? "இந்த இதழை நீக்க விரும்புகிறீர்களா?" 
      : "Are you sure you want to delete this issue?";
    if (confirm(confirmMsg)) {
      setIssues((prev) => prev.filter((i) => i.id !== id));
      showNotification(lang === "ta" ? "இதழ் நீக்கப்பட்டது" : "Issue deleted successfully.");
    }
  };

  const openCreateModal = () => {
    setEditIssueId(null);
    setFormData({
      titleEn: "",
      titleTa: "",
      monthEn: "",
      monthTa: "",
      pages: 48,
      descriptionEn: "",
      descriptionTa: "",
      coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=800&fit=crop",
      pdfUrl: "/pdf/dummy_issue.pdf",
      featuresEn: "",
      featuresTa: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (issue) => {
    setEditIssueId(issue.id);
    const trans = issueTranslations[issue.id] || {};
    setFormData({
      titleEn: issue.titleEn || trans.title || issue.title,
      titleTa: issue.title,
      monthEn: issue.monthEn || trans.month || issue.month,
      monthTa: issue.month,
      pages: issue.pages,
      descriptionEn: issue.descriptionEn || trans.description || "",
      descriptionTa: issue.description || "",
      coverImage: issue.coverImage,
      pdfUrl: issue.pdfUrl,
      featuresEn: issue.featuresEn ? issue.featuresEn.join(", ") : (trans.features ? trans.features.join(", ") : ""),
      featuresTa: issue.features ? issue.features.join(", ") : ""
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditIssueId(null);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredIssues = issues.filter((i) => {
    const tTrans = issueTranslations[i.id] || {};
    const titleVal = lang === "en" ? (i.titleEn || tTrans.title || i.title) : i.title;
    const monthVal = lang === "en" ? (i.monthEn || tTrans.month || i.month) : i.month;
    return (
      titleVal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      monthVal.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Localization Dictionary
  const t = {
    ta: {
      adminTitle: "நிர்வாகக் குழு",
      portal: "நிர்வாகப் பகுதி",
      dashboard: "முகப்பு பலகை",
      issues: "இதழ்கள்",
      subscribers: "சந்தாதாரர்கள்",
      logout: "வெளியேற",
      secure: "பாதுகாப்பானது",
      totalIssues: "மொத்த இதழ்கள்",
      thisMonth: "+1 இந்த மாதம்",
      downloads: "பதிவிறக்கங்கள்",
      lastWeek: "+12% கடந்த வாரம்",
      activeReaders: "வாசகர்கள்",
      growth: "+24% வளர்ச்சி",
      writers: "ஆசிரியர்கள்",
      boardMembers: "ஆசிரியர்க்குழு",
      recentSummary: "சமீபத்திய இதழ்கள் சுருக்கம்",
      quickSubs: "சந்தாதாரர்கள் விரைவு பட்டியல்",
      cover: "அட்டை",
      month: "மாதம்",
      issueTitle: "இதழ் தலைப்பு",
      pages: "பக்கங்கள்",
      actions: "செயல்கள்",
      active: "செயலில்",
      addIssue: "புதிய இதழைச் சேர்",
      search: "தேடுக...",
      save: "சேமிக்க",
      cancel: "ரத்து செய்க",
      editIssue: "இதழைத் திருத்துக",
      email: "மின்னஞ்சல் விபரம்",
      date: "பதிவு தேதி",
      status: "நிலை"
    },
    en: {
      adminTitle: "Admin Panel",
      portal: "Admin Dashboard",
      dashboard: "Dashboard",
      issues: "Issues",
      subscribers: "Subscribers",
      logout: "Logout",
      secure: "Secure",
      totalIssues: "Total Issues",
      thisMonth: "+1 this month",
      downloads: "Downloads",
      lastWeek: "+12% last week",
      activeReaders: "Active Readers",
      growth: "+24% Growth",
      writers: "Editors",
      boardMembers: "Active Editors",
      recentSummary: "Recent Issues Summary",
      quickSubs: "Subscribers Quick List",
      cover: "Cover",
      month: "Month",
      issueTitle: "Issue Title",
      pages: "Pages",
      actions: "Actions",
      active: "Active",
      addIssue: "Add New Issue",
      search: "Search...",
      save: "Save Changes",
      cancel: "Cancel",
      editIssue: "Edit Issue Details",
      email: "Subscriber Email",
      date: "Date Subscribed",
      status: "Status"
    }
  }[lang];

  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row text-charcoal">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-charcoal text-white flex flex-col md:justify-between shrink-0">
        <div className="flex flex-col w-full">
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between md:justify-start space-x-2">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-secondary font-serif text-sm font-bold">
                வ
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold text-white tracking-wide">
                  {t.adminTitle}
                </span>
                <span className="text-[8px] text-secondary font-bold uppercase tracking-wider -mt-1">
                  Vadachennai Kural
                </span>
              </div>
            </div>
            <Link href="/" className="md:hidden p-2 text-white/60 hover:text-red-400">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-2 md:p-4 flex md:flex-col overflow-x-auto md:overflow-visible gap-1 w-full border-b border-white/10 md:border-b-0">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 md:py-3 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "dashboard" ? "bg-primary text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" /> <span className="inline">{t.dashboard}</span>
            </button>
            <button
              onClick={() => setActiveTab("issues")}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 md:py-3 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "issues" ? "bg-primary text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" /> <span className="inline">{t.issues}</span>
            </button>
            <button
              onClick={() => setActiveTab("subscribers")}
              className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-2.5 px-4 py-2.5 md:py-3 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                activeTab === "subscribers" ? "bg-primary text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4 shrink-0" /> <span className="inline">{t.subscribers}</span>
            </button>
          </nav>
        </div>

        {/* Footer Logout */}
        <div className="hidden md:block p-4 border-t border-white/10">
          <Link
            href="/"
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <LogOut className="w-4 h-4" /> {t.logout}
          </Link>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-border-subtle py-4 px-6 sm:px-8 flex items-center justify-between shadow-sm">
          <h2 className="font-serif text-sm sm:text-lg font-bold text-charcoal truncate">
            {activeTab === "dashboard" && t.portal}
            {activeTab === "issues" && t.issues}
            {activeTab === "subscribers" && t.subscribers}
          </h2>

          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <button
              onClick={() => setLang(prev => prev === "ta" ? "en" : "ta")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border-subtle hover:border-primary text-[10px] sm:text-xs font-semibold hover:bg-canvas transition cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-primary" /> {lang === "ta" ? "English" : "தமிழ்"}
            </button>
            <span className="hidden sm:flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" /> {t.secure}
            </span>
          </div>
        </header>

        {notification && (
          <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-white border border-secondary/30 px-5 py-3.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-2xl">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> {notification}
          </div>
        )}

        <div className="p-4 sm:p-8 w-full max-w-[1440px] mx-auto space-y-6">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === "dashboard" && (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl border border-border-subtle shadow-sm">
                  <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <span className="text-[9px] sm:text-[10px] font-sans font-bold text-charcoal/40 uppercase tracking-wider">{t.totalIssues}</span>
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-3xl font-bold">{issues.length}</h3>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold block mt-1">{t.thisMonth}</span>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl border border-border-subtle shadow-sm">
                  <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <span className="text-[9px] sm:text-[10px] font-sans font-bold text-charcoal/40 uppercase tracking-wider">{t.downloads}</span>
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-3xl font-bold">6,840</h3>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold block mt-1">{t.lastWeek}</span>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl border border-border-subtle shadow-sm">
                  <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <span className="text-[9px] sm:text-[10px] font-sans font-bold text-charcoal/40 uppercase tracking-wider">{t.activeReaders}</span>
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-3xl font-bold">1,450</h3>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold block mt-1">{t.growth}</span>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl border border-border-subtle shadow-sm">
                  <div className="flex justify-between items-start mb-2 sm:mb-4">
                    <span className="text-[9px] sm:text-[10px] font-sans font-bold text-charcoal/40 uppercase tracking-wider">{t.writers}</span>
                    <Users className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                  </div>
                  <h3 className="font-serif text-xl sm:text-3xl font-bold">4</h3>
                  <span className="text-[9px] sm:text-[10px] text-charcoal/45 font-semibold block mt-1">{t.boardMembers}</span>
                </div>
              </div>

              {/* Grid Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
                <div className="lg:col-span-8 bg-white rounded-xl border border-border-subtle shadow-sm p-4 sm:p-6 space-y-4">
                  <h4 className="font-serif text-sm sm:text-base font-bold pb-2 border-b border-border-subtle">{t.recentSummary}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="border-b border-border-subtle text-charcoal/50">
                          <th className="py-2.5 font-bold">{t.month}</th>
                          <th className="py-2.5 font-bold">{t.issueTitle}</th>
                          <th className="py-2.5 font-bold text-center">{t.pages}</th>
                          <th className="py-2.5 font-bold text-right">{t.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {issues.slice(0, 4).map((issue) => {
                          const trans = issueTranslations[issue.id] || {};
                          const displayMonth = lang === "en" ? (issue.monthEn || trans.month || issue.month) : issue.month;
                          const displayTitle = lang === "en" ? (issue.titleEn || trans.title || issue.title) : issue.title;
                          return (
                            <tr key={issue.id} className="border-b border-border-subtle hover:bg-canvas/50">
                              <td className="py-3 font-bold text-primary">{displayMonth}</td>
                              <td className="py-3 font-medium">{displayTitle}</td>
                              <td className="py-3 text-center font-sans">{issue.pages}</td>
                              <td className="py-3 text-right">
                                <button onClick={() => openEditModal(issue)} className="text-secondary hover:underline cursor-pointer">Edit</button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white rounded-xl border border-border-subtle shadow-sm p-4 sm:p-6 space-y-4">
                  <h4 className="font-serif text-sm sm:text-base font-bold pb-2 border-b border-border-subtle">{t.quickSubs}</h4>
                  <ul className="space-y-3.5 text-xs">
                    <li className="flex items-center justify-between pb-2.5 border-b border-border-subtle/40">
                      <div>
                        <span className="font-semibold block">anbu@mail.com</span>
                        <span className="text-[9px] text-charcoal/40">July 30, 2026</span>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">{t.active}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold block">malar@example.com</span>
                        <span className="text-[9px] text-charcoal/40">July 28, 2026</span>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">{t.active}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: ISSUES LIST */}
          {activeTab === "issues" && (
            <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-4 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:max-w-xs">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.search}
                    className="w-full pl-9 pr-4 py-2.5 bg-canvas border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/30" />
                </div>

                <Button onClick={openCreateModal} variant="primary" size="sm" className="flex items-center justify-center gap-1 cursor-pointer w-full sm:w-auto">
                  <Plus className="w-4 h-4" /> {t.addIssue}
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border-subtle text-charcoal/50">
                      <th className="py-2.5 font-bold">{t.cover}</th>
                      <th className="py-2.5 font-bold">{t.month}</th>
                      <th className="py-2.5 font-bold">{t.issueTitle}</th>
                      <th className="py-2.5 font-bold text-center">{t.pages}</th>
                      <th className="py-2.5 font-bold text-right">{t.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue) => {
                      const trans = issueTranslations[issue.id] || {};
                      const displayMonth = lang === "en" ? (issue.monthEn || trans.month || issue.month) : issue.month;
                      const displayTitle = lang === "en" ? (issue.titleEn || trans.title || issue.title) : issue.title;
                      return (
                        <tr key={issue.id} className="border-b border-border-subtle hover:bg-canvas/50">
                          <td className="py-3">
                            <div className="w-8 h-10 relative overflow-hidden rounded shadow aspect-[3/4]">
                              <img src={issue.coverImage} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="py-3 font-bold text-primary">{displayMonth}</td>
                          <td className="py-3 font-medium">{displayTitle}</td>
                          <td className="py-3 text-center font-sans">{issue.pages}</td>
                          <td className="py-3 text-right space-x-2">
                            <button
                              onClick={() => openEditModal(issue)}
                              className="p-1.5 hover:bg-gray-100 rounded text-secondary transition cursor-pointer inline-flex"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(issue.id)}
                              className="p-1.5 hover:bg-gray-100 rounded text-red-500 transition cursor-pointer inline-flex"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SUBSCRIBERS */}
          {activeTab === "subscribers" && (
            <div className="bg-white rounded-xl border border-border-subtle shadow-sm p-4 sm:p-6 space-y-4">
              <h3 className="font-serif text-sm sm:text-base font-bold pb-2 border-b border-border-subtle">
                {t.subscribers}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse min-w-[400px]">
                  <thead>
                    <tr className="border-b border-border-subtle text-charcoal/50">
                      <th className="py-2.5 font-bold">{t.email}</th>
                      <th className="py-2.5 font-bold">{t.date}</th>
                      <th className="py-2.5 font-bold">{t.status}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 font-medium">anbu@mail.com</td>
                      <td className="py-3 font-sans text-charcoal/50">2026-07-30</td>
                      <td className="py-3 text-emerald-600 font-bold">{t.active}</td>
                    </tr>
                    <tr className="border-b border-border-subtle">
                      <td className="py-3 font-medium">malar@example.com</td>
                      <td className="py-3 font-sans text-charcoal/50">2026-07-28</td>
                      <td className="py-3 text-emerald-600 font-bold">{t.active}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* 3. NEW/EDIT MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-border-subtle flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border-subtle p-5">
              <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal">
                {editIssueId ? t.editIssue : t.addIssue}
              </h3>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-gray-100 cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateOrEdit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* LHS: Aspect ratio responsive live photo preview */}
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/50">
                    Live Cover Preview
                  </span>
                  <div className="relative aspect-[3/4] w-full max-w-[150px] rounded-lg overflow-hidden border border-border-subtle shadow bg-gray-50 flex items-center justify-center">
                    {formData.coverImage ? (
                      <img 
                        src={formData.coverImage} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-charcoal/30 italic">No Cover</span>
                    )}
                  </div>
                </div>

                {/* RHS: Inputs */}
                <div className="md:col-span-2 space-y-4">
                  {/* Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Issue Title (English)
                      </label>
                      <input
                        type="text"
                        name="titleEn"
                        value={formData.titleEn}
                        onChange={handleInputChange}
                        placeholder="e.g. Gana Music Heritage"
                        className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs font-sans"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        இதழ் தலைப்பு (Tamil Auto-translated)
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          name="titleTa"
                          value={formData.titleTa}
                          onChange={handleInputChange}
                          placeholder={isTranslating ? "Translating..." : "உதாரணம்: கானா இசை மரபு"}
                          className="w-full px-3 py-2 border border-primary/45 bg-primary/5 focus:border-primary focus:outline-none rounded-lg text-xs font-semibold text-primary"
                        />
                        {isTranslating && (
                          <span className="absolute right-3 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Months */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        Month Name (English)
                      </label>
                      <input
                        type="text"
                        name="monthEn"
                        value={formData.monthEn}
                        onChange={handleInputChange}
                        placeholder="e.g. July 2026"
                        className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs font-sans"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                        வெளியீட்டு மாதம் (Tamil Auto-translated)
                      </label>
                      <input
                        type="text"
                        name="monthTa"
                        value={formData.monthTa}
                        onChange={handleInputChange}
                        placeholder="உதாரணம்: ஜூலை 2026"
                        className="w-full px-3 py-2 border border-primary/45 bg-primary/5 focus:border-primary focus:outline-none rounded-lg text-xs font-semibold text-primary"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Uploads and Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Pages Count
                  </label>
                  <input
                    type="number"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs font-sans"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Cover Image URL or File
                  </label>
                  <input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs font-sans mb-1"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData((prev) => ({
                          ...prev,
                          coverImage: URL.createObjectURL(file)
                        }));
                      }
                    }}
                    className="w-full px-2 py-1 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-[9px] bg-canvas cursor-pointer"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    PDF URL or File
                  </label>
                  <input
                    type="text"
                    name="pdfUrl"
                    value={formData.pdfUrl}
                    onChange={handleInputChange}
                    placeholder="/pdf/..."
                    className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs font-sans mb-1"
                  />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData((prev) => ({
                          ...prev,
                          pdfUrl: URL.createObjectURL(file)
                        }));
                      }
                    }}
                    className="w-full px-2 py-1 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-[9px] bg-canvas cursor-pointer"
                  />
                </div>
              </div>

              {/* Description inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Description Details (English)
                  </label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Details in English..."
                    className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs resize-none"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    இதழ் விபரம் (Tamil Description)
                  </label>
                  <textarea
                    name="descriptionTa"
                    value={formData.descriptionTa}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="தமிழ் இதழ் விபரம்..."
                    className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs resize-none"
                  />
                </div>
              </div>

              {/* Features / Highlights inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    Highlights (English - Comma separated list)
                  </label>
                  <input
                    type="text"
                    name="featuresEn"
                    value={formData.featuresEn}
                    onChange={handleInputChange}
                    placeholder="Gana singers, Boxing, Ports"
                    className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <label className="text-[9px] font-sans font-bold uppercase tracking-wider text-charcoal/70">
                    முக்கிய கட்டுரைகள் (Tamil - காற்புள்ளி பிரிப்பு)
                  </label>
                  <input
                    type="text"
                    name="featuresTa"
                    value={formData.featuresTa}
                    onChange={handleInputChange}
                    placeholder="கானா பாடல்கள், சார்பட்டா பரம்பரை, ராயபுரம்"
                    className="w-full px-3 py-2 border border-border-subtle focus:border-primary focus:outline-none rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-border-subtle text-charcoal/70 hover:bg-gray-50 rounded-lg text-xs font-bold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <Button type="submit" variant="primary" size="sm" className="cursor-pointer">
                  {t.save}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
