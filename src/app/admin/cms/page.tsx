"use client";

import { useState } from "react";
import { Save, RotateCcw, FileText, Layout, Info } from "lucide-react";

export default function CMSPage() {
  const [content, setContent] = useState({
    heroTitle: "ИМПЕРИЯ ТАНЦА",
    heroSubtitle: "Твое тело. Твои правила. Твоя энергия.",
    aboutText: "Наша студия — это место, где каждый может найти себя через движение.",
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Управление контентом</h1>
          <p className="text-textSoft mt-2">Редактирование текстов и разделов сайта.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
            <RotateCcw className="w-4 h-4" />
            Сбросить
          </button>
          <button className="flex items-center gap-2 bg-neon text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
            <Save className="w-4 h-4" />
            Сохранить
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Layout className="w-5 h-5 text-neon" />
              <h2 className="font-bold text-lg">Главный экран (Hero)</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-widest">Заголовок</label>
              <input 
                type="text" 
                value={content.heroTitle}
                onChange={(e) => setContent({...content, heroTitle: e.target.value})}
                className="w-full bg-base border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-neon/50 transition-colors font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-widest">Подзаголовок</label>
              <textarea 
                rows={2}
                value={content.heroSubtitle}
                onChange={(e) => setContent({...content, heroSubtitle: e.target.value})}
                className="w-full bg-base border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-neon/50 transition-colors resize-none"
              />
            </div>
          </div>

          <div className="bg-card border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-neon" />
              <h2 className="font-bold text-lg">О нас</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-textSoft uppercase tracking-widest">Текст раздела</label>
              <textarea 
                rows={4}
                value={content.aboutText}
                onChange={(e) => setContent({...content, aboutText: e.target.value})}
                className="w-full bg-base border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-neon/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-neon/10 border border-neon/20 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-neon" />
              Инструкция
            </h3>
            <p className="text-xs text-textSoft leading-relaxed">
              Все изменения вступят в силу сразу после нажатия кнопки «Сохранить». 
              Убедитесь, что текст помещается в блоки на сайте. Используйте короткие и емкие фразы для лучшего отображения.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
