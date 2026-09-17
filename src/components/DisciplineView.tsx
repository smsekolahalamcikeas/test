import React, { useState } from 'react';
import { DisciplineRecord, Student } from '../types';
import { DISCIPLINE_RULES } from '../data/mockData';
import { storage } from '../services/storage';
import {
  ShieldAlert,
  Plus,
  Search,
  BookOpen,
  Edit2,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';
import { useToast } from './Toast';
import { ConfirmModal } from './ConfirmModal';

interface DisciplineViewProps {
  students: Student[];
  disciplineRecords: DisciplineRecord[];
  onRefresh: () => void;
}

export const DisciplineView: React.FC<DisciplineViewProps> = ({
  students,
  disciplineRecords,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<DisciplineRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<DisciplineRecord | null>(null);

  const filteredRecords = disciplineRecords.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.studentName.toLowerCase().includes(q) ||
      r.jenisPelanggaran.toLowerCase().includes(q) ||
      r.guruPencatat.toLowerCase().includes(q) ||
      r.kelas.toLowerCase().includes(q);
    const matchesKategori = !filterKategori || r.kategori === filterKategori;
    return matchesSearch && matchesKategori;
  });

  const handleOpenAdd = () => {
    setRecordToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: DisciplineRecord) => {
    setRecordToEdit(rec);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    storage.deleteDisciplineRecord(recordToDelete.id);
    showToast('Log Dihapus', `Catatan pelanggaran ${recordToDelete.jenisPelanggaran} berhasil dihapus.`, 'success');
    setRecordToDelete(null);
    onRefresh();
  };

  return (
    <div id="discipline-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Modul Kedisiplinan & Log Pelanggaran Tata Tertib
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Akumulasi kalkulasi poin sanksi otomatis, katalog tata tertib sekolah, dan catatan evaluasi konseling Guru BK.
          </p>
        </div>
        <button
          id="btn-add-discipline"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Pelanggaran</span>
        </button>
      </div>

      {/* Sanction Guide Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900">
          <span className="font-bold block">0 - 10 Poin</span>
          <span className="text-[11px] text-emerald-700">Status Aman</span>
        </div>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
          <span className="font-bold block">11 - 25 Poin</span>
          <span className="text-[11px] text-blue-700">Peringatan Lisan</span>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
          <span className="font-bold block">26 - 50 Poin</span>
          <span className="text-[11px] text-amber-700">Panggilan Ortu I</span>
        </div>
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-orange-900">
          <span className="font-bold block">51 - 75 Poin</span>
          <span className="text-[11px] text-orange-700">Panggilan Ortu II / SP</span>
        </div>
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 col-span-2 sm:col-span-1">
          <span className="font-bold block">&gt; 75 Poin</span>
          <span className="text-[11px] text-rose-700 font-bold">Skorsing / Sidang</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari siswa, pelanggaran, guru pencatat, atau kelas..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
          />
        </div>
        <select
          value={filterKategori}
          onChange={e => setFilterKategori(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500/30"
        >
          <option value="">Semua Kategori</option>
          <option value="Ringan">Ringan (+5 s.d. +15 Poin)</option>
          <option value="Sedang">Sedang (+20 s.d. +40 Poin)</option>
          <option value="Berat">Berat (+50 s.d. +100 Poin)</option>
        </select>
      </div>

      {/* List of Violation Records */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm">Tidak ada catatan pelanggaran yang cocok.</p>
          </div>
        ) : (
          filteredRecords.map(rec => {
            const studentTotal = storage.getStudentTotalDisciplinePoints(rec.studentId);
            const sanction = storage.getSanctionLevel(studentTotal);

            return (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 hover:border-rose-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                        rec.kategori === 'Berat'
                          ? 'bg-red-600 text-white'
                          : rec.kategori === 'Sedang'
                          ? 'bg-orange-500 text-white'
                          : 'bg-amber-100 text-amber-900 font-bold'
                      }`}
                    >
                      Kategori: {rec.kategori}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{rec.tanggalKejadian}</span>
                    <span className="text-xs text-slate-400 font-semibold">&bull; Lokasi: {rec.lokasi}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    {rec.jenisPelanggaran}
                  </h3>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span>
                      Siswa: <strong>{rec.studentName}</strong> ({rec.kelas})
                    </span>
                    <span>&bull;</span>
                    <span>
                      Pencatat: <em>{rec.guruPencatat}</em>
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1 text-slate-700">
                    <p>
                      <strong>Tindakan Langsung:</strong> {rec.tindakanLangsung}
                    </p>
                    {rec.catatanKonseling && (
                      <p className="text-slate-500 italic">
                        <strong>Catatan Konseling BK:</strong> "{rec.catatanKonseling}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Points & Sanction */}
                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center shrink-0 gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Poin Kasus
                    </span>
                    <span className="text-2xl font-black text-rose-600 font-mono">
                      +{rec.poin}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${sanction.badgeColor}`}>
                      Akumulasi: {studentTotal} Poin ({sanction.level})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <button
                      onClick={() => handleOpenEdit(rec)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg text-xs"
                      title="Edit Log"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setRecordToDelete(rec)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                      title="Hapus Log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Catat Pelanggaran */}
      {isModalOpen && (
        <DisciplineModalForm
          students={students}
          initialData={recordToEdit}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            onRefresh();
          }}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {recordToDelete && (
        <ConfirmModal
          isOpen={!!recordToDelete}
          title="Hapus Catatan Pelanggaran"
          message={`Apakah Anda yakin ingin menghapus catatan pelanggaran "${recordToDelete.jenisPelanggaran}" untuk siswa ${recordToDelete.studentName}? Poin sanksi siswa akan otomatis dikurangi.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setRecordToDelete(null)}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// SUB-KOMPONEN: MODAL FORM PENCATATAN KEDISIPLINAN
// -------------------------------------------------------------
interface DisciplineModalFormProps {
  students: Student[];
  initialData: DisciplineRecord | null;
  onClose: () => void;
  onSaved: () => void;
}

const DisciplineModalForm: React.FC<DisciplineModalFormProps> = ({
  students,
  initialData,
  onClose,
  onSaved
}) => {
  const { showToast } = useToast();
  const currentUser = storage.getCurrentUser();

  const [selectedStudentId, setSelectedStudentId] = useState(
    initialData?.studentId || (students[0]?.id || '')
  );
  const [selectedRuleId, setSelectedRuleId] = useState('');
  const [tanggalKejadian, setTanggalKejadian] = useState(
    initialData?.tanggalKejadian || new Date().toISOString().slice(0, 10)
  );
  const [jenisPelanggaran, setJenisPelanggaran] = useState(
    initialData?.jenisPelanggaran || DISCIPLINE_RULES[0].namaPelanggaran
  );
  const [kategori, setKategori] = useState<DisciplineRecord['kategori']>(
    initialData?.kategori || 'Ringan'
  );
  const [poin, setPoin] = useState<number>(initialData?.poin || 5);
  const [lokasi, setLokasi] = useState(initialData?.lokasi || 'Lingkungan Sekolah');
  const [guruPencatat, setGuruPencatat] = useState(
    initialData?.guruPencatat || currentUser.name
  );
  const [tindakanLangsung, setTindakanLangsung] = useState(
    initialData?.tindakanLangsung || 'Teguran lisan dan pembinaan oleh guru piket.'
  );
  const [statusPenanganan, setStatusPenanganan] = useState(
    initialData?.statusPenanganan || ('Dalam Pembinaan' as any)
  );
  const [catatanKonseling, setCatatanKonseling] = useState(
    initialData?.catatanKonseling || ''
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Jika memilih dari katalog tata tertib, otomatis isi kategori dan poin default
  const handleSelectRule = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    const rule = DISCIPLINE_RULES.find(r => r.id === ruleId);
    if (rule) {
      setJenisPelanggaran(rule.namaPelanggaran);
      setKategori(rule.kategori);
      setPoin(rule.poinDefault);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Pilih siswa terlebih dahulu!');
      return;
    }

    storage.saveDisciplineRecord({
      id: initialData?.id,
      studentId: selectedStudent.id,
      studentName: selectedStudent.namaLengkap,
      kelas: selectedStudent.kelas,
      tanggalKejadian,
      jenisPelanggaran,
      kategori,
      poin: Number(poin),
      lokasi,
      guruPencatat,
      tindakanLangsung,
      statusPenanganan,
      catatanKonseling
    });

    showToast(
      'Pelanggaran Dicatat',
      `Penambahan +${poin} poin pelanggaran untuk ${selectedStudent.namaLengkap} berhasil dicatat.`,
      'success'
    );
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-rose-950 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              {initialData ? 'Ubah Catatan Pelanggaran' : 'Pencatatan Pelanggaran Tata Tertib'}
            </h3>
            <p className="text-xs text-rose-200 mt-0.5">
              Poin akan diakumulasikan ke database kedisiplinan siswa secara otomatis.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-rose-200 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa Terlapor</label>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                disabled={!!initialData}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-semibold"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.namaLengkap} ({s.kelas})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Kejadian</label>
              <input
                type="date"
                value={tanggalKejadian}
                onChange={e => setTanggalKejadian(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          {/* Quick Select From Rules Catalog */}
          <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 space-y-2">
            <label className="block font-bold text-rose-950 text-xs">
              Pilih Cepat dari Katalog Tata Tertib Sekolah:
            </label>
            <select
              value={selectedRuleId}
              onChange={e => handleSelectRule(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl bg-white text-xs"
            >
              <option value="">-- Pilih Jenis Pelanggaran Baku --</option>
              {DISCIPLINE_RULES.map(rule => (
                <option key={rule.id} value={rule.id}>
                  [{rule.kategori}] {rule.namaPelanggaran} (+{rule.poinDefault} Poin)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Nama / Uraian Pelanggaran</label>
              <input
                type="text"
                value={jenisPelanggaran}
                onChange={e => setJenisPelanggaran(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Poin Sanksi</label>
              <input
                type="number"
                min={1}
                max={100}
                value={poin}
                onChange={e => setPoin(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-rose-600"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kategori Pelanggaran</label>
              <select
                value={kategori}
                onChange={e => setKategori(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="Ringan">Ringan (5 - 15 Poin)</option>
                <option value="Sedang">Sedang (20 - 40 Poin)</option>
                <option value="Berat">Berat (50 - 100 Poin)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lokasi Kejadian</label>
              <input
                type="text"
                value={lokasi}
                onChange={e => setLokasi(e.target.value)}
                placeholder="Misal: Kelas, Kantin, Lapangan, Gerbang"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Guru / Staf Pencatat</label>
              <input
                type="text"
                value={guruPencatat}
                onChange={e => setGuruPencatat(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Status Penanganan</label>
              <select
                value={statusPenanganan}
                onChange={e => setStatusPenanganan(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="Dalam Pembinaan">Dalam Pembinaan</option>
                <option value="Panggilan Orang Tua">Panggilan Orang Tua</option>
                <option value="Surat Peringatan">Surat Peringatan</option>
                <option value="Selesai Dibina">Selesai Dibina</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tindakan Langsung di Tempat</label>
            <input
              type="text"
              value={tindakanLangsung}
              onChange={e => setTindakanLangsung(e.target.value)}
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Konseling / Rencana Pembinaan BK</label>
            <textarea
              rows={2}
              value={catatanKonseling}
              onChange={e => setCatatanKonseling(e.target.value)}
              placeholder="Catat hasil klarifikasi dengan siswa, alasan pelanggaran, dan komitmen..."
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-xs"
            >
              Simpan Catatan Pelanggaran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
