import React from 'react';
import {
  Users,
  GraduationCap,
  Trophy,
  ShieldAlert,
  UserPlus,
  FileCheck2,
  TrendingUp,
  Award,
  AlertCircle,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { Student, AcademicRecord, Achievement, DisciplineRecord, AuditLog } from '../types';
import { storage } from '../services/storage';

interface DashboardViewProps {
  students: Student[];
  academicRecords: AcademicRecord[];
  achievements: Achievement[];
  disciplineRecords: DisciplineRecord[];
  auditLogs: AuditLog[];
  onNavigate: (tab: any) => void;
  onOpenAddStudent: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  academicRecords,
  achievements,
  disciplineRecords,
  auditLogs,
  onNavigate,
  onOpenAddStudent
}) => {
  // Hitung metrik
  const activeStudents = students.filter(s => s.statusSiswa === 'Aktif');
  const maleCount = activeStudents.filter(s => s.jenisKelamin === 'L').length;
  const femaleCount = activeStudents.filter(s => s.jenisKelamin === 'P').length;

  const totalScores = academicRecords.reduce((sum, item) => sum + (item.rataRataNilai || 0), 0);
  const avgAcademicScore = academicRecords.length > 0 ? (totalScores / academicRecords.length).toFixed(1) : '0.0';

  const totalPoints = disciplineRecords.reduce((sum, item) => sum + (item.poin || 0), 0);

  // Prestasi tingkat tinggi (Provinsi / Nasional / Internasional)
  const highTierAchievements = achievements.filter(a =>
    ['Provinsi', 'Nasional', 'Internasional'].includes(a.tingkat)
  ).length;

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0f2b5c] to-blue-900 text-white p-6 rounded-2xl shadow-lg border border-blue-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-800/60 text-amber-300 text-xs font-semibold mb-2 border border-blue-700/50">
              <SchoolBadge /> Sistem Informasi Database Siswa Terpadu SMA
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang di Portal SIDATA
            </h1>
            <p className="text-blue-100/90 text-sm mt-1 max-w-2xl leading-relaxed">
              Pusat komando arsip digital profil siswa, rekam jejak akademik, perolehan prestasi, log kedisiplinan, dan pemetaan bakat minat terintegrasi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <button
              id="btn-quick-add-student"
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Tambah Siswa Baru</span>
            </button>
            <button
              id="btn-quick-academic"
              onClick={() => onNavigate('academic')}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-blue-800/80 hover:bg-blue-700/80 text-white text-xs sm:text-sm font-semibold rounded-xl border border-blue-600/40 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Input Nilai</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Siswa Aktif */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Siswa Aktif
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{activeStudents.length}</span>
            <span className="text-xs text-slate-500 font-medium">Siswa terdaftar</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px]">
              {maleCount} L
            </span>
            <span className="inline-block px-1.5 py-0.5 bg-pink-100 text-pink-800 rounded font-semibold text-[11px]">
              {femaleCount} P
            </span>
            <span className="text-slate-400 ml-auto flex items-center">
              Detail <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 2: Rata-rata Nilai Akademik */}
        <div
          onClick={() => onNavigate('academic')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Rata-rata Akademik
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{avgAcademicScore}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Skala 100
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{academicRecords.length} Rapor Semester</span>
            <span className="text-slate-400 flex items-center">
              Lihat Rapor <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 3: Prestasi Kejuaraan */}
        <div
          onClick={() => onNavigate('achievements')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Prestasi Kejuaraan
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{achievements.length}</span>
            <span className="text-xs text-amber-600 font-semibold">Tercatat</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{highTierAchievements} Tingkat Prov/Nasional</span>
            <span className="text-slate-400 flex items-center">
              Detail <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Card 4: Log Kedisiplinan & Poin */}
        <div
          onClick={() => onNavigate('discipline')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pelanggaran & Poin
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">{totalPoints}</span>
            <span className="text-xs text-slate-500 font-medium">Akumulasi Poin</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>{disciplineRecords.length} Kasus Tercatat</span>
            <span className="text-slate-400 flex items-center">
              Evaluasi BK <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Grafik Tren Nilai & Sebaran Jurusan */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual Tren Nilai Per Semester */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  Rata-Rata Capaian Nilai Akademik Siswa
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribusi rata-rata nilai semester berdasarkan sampel rekap siswa
                </p>
              </div>
              <button
                onClick={() => onNavigate('academic')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
              >
                Buka Modul Akademik &rarr;
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {academicRecords.slice(0, 4).map(rec => {
                const percentage = Math.min(Math.max((rec.rataRataNilai / 100) * 100, 0), 100);
                return (
                  <div key={rec.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="font-semibold text-slate-800 flex items-center gap-2">
                        <span>{rec.studentName}</span>
                        <span className="text-slate-400 font-normal">({rec.kelas} &bull; Sem {rec.semester})</span>
                      </div>
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                        {rec.rataRataNilai} / 100
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Jurusan & Jalur Masuk Badge Summary */}
            <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Peminatan MIPA</span>
                <span className="text-lg font-bold text-slate-800">
                  {students.filter(s => s.jurusan === 'MIPA').length} Siswa
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Peminatan IPS</span>
                <span className="text-lg font-bold text-slate-800">
                  {students.filter(s => s.jurusan === 'IPS').length} Siswa
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Fase E (Umum)</span>
                <span className="text-lg font-bold text-slate-800">
                  {students.filter(s => s.jurusan === 'Fase E (Umum)').length} Siswa
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium block">Jalur Prestasi</span>
                <span className="text-lg font-bold text-emerald-700">
                  {students.filter(s => s.jalurMasuk === 'Prestasi').length} Siswa
                </span>
              </div>
            </div>
          </div>

          {/* Rekap Prestasi Terbaru */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Prestasi & Kejuaraan Terkini Siswa
              </h3>
              <button
                onClick={() => onNavigate('achievements')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Lihat Semua ({achievements.length}) &rarr;
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {achievements.slice(0, 3).map(ach => (
                <div key={ach.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-600 font-bold text-xs shrink-0 mt-0.5">
                      {ach.peringkat}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 leading-snug">
                        {ach.namaLomba}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ach.studentName} ({ach.kelas}) &bull; Tingkat {ach.tingkat}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{ach.tanggalPerolehan}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Rekap Kedisiplinan & Audit Trail Preview */}
        <div className="space-y-6">
          {/* Card: Status Kedisiplinan Siswa Terkini */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" />
                Pelanggaran Terkini
              </h3>
              <button
                onClick={() => onNavigate('discipline')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
              >
                Buku BK &rarr;
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {disciplineRecords.slice(0, 3).map(disc => (
                <div
                  key={disc.id}
                  className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{disc.studentName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-600 text-white">
                      +{disc.poin} Poin
                    </span>
                  </div>
                  <p className="text-xs text-rose-900 font-medium leading-relaxed">
                    {disc.jenisPelanggaran}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>{disc.kelas} &bull; {disc.lokasi}</span>
                    <span className="italic">{disc.statusPenanganan}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Log Aktivitas Sistem (Audit Trail) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                Aktivitas Sistem Terkini
              </h3>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Audit Log &rarr;
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {auditLogs.slice(0, 4).map(log => (
                <div key={log.id} className="text-xs space-y-1 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800">{log.userName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.timestamp.split(' ')[1]}</span>
                  </div>
                  <p className="text-slate-600 leading-snug">{log.description}</p>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                    {log.module} &bull; {log.action}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function SchoolBadge() {
  return (
    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
  );
}
