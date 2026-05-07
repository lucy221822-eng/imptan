import Link from "next/link";
import { LogIn, ArrowRight, Instagram, Phone, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-noise"></div>

      {/* Navbar */}
      <nav className="relative z-20 border-b border-white/5 bg-base/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white">
            IMPTAN<span className="text-neon">.</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/directions" className="text-sm font-medium text-textSoft hover:text-white transition-colors">Направления</Link>
            <Link href="/schedule" className="text-sm font-medium text-textSoft hover:text-white transition-colors">Расписание</Link>
            <Link href="/prices" className="text-sm font-medium text-textSoft hover:text-white transition-colors">Цены</Link>
            <Link href="/contacts" className="text-sm font-medium text-textSoft hover:text-white transition-colors">Контакты</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/auth/signin" 
              className="flex items-center gap-2 text-sm font-bold text-textSoft hover:text-white transition-colors px-4 py-2"
            >
              <LogIn className="w-4 h-4" />
              Вход
            </Link>
            <button className="bg-neon text-white px-6 py-2.5 rounded-full font-bold text-sm hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-all">
              Записаться
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-32">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            ТВОЕ ТЕЛО<span className="text-neon">.</span><br />
            ТВОИ ПРАВИЛА<span className="text-neon">.</span>
          </h1>
          <p className="mt-8 text-lg text-textSoft leading-relaxed max-w-xl">
            Студия танца и фитнеса в центре Минска. Мы создаем пространство, где энергия превращается в движение, а движение — в результат.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <button className="flex items-center gap-2 bg-white text-base px-8 py-4 rounded-full font-black hover:bg-neon hover:text-white transition-all group">
              Начать тренировки
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link href="/schedule" className="flex items-center gap-2 border border-white/10 px-8 py-4 rounded-full font-bold hover:bg-white/5 transition-all">
              Смотреть расписание
            </Link>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
            <MapPin className="w-8 h-8 text-neon mb-6" />
            <h3 className="text-xl font-bold mb-2">Адрес</h3>
            <p className="text-textSoft text-sm leading-relaxed">г. Минск, ул. Кальварийская, 25 (ст. м. Молодежная)</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
            <Phone className="w-8 h-8 text-neon mb-6" />
            <h3 className="text-xl font-bold mb-2">Контакты</h3>
            <p className="text-textSoft text-sm leading-relaxed">+375 (29) 123-45-67<br />Ежедневно: 11:00 — 23:00</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
            <Instagram className="w-8 h-8 text-neon mb-6" />
            <h3 className="text-xl font-bold mb-2">Соцсети</h3>
            <p className="text-textSoft text-sm leading-relaxed">Подписывайтесь на наш Instagram, чтобы следить за новостями и акциями.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
