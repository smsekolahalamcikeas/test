import React, { useState } from 'react';
import { Achievement, Student } from '../types';
import { storage } from '../services/storage';
import {
  Trophy,
  Plus,
  Search,
  Award,
  Edit2,
  Trash2,
  FileCheck2,
  ExternalLink,
  X
} from 'lucide-react';
import { useToast } from './Toast';
import { ConfirmModal } from './ConfirmModal';

interface AchievementsViewProps {
  students: Student[];
  achievements: Achievement[];
  onRefresh: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  students,
  achievements,
  onRefresh
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTingkat, setFilterTingkat] = useState('');
  const [filterBidang, setFilterBidang] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievementToEdit, setAchievementToEdit] = useState<Achievement | null>(null);
  const [achievementToDelete, setAchievementToDelete] = useState<Achievement | null>(null);

  const filteredAchievements = achievements.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      a.namaLomba.toLowerCase().includes(q) ||
      a.studentName.toLowerCase().includes(q) ||
      a.penyelenggara.toLowerCase().includes(q) ||
      a.kelas.toLowerCase().includes(q);
    const matchTingkat = !filterTingkat || a.tingkat === filterTingkat;
    const matchBidang = !filterBidang || a.bidang === filterBidang;
    return matchSearch && matchTingkat && matchBidang;
  });

  const handleOpenAdd = () => {
    setAchievementToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Achievement) => {
    setAchievementToEdit(item);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!achievementToDelete) return;
    storage.deleteAchievement(achievementToDelete.id);
    showToast('Prestasi Dihapus', `Data kejuaraan ${achievementToDelete.namaLomba} berhasil dihapus.`, 'success');
    setAchievementToDelete(null);
    onRefresh();
  };

  return (
    <div id="achievements-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Modul Pencatatan Prestasi & Piagam Kejuaraan
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Dokumentasi rekam jejak juara akademik, sains, seni, dan olahraga beserta bukti sertifikat/piagam digital.
          </p>
        </div>
        <button
          id="btn-add-achievement"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs transition-colors active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Catat Prestasi Baru</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama kompetisi, siswa, atau penyelenggara..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
          />
        </div>

        <select
          value={filterTingkat}
          onChange={e => setFilterTingkat(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
        >
          <option value="">Semua Tingkat</option>
          <option value="Sekolah">Sekolah</option>
          <option value="Kecamatan">Kecamatan</option>
          <option value="Kota/Kabupaten">Kota / Kabupaten</option>
          <option value="Provinsi">Provinsi</option>
          <option value="Nasional">Nasional</option>
          <option value="Internasional">Internasional</option>
        </select>

        <select
          value={filterBidang}
          onChange={e => setFilterBidang(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
        >
          <option value="">Semua Bidang</option>
          <option value="Akademik">Akademik</option>
          <option value="Sains & Riset">Sains & Riset</option>
          <option value="Olahraga">Olahraga</option>
          <option value="Seni & Budaya">Seni & Budaya</option>
          <option value="Robotika & IT">Robotika & IT</option>
          <option value="Keagamaan">Keagamaan</option>
        </select>
      </div>

      {/* Grid Cards of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAchievements.length === 0 ? (
          <div className="col-span-3 py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <Award className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-semibold text-sm">Tidak ada data prestasi yang cocok.</p>
          </div>
        ) : (
          filteredAchievements.map(ach => (
            <div
              key={ach.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      ach.tingkat === 'Internasional'
                        ? 'bg-purple-100 text-purple-800'
                        : ach.tingkat === 'Nasional'
                        ? 'bg-rose-100 text-rose-800'
                        : ach.tingkat === 'Provinsi'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    Tingkat {ach.tingkat}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{ach.tanggalPerolehan}</span>
                </div>

                <div>
                  <div className="inline-block px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-bold text-xs mb-1">
                    {ach.peringkat}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {ach.namaLomba}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Bidang: <strong>{ach.bidang}</strong>
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                  <p className="text-slate-800">
                    Siswa: <strong>{ach.studentName}</strong> ({ach.kelas})
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Penyelenggara: {ach.penyelenggara}
                  </p>
                  {ach.guruPembimbing && (
                    <p className="text-slate-500 text-[11px]">
                      Pembimbing: {ach.guruPembimbing}
                    </p>
                  )}
                </div>

                {ach.buktiSertifikatUrl && (
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <a
                      href={ach.buktiSertifikatUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                    >
                      Lihat Piagam/Sertifikat <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-4 text-xs">
                <button
                  onClick={() => handleOpenEdit(ach)}
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-blue-600 font-semibold p-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Ubah
                </button>
                <button
                  onClick={() => setAchievementToDelete(ach)}
                  className="inline-flex items-center gap-1 text-slate-400 hover:text-rose-600 font-semibold p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah/Edit Prestasi */}
      {isModalOpen && (
        <AchievementModalForm
          students={students}
          initialData={achievementToEdit}
          onClose={() => setIsModalOpen(false)}
          onSaved={() => {
            setIsModalOpen(false);
            onRefresh();
          }}
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {achievementToDelete && (
        <ConfirmModal
          isOpen={!!achievementToDelete}
          title="Hapus Prestasi Siswa"
          message={`Hapus rekaman kejuaraan "${achievementToDelete.namaLomba}" untuk siswa ${achievementToDelete.studentName}?`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setAchievementToDelete(null)}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// SUB-KOMPONEN: MODAL FORM PENCATATAN PRESTASI
// -------------------------------------------------------------
interface AchievementModalFormProps {
  students: Student[];
  initialData: Achievement | null;
  onClose: () => void;
  onSaved: () => void;
}

const AchievementModalForm: React.FC<AchievementModalFormProps> = ({
  students,
  initialData,
  onClose,
  onSaved
}) => {
  const { showToast } = useToast();

  const [selectedStudentId, setSelectedStudentId] = useState(
    initialData?.studentId || (students[0]?.id || '')
  );
  const [namaLomba, setNamaLomba] = useState(initialData?.namaLomba || '');
  const [peringkat, setPeringkat] = useState(initialData?.peringkat || 'Juara 1');
  const [tingkat, setTingkat] = useState<Achievement['tingkat']>(
    initialData?.tingkat || 'Kota/Kabupaten'
  );
  const [bidang, setBidang] = useState<Achievement['bidang']>(
    initialData?.bidang || 'Akademik'
  );
  const [penyelenggara, setPenyelenggara] = useState(
    initialData?.penyelenggara || 'Dinas Pendidikan & Kebudayaan'
  );
  const [tanggalPerolehan, setTanggalPerolehan] = useState(
    initialData?.tanggalPerolehan || new Date().toISOString().slice(0, 10)
  );
  const [guruPembimbing, setGuruPembimbing] = useState(
    initialData?.guruPembimbing || ''
  );
  const [buktiSertifikatUrl, setBuktiSertifikatUrl] = useState(
    initialData?.buktiSertifikatUrl || ''
  );
  const [fileName, setFileName] = useState('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran piagam maksimal 2MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setBuktiSertifikatUrl(reader.result as string);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      alert('Pilih siswa terlebih dahulu!');
      return;
    }

    storage.saveAchievement({
      id: initialData?.id,
      studentId: selectedStudent.id,
      studentName: selectedStudent.namaLengkap,
      kelas: selectedStudent.kelas,
      namaLomba,
      peringkat,
      tingkat,
      bidang,
      penyelenggara,
      tanggalPerolehan,
      guruPembimbing,
      buktiSertifikatUrl
    });

    showToast(
      'Prestasi Disimpan',
      `Perolehan prestasi ${namaLomba} (${peringkat}) untuk ${selectedStudent.namaLengkap} berhasil dicatat.`,
      'success'
    );
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95">
        <div className="bg-amber-500 text-slate-950 p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              {initialData ? 'Ubah Catatan Prestasi' : 'Pencatatan Prestasi & Piagam Baru'}
            </h3>
            <p className="text-xs text-amber-950 font-medium mt-0.5">
              Lampirkan bukti sertifikat atau piagam kejuaraan siswa.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-amber-950 hover:bg-amber-600/30 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 max-h-[70vh] overflow-y-auto space-y-4 text-xs sm:text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa Berprestasi</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Tanggal Perolehan</label>
              <input
                type="date"
                value={tanggalPerolehan}
                onChange={e => setTanggalPerolehan(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nama Kompetisi / Lomba</label>
            <input
              type="text"
              value={namaLomba}
              onChange={e => setNamaLomba(e.target.value)}
              placeholder="Contoh: Olimpiade Sains Nasional (OSN) Bidang Fisika"
              className="w-full px-3 py-2 border rounded-xl font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Peringkat / Capaian</label>
              <input
                type="text"
                value={peringkat}
                onChange={e => setPeringkat(e.target.value)}
                placeholder="Juara 1 / Medali Emas"
                className="w-full px-3 py-2 border rounded-xl font-bold"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tingkat Lomba</label>
              <select
                value={tingkat}
                onChange={e => setTingkat(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="Sekolah">Sekolah</option>
                <option value="Kecamatan">Kecamatan</option>
                <option value="Kota/Kabupaten">Kota / Kabupaten</option>
                <option value="Provinsi">Provinsi</option>
                <option value="Nasional">Nasional</option>
                <option value="Internasional">Internasional</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bidang Lomba</label>
              <select
                value={bidang}
                onChange={e => setBidang(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-xl"
              >
                <option value="Akademik">Akademik</option>
                <option value="Sains & Riset">Sains & Riset</option>
                <option value="Olahraga">Olahraga</option>
                <option value="Seni & Budaya">Seni & Budaya</option>
                <option value="Robotika & IT">Robotika & IT</option>
                <option value="Keagamaan">Keagamaan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Lembaga Penyelenggara</label>
              <input
                type="text"
                value={penyelenggara}
                onChange={e => setPenyelenggara(e.target.value)}
                placeholder="Puspresnas Kemdikbudristek / Universitas..."
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Guru Pembimbing</label>
              <input
                type="text"
                value={guruPembimbing}
                onChange={e => setGuruPembimbing(e.target.value)}
                placeholder="Nama guru pendamping lomba"
                className="w-full px-3 py-2 border rounded-xl"
              />
            </div>
          </div>

          {/* Upload Piagam */}
          <div className="p-3 bg-slate-50 border border-dashed rounded-xl space-y-2">
            <span className="block font-semibold text-slate-700 text-xs">
              Unggah Piagam / Sertifikat Digital (Maks 2MB)
            </span>
            <p className="text-[11px] text-slate-500">
              {fileName ? `Berkas terpilih: ${fileName}` : buktiSertifikatUrl ? 'Piagam sudah tersimpan' : 'Format didukung: PDF, JPG, PNG'}
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
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
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs"
            >
              Simpan Piagam & Prestasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
