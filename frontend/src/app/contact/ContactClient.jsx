"use client";
import ContactForm from "@/components/ui/ContactForm";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeading from "@/components/common/SectionHeading";
import { Mail, Phone, MapPin } from "lucide-react";
import contactData from "@/data/contact.json";
import { useLanguage } from "@/context/LanguageContext";

export default function ContactClient() {
  const { lang } = useLanguage();

  const t = {
    ta: {
      breadcrumb: "தொடர்புக்கு",
      title: "எங்களைத் தொடர்பு கொள்ள",
      subtitle: "தொடர்பு கொள்ளுங்கள்",
      detailsTitle: "தொடர்பு விபரங்கள்",
      addressLabel: "அலுவலக முகவரி",
      emailLabel: "மின்னஞ்சல் முகவரி",
      phoneLabel: "தொலைபேசி எண்",
      formTitle: "உங்கள் கருத்துக்கள் & படைப்புகளை அனுப்புக",
      formSubtitle: "எங்கள் இதழில் தங்கள் கட்டுரைகள் அல்லது படைப்புகள் பிரசுரிக்கப்பட விரும்பினால், அல்லது ஏதேனும் பரிந்துரைகள் இருந்தால் கீழே உள்ள படிவத்தைப் பயன்படுத்தி எங்களைத் தொடர்பு கொள்ளவும்."
    },
    en: {
      breadcrumb: "Contact Us",
      title: "Contact Us",
      subtitle: "GET IN TOUCH",
      detailsTitle: "Contact Details",
      addressLabel: "Office Address",
      emailLabel: "Email Address",
      phoneLabel: "Phone Number",
      formTitle: "Send Your Feedback & Submissions",
      formSubtitle: "If you want your articles or creative works published in our magazine, or if you have any suggestions, please contact us using the form below."
    }
  }[lang];

  return (
    <div className="py-12">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12">
        {/* Breadcrumbs */}
        <Breadcrumb items={[{ name: t.breadcrumb, path: "/contact" }]} />

        {/* Title */}
        <SectionHeading title={t.title} subtitle={t.subtitle} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Map (LHS) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-xl border border-border-subtle p-6 space-y-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold text-charcoal pb-3 border-b border-border-subtle">
                {t.detailsTitle}
              </h3>

              <ul className="space-y-6 text-sm text-charcoal/80 font-light">
                <li className="flex items-start space-x-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-charcoal text-xs uppercase tracking-wider mb-1">{t.addressLabel}</h4>
                    <p className="leading-relaxed text-xs sm:text-sm">{lang === "en" ? contactData.officeAddressEn : contactData.officeAddress}</p>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-charcoal text-xs uppercase tracking-wider mb-1">{t.emailLabel}</h4>
                    <a href={`mailto:${contactData.email}`} className="text-secondary font-semibold hover:underline text-xs sm:text-sm">{contactData.email}</a>
                  </div>
                </li>

                <li className="flex items-start space-x-4">
                  <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-charcoal text-xs uppercase tracking-wider mb-1">{t.phoneLabel}</h4>
                    <a href={`tel:${contactData.phone}`} className="text-secondary font-semibold hover:underline text-xs sm:text-sm">{contactData.phone}</a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Embedded Google Map */}
            <div className="bg-white rounded-xl border border-border-subtle p-3 h-[300px] shadow-sm overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.394140723821!2d80.25883207599026!3d13.137452611234907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ab75f3a097%3A0xc3cf234a9446f77f!2sVyasarpadi%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1709400000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Vadachennai Kural Office Location Map"
              />
            </div>
          </div>

          {/* Interactive Form (RHS) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="max-w-2xl">
              <h3 className="font-serif text-xl font-bold text-charcoal mb-2">
                {t.formTitle}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-charcoal/60 leading-relaxed font-light mb-6">
                {t.formSubtitle}
              </p>
            </div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
