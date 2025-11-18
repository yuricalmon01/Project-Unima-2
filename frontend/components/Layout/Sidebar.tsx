'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  LogOut,
  Stethoscope,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [];

  // Menu para todos os usuários autenticados
  menuItems.push({
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  });

  // Menu apenas para Admin, Doctor, Nurse, Receptionist (não para Patient)
  if (user?.userType && user.userType !== 'Patient') {
    menuItems.push(
      {
        label: 'Pacientes',
        href: '/pacientes',
        icon: Stethoscope,
      },
      {
        label: 'Novo Paciente',
        href: '/pacientes/novo',
        icon: UserPlus,
      }
    );
  }

  // Menu apenas para Admin
  if (user?.userType === 'Admin') {
    menuItems.push(
      {
        label: 'Usuários',
        href: '/usuarios',
        icon: Users,
      },
      {
        label: 'Novo Usuário',
        href: '/usuarios/novo',
        icon: UserPlus,
      }
    );
  }

  return (
    <div className="hidden md:flex w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">UNIMA Saúde</h1>
        <p className="text-sm text-gray-500 mt-1">Sistema de Gestão</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
}

