// Sidebar do painel administrativo (admin / profissional).
// Aparece no lado esquerdo do layout com os links de navegação.
// No mobile, vira um menu hambúrguer com overlay.
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

// Lista de links que aparecem na sidebar
const adminLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pacientes', label: 'Pacientes', icon: Users },
  { href: '/exercicios', label: 'Exercícios', icon: Dumbbell },
  { href: '/avaliacoes', label: 'Avaliações', icon: ClipboardList },
  { href: '/configuracoes', label: 'Configurações', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();         // rota atual (pra destacar o link ativo)
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false); // controla o menu no celular

  return (
    <>
      {/* Botão hambúrguer — só aparece no mobile (telas < lg) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-maya bg-white shadow-maya"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5 text-maya-teal-dark" />
      </button>

      {/* Overlay escuro atrás da sidebar quando aberta no mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* A sidebar em si */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300',
          'lg:translate-x-0 lg:static lg:z-auto',   // no desktop, sempre visível
          mobileOpen ? 'translate-x-0' : '-translate-x-full' // no mobile, desliza
        )}
      >
        {/* Cabeçalho com nome do sistema e botão de fechar (mobile) */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h1 className="font-display text-xl font-bold text-maya-teal-dark">Maya RPG</h1>
            <p className="text-xs text-maya-gray-soft mt-0.5">Painel Profissional</p>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1" aria-label="Fechar menu">
            <X className="h-5 w-5 text-maya-gray-soft" />
          </button>
        </div>

        {/* Links de navegação */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {adminLinks.map((link) => {
            // Verifica se esse link é a página atual (pra destacar em azul)
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)} // fecha o menu mobile ao clicar
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-maya text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-maya-teal/10 text-maya-teal-dark shadow-sm'      // link ativo
                    : 'text-maya-gray-soft hover:bg-gray-50 hover:text-maya-dark' // link normal
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Rodapé: dados do usuário logado + botão de sair */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 mb-3">
            {/* Avatar com a primeira letra do nome */}
            <div className="w-8 h-8 rounded-full bg-maya-teal/20 flex items-center justify-center">
              <span className="text-sm font-bold text-maya-teal-dark">
                {user?.nome?.charAt(0) || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-maya-dark truncate">{user?.nome}</p>
              <p className="text-xs text-maya-gray-soft truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-maya text-sm text-maya-coral hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
