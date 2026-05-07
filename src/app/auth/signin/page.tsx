"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push("/admin");
    } else {
      alert("Неверные данные");
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center p-4">
      <div className="bg-card border border-white/10 p-8 rounded-3xl w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">Вход в админку</h1>
          <p className="text-textSoft mt-2">Введите данные администратора</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-textSoft uppercase tracking-widest">Логин</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-base border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-neon/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-textSoft uppercase tracking-widest">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-base border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-neon/50 transition-colors"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-neon text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity mt-4"
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
}
