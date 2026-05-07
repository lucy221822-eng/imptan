"use client";

import { useState } from "react";
import { Plus, FolderPlus, Trash2, Edit2, MoreVertical } from "lucide-react";

const initialAlbums = [
  { id: "1", title: "Занятия в зале", count: 12, cover: "gallery-1.svg" },
  { id: "2", title: "Выступления", count: 24, cover: "gallery-2.svg" },
  { id: "3", title: "Наши тренеры", count: 8, cover: "gallery-3.svg" },
];

export default function GalleryManagementPage() {
  const [albums, setAlbums] = useState(initialAlbums);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Управление галереей</h1>
          <p className="text-textSoft mt-2">Альбомы и фотографии на сайте.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
            <FolderPlus className="w-4 h-4" />
            Создать альбом
          </button>
          <button className="flex items-center gap-2 bg-neon text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" />
            Загрузить фото
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <div key={album.id} className="group relative bg-card border border-white/10 rounded-2xl overflow-hidden hover:border-neon/50 transition-all">
            <div className="aspect-video bg-white/5 relative">
              <div className="absolute inset-0 flex items-center justify-center text-textSoft/20 font-black text-4xl uppercase tracking-tighter">
                ALBUM
              </div>
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 bg-base/80 backdrop-blur-sm rounded-lg text-white hover:bg-neon transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-base/80 backdrop-blur-sm rounded-lg text-red-400 hover:bg-red-500 hover:text-white transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white group-hover:text-neon transition-colors">{album.title}</h3>
                <p className="text-xs text-textSoft mt-1">{album.count} фотографий</p>
              </div>
              <button className="p-2 text-textSoft hover:text-white transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
