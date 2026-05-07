import Link from "next/link";
import { 
  LogIn, 
  ArrowRight, 
  Instagram, 
  Phone, 
  MapPin, 
  Star, 
  Clock, 
  CreditCard, 
  Camera,
  ChevronRight
} from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute min-w-full min-h-full object-cover opacity-20"
        >
          <source src="/background.webm" type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-base via-transparent to-base"></div>
      </div>

      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-noise"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30 group-hover:border-primary/60 transition-all">
              <Star className="w-6 h-6 text-primary drop-shadow-[0_0_8px_rgba(217,70,239,0.6)]" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              ИМПЕРИЯ ТАНЦА<span className="text-primary">.</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/directions" className="text-xs font-bold uppercase tracking-widest text-textSoft hover:text-primary transition-colors">Направления</Link>
            <Link href="/schedule" className="text-xs font-bold uppercase tracking-widest text-textSoft hover:text-primary transition-colors">Расписание</Link>
            <Link href="/prices" className="text-xs font-bold uppercase tracking-widest text-textSoft hover:text-primary transition-colors">Цены</Link>
            <Link href="/contacts" className="text-xs font-bold uppercase tracking-widest text-textSoft hover:text-primary transition-colors">Контакты</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link 
              href="/auth/signin" 
              className="hidden sm:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-textSoft hover:text-white px-4 py-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              Вход
            </Link>
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105 transition-all">
              Записаться
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Студия в центре Минска</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              ТВОЕ ТЕЛО<span className="text-primary neon-glow-text">.</span><br />
              ТВОИ ПРАВИЛА<span className="text-primary neon-glow-text">.</span>
            </h1>
            
            <p className="text-lg text-textSoft leading-relaxed max-w-xl mx-auto md:mx-0">
              Профессиональное обучение Pole Dance, Стрип-пластика и Стретчинг. Мы создаем пространство, где энергия превращается в движение.
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
              <button className="group flex items-center gap-3 bg-white text-base px-8 py-5 rounded-2xl font-black hover:bg-primary hover:text-white transition-all shadow-xl">
                Начать тренировки
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link href="/schedule" className="flex items-center gap-3 border border-white/10 px-8 py-5 rounded-2xl font-bold hover:bg-white/5 transition-all backdrop-blur-sm">
                Расписание
              </Link>
            </div>
          </div>

          <div className="flex-1 relative hidden md:block">
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full"></div>
            <div className="relative aspect-square w-full max-w-md mx-auto rounded-[40px] overflow-hidden border border-white/10 bg-card/50 backdrop-blur-xl flex items-center justify-center">
               <Star className="w-32 h-32 text-primary/20" />
               <div className="absolute bottom-8 left-8 right-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
                 <p className="text-sm font-bold text-white mb-1">Первая тренировка</p>
                 <p className="text-2xl font-black text-primary">ВСЕГО 10 РУБ.</p>
               </div>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="mt-32 space-y-32">
          
          {/* Directions Preview */}
          <section>
            <div className="flex items-end justify-between mb-12">
              <div className="text-left">
                <h2 className="text-4xl font-black text-white mb-4">НАПРАВЛЕНИЯ</h2>
                <p className="text-textSoft">Выберите подходящий стиль для вашего развития</p>
              </div>
              <Link href="/directions" className="hidden sm:flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                Все стили <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Pole Dance", desc: "Сила и грация на пилоне", icon: Star },
                { title: "Стрип-пластика", desc: "Чувственность и пластика", icon: Star },
                { title: "Стретчинг", desc: "Гибкость и расслабление", icon: Star },
              ].map((item, i) => (
                <div key={i} className="card-surface p-8 text-left group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-textSoft leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Pricing Preview */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white mb-4 uppercase">Цены и абонементы</h2>
              <p className="text-textSoft">Прозрачные условия без скрытых доплат</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card-surface p-8 text-left">
                <h3 className="text-lg font-bold text-white mb-4">Пробное</h3>
                <div className="text-4xl font-black text-primary mb-6">10 BYN</div>
                <ul className="space-y-4 mb-8 text-sm text-textSoft">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Любое направление</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Знакомство со студией</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">Выбрать</button>
              </div>

              <div className="card-surface p-8 text-left popular-card scale-105">
                <h3 className="text-lg font-bold text-white mb-4">Стандарт</h3>
                <div className="text-4xl font-black text-white mb-6">85 BYN</div>
                <ul className="space-y-4 mb-8 text-sm text-textSoft">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> 8 занятий в месяц</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Заморозка 7 дней</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Все направления</li>
                </ul>
                <button className="w-full py-3 rounded-xl bg-primary text-white font-black shadow-lg shadow-primary/20 hover:scale-105 transition-all">Популярный</button>
              </div>

              <div className="card-surface p-8 text-left">
                <h3 className="text-lg font-bold text-white mb-4">Безлимит</h3>
                <div className="text-4xl font-black text-primary mb-6">150 BYN</div>
                <ul className="space-y-4 mb-8 text-sm text-textSoft">
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Безлимит занятий</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Заморозка 14 дней</li>
                  <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-primary" /> Личный кабинет</li>
                </ul>
                <button className="w-full py-3 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all">Выбрать</button>
              </div>
            </div>
          </section>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
            <div className="flex items-start gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <MapPin className="w-10 h-10 text-primary shrink-0" />
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">Адрес</h3>
                <p className="text-sm text-textSoft">г. Минск, ул. Кальварийская, 25</p>
              </div>
            </div>
            <div className="flex items-start gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <Phone className="w-10 h-10 text-primary shrink-0" />
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">Контакты</h3>
                <p className="text-sm text-textSoft">+375 (29) 576-00-55</p>
              </div>
            </div>
            <div className="flex items-start gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
              <Instagram className="w-10 h-10 text-primary shrink-0" />
              <div className="text-left">
                <h3 className="text-lg font-bold text-white mb-1">Instagram</h3>
                <p className="text-sm text-textSoft">@imperia_tanca</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <a 
        href="https://wa.me/375295760055" 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-[#25d366] rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.4),0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform group"
      >
        <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-black/20 backdrop-blur-xl py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <span className="text-xl font-black text-white">IMPTAN<span className="text-primary">.</span></span>
            <p className="text-xs text-textSoft mt-2">© 2024 Студия "Империя Танца". Все права защищены.</p>
          </div>
          <div className="flex gap-8">
            <Link href="/policy" className="text-xs text-textSoft hover:text-white transition-colors">Политика конфиденциальности</Link>
            <Link href="/terms" className="text-xs text-textSoft hover:text-white transition-colors">Договор оферты</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
