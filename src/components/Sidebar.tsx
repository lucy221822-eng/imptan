import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Image as ImageIcon, 
  FileText, 
  Settings,
  LogOut
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Users, label: "Клиенты (CRM)", href: "/admin/clients" },
  { icon: ImageIcon, label: "Галерея", href: "/admin/gallery" },
  { icon: FileText, label: "Контент (CMS)", href: "/admin/cms" },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-card border-r border-white/10 flex flex-col p-4 fixed left-0 top-0">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-black text-white tracking-tighter">IMPTAN ADMIN</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-textSoft hover:text-white hover:bg-white/5 transition-colors"
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="pt-4 border-t border-white/10">
        <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors">
          <LogOut className="w-4 h-4" />
          Выход
        </button>
      </div>
    </div>
  );
}
