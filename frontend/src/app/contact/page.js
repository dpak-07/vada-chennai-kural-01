import ContactClient from "./ContactClient";

export const metadata = {
  title: "தொடர்புக்கு | Contact Us",
  description: "வடசென்னை குரல் இதழுடன் தொடர்பு கொள்ள மின்னஞ்சல், தொலைபேசி மற்றும் முகவரி விவரங்கள். உங்களது கருத்துக்கள் மற்றும் படைப்புகளை அனுப்பலாம்.",
  keywords: ["Vadachennai Kural Contact", "வடசென்னை குரல் முகவரி", "Tamil Magazine Chennai office address"],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <ContactClient />
  );
}
