"use client";

import { useState } from "react";
import { Search, Filter, MoreVertical, Trash2, Edit2 } from "lucide-react";

const initialClients = [
  { id: "1", name: "Анна Петрова", phone: "+375 29 123-45-67", email: "anna@test.com", status: "Новый", date: "2024-05-08" },
  { id: "2", name: "Максим Сидоров", phone: "+375 33 987-65-43", email: "max@test.com", status: "В работе", date: "2024-05-07" },
  { id: "3", name: "Елена Иванова", phone: "+375 25 555-44-33", email: "elena@test.com", status: "Завершено", date: "2024-05-06" },
];

export default function ClientsPage() {
  const [clients, setClients] = useState(initialClients);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Новый": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "В работе": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "Завершено": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Управление клиентами</h1>
          <p className="text-textSoft mt-2">База заявок и CRM система.</p>
        </div>
        <button className="bg-neon text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
          Добавить клиента
        </button>
      </div>

      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 justify-between bg-white/[0.02]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSoft" />
            <input 
              type="text" 
              placeholder="Поиск клиента..." 
              className="w-full bg-base border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-neon/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4" />
              Фильтр
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/10">
                <th className="px-6 py-4 font-bold text-textSoft uppercase tracking-tighter text-xs">Имя</th>
                <th className="px-6 py-4 font-bold text-textSoft uppercase tracking-tighter text-xs">Контакты</th>
                <th className="px-6 py-4 font-bold text-textSoft uppercase tracking-tighter text-xs">Дата</th>
                <th className="px-6 py-4 font-bold text-textSoft uppercase tracking-tighter text-xs">Статус</th>
                <th className="px-6 py-4 font-bold text-textSoft uppercase tracking-tighter text-xs text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{client.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white/80">{client.phone}</div>
                    <div className="text-xs text-textSoft">{client.email}</div>
                  </td>
                  <td className="px-6 py-4 text-textSoft">
                    {client.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black uppercase tracking-tighter ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-textSoft hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-textSoft hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
