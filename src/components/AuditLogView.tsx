import React, { useState } from 'react';
import { AuditLog } from '../types';
import {
  History,
  Search,
  Download,
  Filter,
  Trash2,
  Clock,
  User,
  Activity
} from 'lucide-react';
import { storage } from '../services/storage';
import { useToast } from './Toast';

interface AuditLogViewProps {
  auditLogs: AuditLog[];
  onRefresh: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  auditLogs,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterModule, setFilterModule] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      log.userName.toLowerCase().includes(q) ||
      log.description.toLowerCase().includes(q) ||
      log.recordId?.toLowerCase().includes(q) ||
      log.action.toLowerCase().includes(q);
    const matchModule = !filterModule || log.module === filterModule;
    return matchSearch && matchModule;
  });

  const handleExportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sidata_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Ekspor Log', 'Catatan audit log berhasil diunduh dalam format JSON.', 'success');
  };

  return (
    <div id="audit-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-5 h-5 text-blue-600" />
            Audit Trail & Log Aktivitas Sistem
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Rekam jejak setiap tindakan penambahan, pengubahan, dan penghapusan data secara transparan dengan timestamp WIB.
          </p>
        </div>
        <button
          onClick={handleExportLogs}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Log (JSON)</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari pengguna, tindakan, ID data, deskripsi..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <select
          value={filterModule}
          onChange={e => setFilterModule(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="">Semua Modul</option>
          <option value="Profil">Profil Siswa</option>
          <option value="Akademik">Akademik</option>
          <option value="Prestasi">Prestasi</option>
          <option value="Kedisiplinan">Kedisiplinan</option>
          <option value="BakatMinat">Bakat Minat</option>
          <option value="Sistem">Sistem</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Waktu (WIB)</th>
                <th className="py-3.5 px-3">Pengguna</th>
                <th className="py-3.5 px-3">Modul</th>
                <th className="py-3.5 px-3">Aksi</th>
                <th className="py-3.5 px-4">Deskripsi Aktivitas</th>
                <th className="py-3.5 px-3">ID Rekaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                    Tidak ada log aktivitas yang cocok.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {log.module}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.action === 'HAPUS'
                            ? 'bg-rose-100 text-rose-700'
                            : log.action === 'TAMBAH'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs sm:max-w-md">
                      {log.description}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {log.recordId || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
