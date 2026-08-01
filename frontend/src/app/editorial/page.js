import EditorialClient from "./EditorialClient";

export const metadata = {
  title: "ஆசிரியர்க்குழு | Editorial Team",
  description: "வடசென்னை குரல் இதழின் பின்னால் உள்ள எழுத்தாளர்கள், பத்திரிகையாளர்கள் மற்றும் படைப்பாளிகளின் அறிமுகம்.",
  keywords: ["Vadachennai Kural Editorial", "வடசென்னை குரல் ஆசிரியர் குழு", "Tamil writers Chennai", "Gana music research team"],
  alternates: {
    canonical: "/editorial",
  },
};

export default function EditorialPage() {
  return (
    <EditorialClient />
  );
}
