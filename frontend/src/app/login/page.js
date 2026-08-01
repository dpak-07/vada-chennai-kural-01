import LoginFormClient from "./LoginFormClient";

export const metadata = {
  title: "நிர்வாகி உள்நுழைவு | Admin Login",
  description: "வடசென்னை குரல் இதழின் நிர்வாகப் பக்கத்திற்கான உள்நுழைவு தளம். தங்களுக்கு வழங்கப்பட்ட பயனர் பெயர் மற்றும் கடவுச்சொல்லைப் பயன்படுத்தி உள்நுழையவும்.",
  keywords: ["Vadachennai Kural Admin Login", "வடசென்னை குரல் நிர்வாக உள்நுழைவு"],
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <LoginFormClient />
    </main>
  );
}
