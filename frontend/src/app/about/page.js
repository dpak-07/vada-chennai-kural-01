import AboutClient from "./AboutClient";
import aboutData from "@/data/about.json";

export const metadata = {
  title: "எங்களைப் பற்றி | About Us",
  description: "வடசென்னை குரல் இதழின் நோக்கம், வரலாறு மற்றும் வளர்ச்சிப் பாதை பற்றிய தகவல்கள். வடசென்னை மக்களின் வாழ்வியலைப் பேசும் மாற்று ஊடகம்.",
  keywords: ["Vadachennai Kural About", "வடசென்னை குரல் வரலாறு", "North Chennai Tamil Magazine Story"],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <AboutClient data={aboutData} />
  );
}
