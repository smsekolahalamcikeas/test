import React, { useState } from 'react';
import { TalentAssessment, Student } from '../types';
import { storage } from '../services/storage';
import {
  BrainCircuit,
  Plus,
  Search,
  Compass,
  Edit2,
  Trash2,
  Sparkles,
  GraduationCap,
  X
} from 'lucide-react';
import { useToast } from './Toast';
import { ConfirmModal } from './ConfirmModal';

interface TalentViewProps {
  students: Student[];
  talentAssessments: TalentAssessment[];
  onRefresh: () => void;
}

export const TalentView: React.FC<TalentViewProps> = ({
  students,
  talentAssessments,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [talentToEdit, setTalentToEdit] = useState<TalentAssessment | null>(null);
  const [talentToDelete, setTalentToDelete] = useState<TalentAssessment | null>(null);

  const filteredTalents = talentAssessments.filter(t => {
    const q = searchQuery.toLowerCase();
    return (
      t.studentName.toLowerCase().includes(q) ||
      t.tipeHollandRiasec.toLowerCase().includes(q) ||
      t.gayaBelajar.toLowerCase().includes(q) ||
      t.rekomendasiJurusanKuliah.some(j => j.toLowerCase().includes(q))
    );
  });

  const handleOpenAdd = () => {
    setTalentToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: TalentAssessment) => {
    setTalentToEdit(item);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!talentToDelete) return;
    storage.deleteTalentAssessment(talentToDelete.id);
    showToast('Asesmen Dihapus', `Data asesmen bakat minat ${talentToDelete.studentName} berhasil dihapus.`, 'success');
    setTalentToDelete(null);
    onRefresh();
  };

  return (
    <div id="talent-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-600" />
            Modul Asesmen Bakat, Minat & Potensi Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hasil psikotes terstandarisasi, pemetaan tipe kepribadian Holland (RIASEC), modalitas gaya belajar, dan saran jurusan SNBP/SNBT.
          </p>
        </div>
        <button
          id="btn-add-talent"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Input Hasil Asesmen</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari siswa, kode Holland RIASEC, gaya belajar, rekomendasi prodi..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>
      </div>

      {/* Assessment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTalents.length === 0 ? (
          <div className="col-span-2 py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Compass className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm">Belum ada data asesmen psikotes yang cocok.</p>
          </div>
        ) : (
          filteredTalents.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-indigo-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between border-b pb-3">
                <div>
                  <span className="text-xs text-slate-400 font-mono">Tanggal Tes: {t.tanggalTes}</span>
                  <h3 className="font-bold text-slate-900 text-base mt-0.5">{t.studentName}</h3>
                  <p className="text-xs text-slate-500">
                    Lembaga Psikotes: <strong>{t.lembagaPsikotes}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Skor IQ
                  </span>
                  <span className="text-2xl font-black text-indigo-700 font-mono">
                    {t.skorIq || '-'}
                  </span>
                </div>
              </div>

              {/* RIASEC & Gaya Belajar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                  <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block">
                    Kode Holland (RIASEC)
                  </span>
                  <span className="text-base font-extrabold text-indigo-950 font-mono">
                    {t.tipeHollandRiasec}
                  </span>
                </div>

                <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
                    Gaya Belajar Dominan
                  </span>
                  <span className="text-sm font-bold text-amber-950">
                    {t.gayaBelajar}
                  </span>
                </div>
              </div>

              {/* Rekomendasi Prodi Kuliah */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  Rekomendasi Jurusan Perguruan Tinggi:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {t.rekomendasiJurusanKuliah.map((j, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                    >
                      {j}
                    </span>
                  ))}
                </div>
              </div>

              {/* Saran Pengembangan & Guru BK */}
              {t.saranPengembangan && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-slate-900">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Saran Konselor BK:
                  </span>
                  <p className="italic">{t.saranPengembangan}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t text-xs">
                <span className="text-[11px] text-slate-400">
                  Konselor: <strong>{t.konselorBk}</strong>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-semibold p-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Ubah
                  </button>
                  <button
                    onClick={() => setTalentToDelete(t)}
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

      {/* Modal Input Asesmen */}
      {isModalOpen && (
        <TalentModalForm
          students={students}
          initialData={talentToEdit}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            onRefresh();
          }}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {talentToDelete && (
        <ConfirmModal
          isOpen={!!talentToDelete}
          title="Hapus Asesmen Bakat Minat"
          message={`Hapus data hasil psikotes bakat minat siswa "${talentToDelete.studentName}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTalentToDelete(null)}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// SUB-KOMPONEN: MODAL FORM ASESMEN BAKAT MINAT
// -------------------------------------------------------------
interface TalentModalFormProps {
  students: Student[];
  initialData: TalentAssessment | null;
  onClose: () => void;
  onSaved: () => void;
}

const TalentModalForm: React.FC<TalentModalFormProps> = ({
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
  const [tanggalTes, setTanggalTes] = useState(
    initialData?.tanggalTes || new Date().toISOString().slice(0, 10)
  );
  const [lembagaPsikotes, setLembagaPsikotes] = useState(
    initialData?.lembagaPsikotes || 'Lembaga Psikologi Terapan Universitas Indonesia'
  );
  const [skorIq, setSkorIq] = useState<number>(initialData?.skorIq || 120);
  const [tipeHollandRiasec, setTipeHollandRiasec] = useState(
    initialData?.tipeHollandRiasec || 'IRC (Investigative, Realistic, Conventional)'
  );
  const [gayaBelajar, setGayaBelajar] = useState<TalentAssessment['gayaBelajar']>(
    initialData?.gayaBelajar || 'Visual'
  );
  const [minatKarir, setMinatKarir] = useState(
    initialData?.minatKarir?.join(', ') || 'Software Engineer, Data Scientist, Akademisi'
  );
  const [rekomendasiJurusanKuliah, setRekomendasiJurusanKuliah] = useState(
    initialData?.rekomendasiJurusanKuliah?.join(', ') || 'Teknik Informatika, Matematika Terapan, Ilmu Komputer'
  );
  const [saranPengembangan, setSaranPengembangan] = useState(
    initialData?.saranPengembangan || ''
  );
  const [konselorBk, setKonselorBk] = useState(
    initialData?.konselorBk || currentUser.name
  );

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Pilih siswa terlebih dahulu!');
      return;
    }

    const jurusanArray = rekomendasiJurusanKuliah
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const karirArray = minatKarir
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    storage.saveTalentAssessment({
      id: initialData?.id,
      studentId: selectedStudent.id,
      studentName: selectedStudent.namaLengkap,
      tanggalTes,
      lembagaPsikotes,
      skorIq: Number(skorIq),
      tipeHollandRiasec,
      gayaBelajar,
      minatKarir: karirArray,
      rekomendasiJurusanKuliah: jurusanArray,
      saranPengembangan,
      konselorBk
    });

    showToast(
      'Asesmen Disimpan',
      `Hasil psikotes bakat minat untuk ${selectedStudent.namaLengkap} berhasil dicatat.`,
      'success'
    );
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-indigo-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              {initialData ? 'Ubah Asesmen Bakat Minat' : 'Input Hasil Psikotes & Potensi Siswa'}
            </h3>
            <p className="text-xs text-indigo-200 mt-0.5">
              Pemetaan karir dan rekomendasi jurusan kuliah jenjang perguruan tinggi.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-indigo-200 hover:text-white rounded-lg">
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
                    {s.namaLengkap} ({s.kelas})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Asesmen Psikotes</label>
              <input
                type="date"
                value={tanggalTes}
                onChange={e => setTanggalTes(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Skor IQ</label>
              <input
                type="number"
                min={70}
                max={160}
                value={skorIq}
                onChange={e => setSkorIq(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-xl font-mono font-bold text-indigo-700"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Tipe Holland RIASEC</label>
              <input
                type="text"
                value={tipeHollandRiasec}
                onChange={e => setTipeHollandRiasec(e.target.value)}
                placeholder="Misal: IRC / RIA / SEC"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Gaya Belajar Dominan</label>
              <select
                value={gayaBelajar}
                onChange={e => setGayaBelajar(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="Visual">Visual (Melihat gambar/diagram)</option>
                <option value="Auditori">Auditori (Mendengar penjelasan)</option>
                <option value="Kinestetik">Kinestetik (Praktek langsung)</option>
                <option value="Campuran">Campuran (Multimodal)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lembaga Penyelenggara</label>
              <input
                type="text"
                value={lembagaPsikotes}
                onChange={e => setLembagaPsikotes(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Rekomendasi Jurusan Perguruan Tinggi (Pisahkan Koma)
            </label>
            <input
              type="text"
              value={rekomendasiJurusanKuliah}
              onChange={e => setRekomendasiJurusanKuliah(e.target.value)}
              placeholder="Contoh: Teknik Informatika, Kedokteran, Psikologi"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Peminatan Karir / Profesi Masa Depan (Pisahkan Koma)
            </label>
            <input
              type="text"
              value={minatKarir}
              onChange={e => setMinatKarir(e.target.value)}
              placeholder="Contoh: Dokter Spesialis, Peneliti AI, Pengusaha"
              className="w-full px-3 py-2 border rounded-xl"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Saran Pengembangan Konselor BK</label>
            <textarea
              rows={2}
              value={saranPengembangan}
              onChange={e => setSaranPengembangan(e.target.value)}
              placeholder="Rekomendasi pendampingan belajar, kegiatan ekstrakurikuler..."
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
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs"
            >
              Simpan Hasil Asesmen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
