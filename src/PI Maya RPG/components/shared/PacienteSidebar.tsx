'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Home, Dumbbell, History, UserCircle, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const pacienteLinks = [
  { href: '/inicio', label: 'Início', icon: Home },
  { href: '/meus-exercicios', label: 'Meus Exercícios', icon: Dumbbell },
  { href: '/historico', label: 'Histórico', icon: History },
  { href: '/perfil', label: 'Perfil', icon: UserCircle },
];

export function PacienteSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Bottom navigation mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 lg:hidden">
        <div className="flex items-center justify-around py-2">
          {pacienteLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-colors',
                  isActive ? 'text-maya-teal-dark' : 'text-maya-gray-soft'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="font-display text-xl font-bold text-maya-teal-dark">Maya RPG</h1>
          <p className="text-xs text-maya-gray-soft mt-0.5">Portal do Paciente</p>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {pacienteLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-maya text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-maya-teal/10 text-maya-teal-dark shadow-sm'
                    : 'text-maya-gray-soft hover:bg-gray-50 hover:text-maya-dark'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-maya-coral/20 flex items-center justify-center">
              <span className="text-sm font-bold text-maya-coral">
                {user?.nome?.charAt(0) || '?'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-maya-dark truncate">{user?.nome}</p>
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
