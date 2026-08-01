"use client";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import contactData from "@/data/contact.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white border-t border-primary/20 mt-auto">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand & About */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-secondary font-serif text-base font-bold shadow-sm transition-transform duration-300 group-hover:scale-105">
                வ
              </span>
              <div className="flex flex-col">
                <span className="font-serif text-lg font-bold tracking-tight text-white">
                  வடசென்னை குரல்
                </span>
                <span className="font-sans text-[8px] tracking-widest text-secondary font-bold uppercase -mt-1">
                  Vadachennai Kural
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed font-light">
              வடசென்னை மக்களின் உண்மையான வாழ்வியல், பண்பாடு, மற்றும் கலைகளை உலகிற்கு எடுத்துரைக்கும் மாதாந்திர டிஜிட்டல் இதழ்.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-md font-bold text-secondary uppercase tracking-wider">
              விரைவு இணைப்புகள்
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-400 font-medium">
              <li>
                <Link href="/" className="hover:text-primary transition-colors duration-200">
                  முகப்பு (Home)
                </Link>
              </li>
              <li>
                <Link href="/issues" className="hover:text-primary transition-colors duration-200">
                  இதழ்கள் (Issues)
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors duration-200">
                  எங்களைப் பற்றி (About)
                </Link>
              </li>
              <li>
                <Link href="/editorial" className="hover:text-primary transition-colors duration-200">
                  ஆசிரியர்க்குழு (Editorial)
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors duration-200">
                  தொடர்புக்கு (Contact)
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-md font-bold text-secondary uppercase tracking-wider">
              தொடர்பு விபரங்கள்
            </h4>
            <ul className="space-y-3.5 text-xs text-gray-400 font-light">
              <li className="flex items-start space-x-3.5">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{contactData.officeAddress}</span>
              </li>
              <li className="flex items-center space-x-3.5">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${contactData.phone}`} className="hover:text-primary transition-colors">
                  {contactData.phone}
                </a>
              </li>
              <li className="flex items-center space-x-3.5">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${contactData.email}`} className="hover:text-primary transition-colors">
                  {contactData.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-md font-bold text-secondary uppercase tracking-wider">
              சமூக வலைத்தளங்கள்
            </h4>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              புதிய செய்திகள் மற்றும் இதழ் வெளியீடுகள் பற்றிய விபரங்களை அறிய எங்களைப் பின்தொடரவும்.
            </p>
            <div className="flex space-x-4">
              <a
                href={contactData.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 text-white hover:scale-105"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a
                href={contactData.socialLinks.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 text-white hover:scale-105"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={contactData.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 text-white hover:scale-105"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href={contactData.socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-primary flex items-center justify-center transition-all duration-300 text-white hover:scale-105"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C22 8.68 22 12 22 12s0 3.32-.42 4.814a2.44 2.44 0 0 1-1.768 1.768C18.32 19 12 19 12 19s-6.32 0-7.814-.418a2.44 2.44 0 0 1-1.768-1.768C2 15.32 2 12 2 12s0-3.32.418-4.814a2.44 2.44 0 0 1 1.768-1.768C5.68 5 12 5 12 5s6.32 0 7.812.418ZM10 15.5l5.5-3.5-5.5-3.5v7Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-light">
          <p>© {currentYear} வடசென்னை குரல். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 font-medium">
            <Link href="/about" className="hover:text-primary transition-colors">
              நிபந்தனைகள் (Terms)
            </Link>
            <Link href="/about" className="hover:text-primary transition-colors">
              தனியுரிமை கொள்கை (Privacy)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
