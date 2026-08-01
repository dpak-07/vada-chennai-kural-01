"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Send, User, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function CommentsSection({ issueId }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { lang } = useLanguage();

  const t = {
    ta: {
      commentsTitle: "கருத்துகள் (Comments)",
      noComments: "இன்னும் கருத்துகள் இல்லை. முதல் கருத்தை எழுதுங்கள்!",
      placeholderName: "உங்கள் பெயர் (Your Name)",
      placeholderComment: "இங்கு உங்கள் கருத்தை எழுதவும்...",
      submitBtn: "கருத்துரையை சமர்ப்பி",
      submitting: "சமர்ப்பிக்கிறது...",
      nameRequired: "பெயர் மற்றும் கருத்து தேவை!",
      successMsg: "கருத்து வெற்றிகரமாக பகிரப்பட்டது!"
    },
    en: {
      commentsTitle: "Reader Comments",
      noComments: "No comments yet. Be the first to share your thoughts!",
      placeholderName: "Your Name",
      placeholderComment: "Write your comment here...",
      submitBtn: "Post Comment",
      submitting: "Posting...",
      nameRequired: "Name and comment are required!",
      successMsg: "Comment posted successfully!"
    }
  }[lang];

  // Fetch comments globally on mount
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/comments?issueId=${issueId}`);
        if (res.ok) {
          const data = await res.json();
          // Sort by newest first
          setComments(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [issueId]);

  // Handle post submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) {
      alert(t.nameRequired);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, name, comment: commentText })
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments(prev => [newComment, ...prev]);
        setCommentText("");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (authorName) => {
    if (!authorName) return "?";
    return authorName.trim().charAt(0).toUpperCase();
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "";
    
    // Format localized date
    return date.toLocaleDateString(lang === "ta" ? "ta-IN" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="bg-white rounded-xl border border-border-subtle p-6 sm:p-8 space-y-8 shadow-sm">
      <div className="flex items-center gap-2.5 pb-4 border-b border-border-subtle">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h3 className="font-serif text-lg font-bold text-charcoal">
          {t.commentsTitle} ({comments.length})
        </h3>
      </div>

      {/* 1. Comments Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1 relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.placeholderName}
              required
              className="w-full pl-9 pr-4 py-2.5 border border-border-subtle hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs font-sans text-charcoal outline-none bg-canvas transition"
            />
          </div>
          <div className="sm:col-span-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={t.placeholderComment}
              required
              className="w-full px-4 py-2.5 border border-border-subtle hover:border-primary focus:border-primary focus:ring-1 focus:ring-primary rounded-lg text-xs font-sans text-charcoal outline-none bg-canvas transition"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold font-sans py-2.5 px-6 rounded-lg transition shadow-md disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            {submitting ? t.submitting : t.submitBtn}
          </button>
        </div>
      </form>

      {/* 2. Comments List Display */}
      <div className="space-y-4 pt-4 border-t border-border-subtle">
        {loading ? (
          <div className="flex items-center justify-center py-6">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : comments.length > 0 ? (
          <div className="divide-y divide-border-subtle max-h-[400px] overflow-y-auto pr-2 space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-4 pt-4 first:pt-0">
                {/* User Avatar Circle */}
                <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center text-secondary font-sans font-bold text-sm shrink-0 border border-secondary/20">
                  {getInitials(c.name)}
                </div>
                {/* Comment Text block */}
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="font-serif text-xs font-bold text-charcoal">{c.name}</span>
                    <span className="text-[10px] text-charcoal/40 flex items-center gap-1 font-sans">
                      <Clock className="w-3 h-3" />
                      {formatTimestamp(c.timestamp)}
                    </span>
                  </div>
                  <p className="font-sans text-xs sm:text-sm text-charcoal/80 leading-relaxed font-light break-words">
                    {c.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-charcoal/40 py-8 italic">
            {t.noComments}
          </p>
        )}
      </div>
    </div>
  );
}
