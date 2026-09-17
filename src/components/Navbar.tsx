import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEFAULT_USERS } from '../data/mockData';
import { storage } from '../services/storage';
import {
  GraduationCap,
  Clock,
  Database,
  UserCheck,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentUser: User;
  onUserChange: (user: User) => void;
  onOpenGasModal: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onUserChange,
  onOpenGasModal,
  onToggleSidebar,
  isSidebarOpen
}) => {
  const [wibTime, setWibTime] = useState<string>('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const gasUrl = storage.getGasUrl();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', {
        timeZone: 'Asia/Jakarta',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour12: false
      });
      setWibTime(`${dateStr} • ${timeStr} WIB`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-30 bg-[#0f2b5c] text-white border-b border-blue-900 shadow-md backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-blue-800/60 lg:hidden transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-200 text-blue-950 flex items-center justify-center font-extrabold shadow-inner shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                    SIDATA <span className="text-amber-400 font-extrabold">SMA</span>
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-800 text-blue-200 border border-blue-700">
                    KEMDIKBUD
                  </span>
                </div>
                <p className="text-[10px] sm:text-xs text-blue-200/80 line-clamp-1">
                  Sistem Informasi Database Siswa Terpadu SMA Negeri 1
                </p>
              </div>
            </div>
          </div>

          {/* Center Clock (WIB) */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-950/60 border border-blue-800/60 text-xs text-blue-200 font-mono">
            <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{wibTime}</span>
          </div>

          {/* Right Controls: GAS Status & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* GAS Integration Status Button */}
            <button
              id="btn-gas-config"
              onClick={onOpenGasModal}
              title="Konfigurasi Integrasi Google Apps Script & Google Drive"
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                gasUrl
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/90'
                  : 'bg-blue-900/70 border-blue-700/60 text-blue-200 hover:bg-blue-800/80'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">
                {gasUrl ? 'GAS Terhubung' : 'Integrasi GAS'}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  gasUrl ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'
                }`}
              />
            </button>

            {/* Role Switcher */}
            <div className="relative">
              <button
                id="btn-user-role-menu"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-blue-900/80 hover:bg-blue-800 text-white border border-blue-700/60 text-xs font-medium transition-all"
              >
                <img
                  src={currentUser.avatarUrl || 'https://via.placeholder.com/32'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-amber-400/60"
                />
                <div className="hidden lg:block text-left">
                  <div className="font-bold text-xs leading-none truncate max-w-[120px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-amber-300 mt-0.5 leading-none">
                    {currentUser.roleTitle}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
              </button>

              {/* Role Dropdown Menu */}
              {isRoleDropdownOpen && (
                <div
                  id="user-role-dropdown"
                  className="absolute right-0 mt-2 w-72 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95"
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Ganti Peran Pengguna (Simulasi Hak Akses)
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Beralih antar peran untuk menguji hak akses sistem:
                    </p>
                  </div>

                  <div className="py-1 space-y-1">
                    {DEFAULT_USERS.map(user => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onUserChange(user);
                          storage.setCurrentUser(user);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors ${
                          currentUser.id === user.id
                            ? 'bg-blue-50 text-blue-900 border border-blue-200/80 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-8 h-8 rounded-lg object-cover mt-0.5 ring-1 ring-slate-300"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold leading-snug flex items-center justify-between">
                            <span className="truncate">{user.name}</span>
                            {currentUser.id === user.id && (
                              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                            )}
                          </div>
                          <div className="text-[11px] text-blue-700 font-medium">
                            {user.roleTitle}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            NIP: {user.nip || '-'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 px-3 py-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Role-based Access Control
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
