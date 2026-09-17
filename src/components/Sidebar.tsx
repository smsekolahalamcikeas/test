import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Trophy,
  AlertTriangle,
  BrainCircuit,
  Compass,
  History,
  FileSpreadsheet,
  RotateCcw,
  ShieldAlert
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'students'
  | 'academics'
  | 'achievements'
  | 'discipline'
  | 'talent'
  | 'pathway'
  | 'audit';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  studentCount: number;
  atRiskCount: number;
  onExportAll: () => void;
  onResetData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  userRole,
  studentCount,
  atRiskCount,
  onExportAll,
  onResetData
}) => {
  const menuItems: {
    id: NavTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Beranda Sistem',
      description: 'Ringkasan eksekutif & KPI',
      icon: LayoutDashboard
    },
    {
      id: 'students',
      label: 'Profil & Arsip Siswa',
      description: 'Biodata lengkap & berkas digital',
      icon: Users,
      badge: studentCount,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'academics',
      label: 'Rekam Akademik',
      description: 'Nilai rapor semester & peringkat',
      icon: GraduationCap
    },
    {
      id: 'achievements',
      label: 'Buku Induk Prestasi',
      description: 'Piagam juara & rekor talenta',
      icon: Trophy
    },
    {
      id: 'discipline',
      label: 'Log Kedisiplinan',
      description: 'Pelanggaran & poin tata tertib',
      icon: AlertTriangle,
      badge: atRiskCount > 0 ? `${atRiskCount} Kasus` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold'
    },
    {
      id: 'talent',
      label: 'Asesmen Bakat Minat',
      description: 'Psikotes IQ & Holland RIASEC',
      icon: BrainCircuit
    },
    {
      id: 'pathway',
      label: 'Analitik Studi Lanjut',
      description: 'Prediksi kelulusan SNBP/SNBT',
      icon: Compass
    },
    {
      id: 'audit',
      label: 'Audit Trail Sistem',
      description: 'Rekam jejak setiap perubahan',
      icon: History
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="desktop-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200/80 shadow-xs flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Menu Utama Modul
            </span>
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  onTabChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-[#0f2b5c] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-semibold text-xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  />
                  <div className="truncate">
                    <span className="text-xs block leading-tight truncate">
                      {item.label}
                    </span>
                    <span
                      className={`text-[10px] block leading-tight truncate ${
                        isActive ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {item.description}
                    </span>
                  </div>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold shrink-0 ml-1 ${
                      isActive ? 'bg-amber-400 text-blue-950' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Utility Tools: Export Database to Excel & Reset Demo */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2">
          <button
            id="btn-sidebar-export-excel"
            onClick={onExportAll}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95"
            title="Ekspor seluruh basis data ke berkas Excel (.xlsx) dengan 5 sheet terpisah"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Master Excel</span>
          </button>

          <button
            onClick={onResetData}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
            title="Kembalikan data percontohan SMA"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang Data Sampel</span>
          </button>
        </div>
      </aside>
    </>
  );
};
