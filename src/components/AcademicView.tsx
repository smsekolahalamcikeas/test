import React, { useState } from 'react';
import { AcademicRecord, Student, SubjectScore } from '../types';
import { storage } from '../services/storage';
import {
  GraduationCap,
  Plus,
  Search,
  BookOpen,
  Edit2,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';
import { useToast } from './Toast';
import { ConfirmModal } from './ConfirmModal';

interface AcademicViewProps {
  students: Student[];
  academicRecords: AcademicRecord[];
  onRefresh: () => void;
}

export const AcademicView: React.FC<AcademicViewProps> = ({
  students,
  academicRecords,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSemester, setFilterSemester] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<AcademicRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<AcademicRecord | null>(null);

  const filteredRecords = academicRecords.filter(r => {
    const q = searchQuery.toLowerCase();
    const matchSearch = r.studentName.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q) || r.kelas.toLowerCase().includes(q);
    const matchSemester = !filterSemester || String(r.semester) === filterSemester;
    return matchSearch && matchSemester;
  });

  const handleOpenAdd = () => {
    setRecordToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rec: AcademicRecord) => {
    setRecordToEdit(rec);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete) return;
    storage.deleteAcademicRecord(recordToDelete.id);
    showToast('Nilai Dihapus', `Catatan nilai semester ${recordToDelete.semester} untuk ${recordToDelete.studentName} berhasil dihapus.`, 'success');
    setRecordToDelete(null);
    onRefresh();
  };

  return (
    <div id="academic-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            Modul Rekam Jejak Akademik & Nilai Rapor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pencatatan capaian kompetensi per mata pelajaran, kalkulasi rata-rata semester otomatis, dan integrasi Kurikulum Merdeka.
          </p>
        </div>
        <button
          id="btn-add-academic"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Input Nilai Semester</span>
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
            placeholder="Cari siswa atau kelas..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <select
          value={filterSemester}
          onChange={e => setFilterSemester(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="">Semua Semester</option>
          <option value="1">Semester 1 (Ganjil)</option>
          <option value="2">Semester 2 (Genap)</option>
          <option value="3">Semester 3 (Ganjil)</option>
          <option value="4">Semester 4 (Genap)</option>
          <option value="5">Semester 5 (Ganjil)</option>
          <option value="6">Semester 6 (Genap)</option>
        </select>
      </div>

      {/* Grid of Academic Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRecords.length === 0 ? (
          <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm">Belum ada rekap nilai akademik yang cocok.</p>
          </div>
        ) : (
          filteredRecords.map(rec => (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-blue-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      Semester {rec.semester}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{rec.tahunAjaran}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mt-1">{rec.studentName}</h3>
                  <p className="text-xs text-slate-500">
                    ID: {rec.studentId} &bull; Kelas: <strong>{rec.kelas}</strong> &bull; {rec.kurikulum}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                    Rata-rata Nilai
                  </span>
                  <span className="text-2xl font-black text-blue-900 font-mono">
                    {rec.rataRataNilai}
                  </span>
                </div>
              </div>

              {/* Daftar Nilai Mata Pelajaran */}
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Rincian Capaian Mata Pelajaran ({rec.mataPelajaran.length} Mapel)
                </p>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-slate-50/50">
                  {rec.mataPelajaran.map((mp, i) => (
                    <div key={i} className="px-3 py-2 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-slate-800 truncate block">{mp.namaMapel}</span>
                        <span className="text-[10px] text-slate-400">
                          Pengetahuan: {mp.nilaiPengetahuan} &bull; Keterampilan: {mp.nilaiKeterampilan} (KKM: {mp.kkm})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border">
                          {mp.nilaiAkhir}
                        </span>
                        <span
                          className={`w-6 text-center font-bold text-xs rounded py-0.5 ${
                            mp.predikat === 'A'
                              ? 'bg-emerald-100 text-emerald-800'
                              : mp.predikat === 'B'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {mp.predikat}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {rec.catatanAkademik && (
                <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-900 border border-blue-100">
                  <span className="font-bold block mb-0.5">Catatan Perkembangan Akademik:</span>
                  <p className="italic leading-relaxed">{rec.catatanAkademik}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span className="text-[11px] text-slate-400">
                  Ranking Kelas: <strong>{rec.rankingKelas ? `#${rec.rankingKelas}` : 'Belum dihitung'}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(rec)}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Nilai
                  </button>
                  <button
                    onClick={() => setRecordToDelete(rec)}
                    className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 font-semibold p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Input Nilai */}
      {isModalOpen && (
        <AcademicModalForm
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
          title="Hapus Catatan Nilai"
          message={`Hapus catatan rekap nilai semester ${recordToDelete.semester} siswa "${recordToDelete.studentName}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setRecordToDelete(null)}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// SUB-KOMPONEN: MODAL FORM INPUT NILAI AKADEMIK
// -------------------------------------------------------------
interface AcademicModalFormProps {
  students: Student[];
  initialData: AcademicRecord | null;
  onClose: () => void;
  onSaved: () => void;
}

const AcademicModalForm: React.FC<AcademicModalFormProps> = ({
  students,
  initialData,
  onClose,
  onSaved
}) => {
  const { showToast } = useToast();

  const [selectedStudentId, setSelectedStudentId] = useState(
    initialData?.studentId || (students[0]?.id || '')
  );
  const [semester, setSemester] = useState<number>(initialData?.semester || 1);
  const [tahunAjaran, setTahunAjaran] = useState(initialData?.tahunAjaran || '2024/2025');
  const [kurikulum, setKurikulum] = useState(initialData?.kurikulum || 'Kurikulum Merdeka');
  const [catatanAkademik, setCatatanAkademik] = useState(initialData?.catatanAkademik || '');
  const [rankingKelas, setRankingKelas] = useState(initialData?.rankingKelas || '');

  // Default daftar mapel jika baru
  const defaultSubjects: SubjectScore[] = [
    { namaMapel: 'Pendidikan Agama & Budi Pekerti', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 88, nilaiKeterampilan: 90, nilaiAkhir: 89, predikat: 'A' },
    { namaMapel: 'Pendidikan Pancasila', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 85, nilaiKeterampilan: 87, nilaiAkhir: 86, predikat: 'A' },
    { namaMapel: 'Bahasa Indonesia', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 89, nilaiKeterampilan: 90, nilaiAkhir: 89.5, predikat: 'A' },
    { namaMapel: 'Matematika', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 92, nilaiKeterampilan: 94, nilaiAkhir: 93, predikat: 'A' },
    { namaMapel: 'Bahasa Inggris', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 90, nilaiKeterampilan: 92, nilaiAkhir: 91, predikat: 'A' },
    { namaMapel: 'Informatika / Pemrograman', kategori: 'Peminatan', kkm: 75, nilaiPengetahuan: 95, nilaiKeterampilan: 96, nilaiAkhir: 95.5, predikat: 'A' }
  ];

  const [subjects, setSubjects] = useState<SubjectScore[]>(
    initialData?.mataPelajaran || defaultSubjects
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Update nilai subject dengan kalkulasi otomatis nilai akhir dan predikat
  const updateSubject = (index: number, field: keyof SubjectScore, value: any) => {
    const updated = [...subjects];
    const current = { ...updated[index], [field]: value };

    if (field === 'nilaiPengetahuan' || field === 'nilaiKeterampilan') {
      const p = field === 'nilaiPengetahuan' ? Number(value) : current.nilaiPengetahuan;
      const k = field === 'nilaiKeterampilan' ? Number(value) : current.nilaiKeterampilan;
      const akhir = Number(((p + k) / 2).toFixed(1));
      current.nilaiAkhir = akhir;

      // Hitung predikat
      if (akhir >= 88) current.predikat = 'A';
      else if (akhir >= 78) current.predikat = 'B';
      else if (akhir >= 70) current.predikat = 'C';
      else current.predikat = 'D';
    }

    updated[index] = current;
    setSubjects(updated);
  };

  const handleAddSubjectRow = () => {
    setSubjects([
      ...subjects,
      {
        namaMapel: 'Mata Pelajaran Tambahan',
        kategori: 'Peminatan',
        kkm: 75,
        nilaiPengetahuan: 80,
        nilaiKeterampilan: 80,
        nilaiAkhir: 80,
        predikat: 'B'
      }
    ]);
  };

  const handleRemoveSubjectRow = (index: number) => {
    if (subjects.length <= 1) return;
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Pilih siswa terlebih dahulu!');
      return;
    }

    storage.saveAcademicRecord({
      id: initialData?.id,
      studentId: selectedStudent.id,
      studentName: selectedStudent.namaLengkap,
      kelas: selectedStudent.kelas,
      semester: Number(semester) as any,
      tahunAjaran,
      kurikulum: kurikulum as any,
      mataPelajaran: subjects,
      rankingKelas: rankingKelas ? Number(rankingKelas) : undefined,
      catatanAkademik
    });

    showToast('Nilai Disimpan', `Rapor semester ${semester} untuk ${selectedStudent.namaLengkap} berhasil disimpan.`, 'success');
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-[#0f2b5c] text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              {initialData ? 'Ubah Rekap Nilai Akademik' : 'Input Rekap Nilai Semester Siswa'}
            </h3>
            <p className="text-xs text-blue-200 mt-0.5">
              Nilai akhir dan predikat akan dikalkulasi otomatis.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-blue-200 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa</label>
              <select
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
                disabled={!!initialData}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 font-semibold"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.namaLengkap} ({s.kelas} - {s.nisn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Semester</label>
              <select
                value={semester}
                onChange={e => setSemester(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl"
              >
                {[1, 2, 3, 4, 5, 6].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran</label>
              <input
                type="text"
                value={tahunAjaran}
                onChange={e => setTahunAjaran(e.target.value)}
                placeholder="Contoh: 2024/2025"
                className="w-full px-3 py-2 border rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Kurikulum</label>
              <select
                value={kurikulum}
                onChange={e => setKurikulum(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="Kurikulum Merdeka">Kurikulum Merdeka</option>
                <option value="Kurikulum 2013">Kurikulum 2013 (K13)</option>
              </select>
            </div>
          </div>

          {/* Rincian Nilai Mapel */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900">Daftar Nilai Mata Pelajaran</span>
              <button
                type="button"
                onClick={handleAddSubjectRow}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Mapel
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {subjects.map((mp, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-2 text-xs">
                  <input
                    type="text"
                    value={mp.namaMapel}
                    onChange={e => updateSubject(index, 'namaMapel', e.target.value)}
                    className="w-full sm:w-1/3 px-2 py-1.5 border rounded-lg bg-white font-semibold"
                    placeholder="Nama Mata Pelajaran"
                  />
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pengetahuan</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={mp.nilaiPengetahuan}
                        onChange={e => updateSubject(index, 'nilaiPengetahuan', e.target.value)}
                        className="w-16 px-2 py-1 border rounded-lg bg-white font-mono text-center font-bold"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Keterampilan</span>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        value={mp.nilaiKeterampilan}
                        onChange={e => updateSubject(index, 'nilaiKeterampilan', e.target.value)}
                        className="w-16 px-2 py-1 border rounded-lg bg-white font-mono text-center font-bold"
                      />
                    </div>
                    <div className="text-center px-1">
                      <span className="text-[10px] text-slate-400 block">Akhir</span>
                      <span className="font-bold font-mono text-blue-900 text-sm">{mp.nilaiAkhir}</span>
                    </div>
                    <div className="text-center px-1">
                      <span className="text-[10px] text-slate-400 block">Predikat</span>
                      <span className="font-extrabold text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">{mp.predikat}</span>
                    </div>
                    {subjects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSubjectRow(index)}
                        className="text-rose-500 hover:text-rose-700 p-1 ml-auto"
                        title="Hapus baris mapel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Catatan Evaluasi Akademik Guru</label>
            <textarea
              rows={2}
              value={catatanAkademik}
              onChange={e => setCatatanAkademik(e.target.value)}
              placeholder="Berikan saran pengembangan atau apresiasi belajar siswa..."
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
              className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-xl shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simpan Rekap Nilai</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
