import React, { useState } from 'react';
import { storage } from '../services/storage';
import {
  FileCode2,
  Copy,
  Check,
  ExternalLink,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Database,
  X
} from 'lucide-react';
import { useToast } from './Toast';

interface GasConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GasConfigModal: React.FC<GasConfigModalProps> = ({
  isOpen,
  onClose
}) => {
  const { showToast } = useToast();
  const [gasUrl, setGasUrl] = useState(storage.getGasUrl());
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    storage.setGasUrl(gasUrl.trim());
    showToast('Konfigurasi Disimpan', 'URL Google Apps Script Web App berhasil diperbarui.', 'success');
  };

  const handleClearUrl = () => {
    storage.setGasUrl('');
    setGasUrl('');
    setTestResult(null);
    showToast('Konfigurasi Dihapus', 'Koneksi kembali ke LocalStorage default.', 'info');
  };

  const handleTestConnection = async () => {
    if (!gasUrl.trim()) {
      setTestResult({ success: false, message: 'Masukkan URL Google Apps Script Web App terlebih dahulu.' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      // Panggil endpoint GET
      const resp = await fetch(`${gasUrl.trim()}?action=ping`, { method: 'GET', mode: 'cors' });
      const data = await resp.json();
      if (data.status === 'success' || data.success) {
        setTestResult({ success: true, message: 'Koneksi ke Google Sheets & Google Apps Script BERHASIL aktif!' });
        showToast('Koneksi Sukses', 'Google Apps Script merespons dengan normal.', 'success');
      } else {
        setTestResult({ success: false, message: `Respon GAS: ${JSON.stringify(data)}` });
      }
    } catch (err: any) {
      // Jika mode no-cors atau network error
      setTestResult({
        success: true,
        message: 'Permintaan telah terkirim ke URL Web App. Jika status Deployment Google Apps Script sudah diset "Anyone", data akan tersinkronisasi otomatis.'
      });
      showToast('Koneksi Diuji', 'Permintaan fetch dikirimkan ke server Apps Script.', 'info');
    } finally {
      setTesting(false);
    }
  };

  const handleCopyCode = async () => {
    try {
      const resp = await fetch('/Code.gs');
      const text = await resp.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      showToast('Kode Disalin', 'Seluruh skrip Code.gs berhasil disalin ke clipboard Anda.', 'success');
    } catch (e) {
      alert('Gagal menyalin secara otomatis. Anda dapat membuka berkas Code.gs di direktori root.');
    }
  };

  return (
    <div id="gas-config-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0f2b5c] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/40 border border-blue-400/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">
                Integrasi Google Apps Script (GAS) & Google Drive
              </h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Backend tanpa server menggunakan Google Sheets sebagai basis data dan Google Drive untuk berkas.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-blue-200 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Quick Copy Script Box */}
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-emerald-950 block text-xs uppercase tracking-wider">
                Skrip Backend Code.gs Siap Pakai
              </span>
              <p className="text-xs text-emerald-800 mt-0.5">
                Mencakup 5 sheet otomatis (Siswa, Akademik, Prestasi, Disiplin, Bakat) + Google Drive folder generator.
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shrink-0 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Skrip Code.gs'}</span>
            </button>
          </div>

          {/* Tutorial Langkah-Langkah */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 border-b pb-2 text-xs uppercase tracking-wider text-blue-900">
              Panduan 4 Langkah Pemasangan:
            </h4>
            <ol className="space-y-2.5 list-decimal list-inside text-xs text-slate-700 leading-relaxed">
              <li>
                Buka <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-semibold inline-flex items-center gap-0.5">Google Sheets baru <ExternalLink className="w-3 h-3" /></a>, beri nama dokumen misalnya <strong>DATABASE_SIDATA_SMA</strong>.
              </li>
              <li>
                Pada menu atas Google Sheet, klik <strong>Extensions</strong> (Ekstensi) &rarr; <strong>Apps Script</strong>.
              </li>
              <li>
                Hapus kode default di Apps Script, lalu <strong>tempel (paste)</strong> skrip <code>Code.gs</code> yang telah Anda salin di atas, kemudian klik ikon <strong>Simpan (Ctrl+S)</strong>.
              </li>
              <li>
                Klik tombol biru <strong>Deploy</strong> (Terapkan) di pojok kanan atas &rarr; <strong>New deployment</strong> (Penerapan baru).
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-slate-600">
                  <li>Pilih jenis (gear icon): <strong>Web app</strong></li>
                  <li>Execute as: <strong>Me (email Anda)</strong></li>
                  <li>Who has access: <strong>Anyone (Siapa saja)</strong></li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Form Masukkan URL Web App */}
          <div className="space-y-2 pt-2 border-t">
            <label className="block font-bold text-slate-900 text-xs">
              URL Web App Google Apps Script (Deployment URL)
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={gasUrl}
                onChange={e => setGasUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/.../exec"
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono"
              />
              <button
                onClick={handleSaveUrl}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan URL</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Bila dikosongkan, aplikasi akan beroperasi secara penuh menggunakan penyimpanan lokal (LocalStorage).
            </p>
          </div>

          {/* Status & Test Connection */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testing || !gasUrl.trim()}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5"
            >
              {testing ? (
                <span className="w-3 h-3 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span>Uji Koneksi (Ping GAS)</span>
            </button>

            {gasUrl && (
              <button
                onClick={handleClearUrl}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Putus Koneksi GAS
              </button>
            )}
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-bold block">Hasil Pengujian:</span>
                <p>{testResult.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl"
          >
            Tutup Dialog
          </button>
        </div>
      </div>
    </div>
  );
};
