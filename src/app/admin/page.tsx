import { Users, Image as ImageIcon, FileText, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { label: "Всего заявок", value: "24", icon: Users, color: "text-blue-400" },
    { label: "Новые сегодня", value: "3", icon: TrendingUp, color: "text-emerald-400" },
    { label: "Альбомов", value: "8", icon: ImageIcon, color: "text-purple-400" },
    { label: "Разделов CMS", value: "5", icon: FileText, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Панель управления</h1>
        <p className="text-textSoft mt-2">Добро пожаловать в админ-панель студии.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-white/10 p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <span className="text-xs font-medium text-textSoft">За все время</span>
            </div>
            <div className="text-2xl font-black text-white">{stat.value}</div>
            <div className="text-sm text-textSoft mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Последние заявки</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                <div>
                  <div className="font-bold text-sm">Анна Петрова</div>
                  <div className="text-xs text-textSoft">+375 29 123-45-67</div>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-bold uppercase tracking-tighter">Новый</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-white/10 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Быстрые действия</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl border border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all text-sm font-medium">
              Добавить фото
            </button>
            <button className="p-4 rounded-xl border border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all text-sm font-medium">
              Изменить текст
            </button>
            <button className="p-4 rounded-xl border border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all text-sm font-medium">
              Новый клиент
            </button>
            <button className="p-4 rounded-xl border border-white/10 hover:border-neon/50 hover:bg-neon/5 transition-all text-sm font-medium">
              Настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
