"use client";
import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactForm() {
  const { lang } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  
  const [status, setStatus] = useState("idle"); // idle, sending, success, error
  const [errors, setErrors] = useState({});

  const t = {
    ta: {
      nameReq: "பெயர் கட்டாயம் தேவை",
      emailReq: "மின்னஞ்சல் கட்டாயம் தேவை",
      emailInvalid: "மின்னஞ்சல் முகவரி தவறானது",
      subjectReq: "பொருள் கட்டாயம் தேவை",
      messageReq: "செய்தி கட்டாயம் தேவை",
      successTitle: "செய்தி அனுப்பப்பட்டது!",
      successText: "எங்கள் குழு உங்களை விரைவில் தொடர்பு கொள்ளும். உங்கள் ஆதரவிற்கு நன்றி.",
      sendAnother: "மீண்டும் அனுப்ப",
      labelName: "உங்கள் பெயர்",
      labelEmail: "மின்னஞ்சல்",
      labelSubject: "பொருள்",
      labelMessage: "செய்தி",
      placeholderName: "பெயர்",
      placeholderSubject: "விஷயம்",
      placeholderMessage: "உங்கள் செய்தியை இங்கு தட்டச்சு செய்யவும்...",
      sending: "அனுப்பப்படுகிறது...",
      sendBtn: "அனுப்புக"
    },
    en: {
      nameReq: "Name is required",
      emailReq: "Email is required",
      emailInvalid: "Invalid email address",
      subjectReq: "Subject is required",
      messageReq: "Message is required",
      successTitle: "Message Sent!",
      successText: "Our team will contact you shortly. Thank you for your support.",
      sendAnother: "Send Another",
      labelName: "Your Name",
      labelEmail: "Email Address",
      labelSubject: "Subject",
      labelMessage: "Message",
      placeholderName: "Name",
      placeholderSubject: "Subject",
      placeholderMessage: "Write your message here...",
      sending: "Sending...",
      sendBtn: "Send Message"
    }
  }[lang];

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = t.nameReq;
    if (!formData.email.trim()) {
      tempErrors.email = t.emailReq;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = t.emailInvalid;
    }
    if (!formData.subject.trim()) tempErrors.subject = t.subjectReq;
    if (!formData.message.trim()) tempErrors.message = t.messageReq;
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    // Simulate API request
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-border-subtle p-6 sm:p-8">
      {status === "success" ? (
        <div className="text-center py-8 space-y-4">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-charcoal">
            {t.successTitle}
          </h3>
          <p className="text-sm text-charcoal/60 max-w-sm mx-auto">
            {t.successText}
          </p>
          <Button onClick={() => setStatus("idle")} variant="primary" size="sm">
            {t.sendAnother}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="name" className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
                {t.labelName}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-canvas border rounded-lg text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.name ? "border-red-500" : "border-border-subtle focus:border-primary"
                }`}
                placeholder={t.placeholderName}
              />
              {errors.name && <span className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.name}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
                {t.labelEmail}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-canvas border rounded-lg text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${
                  errors.email ? "border-red-500" : "border-border-subtle focus:border-primary"
                }`}
                placeholder="example@mail.com"
              />
              {errors.email && <span className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.email}</span>}
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="subject" className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
              {t.labelSubject}
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-canvas border rounded-lg text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary ${
                errors.subject ? "border-red-500" : "border-border-subtle focus:border-primary"
              }`}
              placeholder={t.placeholderSubject}
            />
            {errors.subject && <span className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.subject}</span>}
          </div>

          {/* Message */}
          <div className="flex flex-col space-y-1.5">
            <label htmlFor="message" className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">
              {t.labelMessage}
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              className={`w-full px-4 py-3 bg-canvas border rounded-lg text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-primary resize-none ${
                errors.message ? "border-red-500" : "border-border-subtle focus:border-primary"
              }`}
              placeholder={t.placeholderMessage}
            />
            {errors.message && <span className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {errors.message}</span>}
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center py-3.5 cursor-pointer"
            disabled={status === "sending"}
          >
            {status === "sending" ? (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4 animate-spin" /> {t.sending}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {t.sendBtn} <Send className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
