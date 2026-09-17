import React, { useState, useMemo } from 'react';
import {
  Student,
  StudentDocument
} from '../types';
import { storage } from '../services/storage';
import { ExportService } from '../services/export';
import {
  Search,
  Plus,
  Filter,
  FileSpreadsheet,
  Printer,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  X
} from 'lucide-react';
import { useToast } from './Toast';
import { ConfirmModal } from './ConfirmModal';

interface StudentProfileViewProps {
  students: Student[];
  onRefresh: () => void;
  isAddModalOpen?: boolean;
  onCloseAddModal?: () => void;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({
  students,
  onRefresh,
  isAddModalOpen: propIsAddModalOpen,
  onCloseAddModal: propOnCloseAddModal
}) => {
  const { showToast } = useToast();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('');
  const [filterJurusan, setFilterJurusan] = useState('');
  const [filterAngkatan, setFilterAngkatan] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<Student | null>(null);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Sync external prop if any
  React.useEffect(() => {
    if (propIsAddModalOpen) {
      setStudentToEdit(null);
      setIsWizardOpen(true);
    }
  }, [propIsAddModalOpen]);

  // Unique options for filters
  const uniqueClasses = useMemo(() => Array.from(new Set(students.map(s => s.kelas).filter(Boolean))), [students]);
  const uniqueAngkatan = useMemo(() => Array.from(new Set(students.map(s => s.angkatan).filter(Boolean))), [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        s.namaLengkap.toLowerCase().includes(q) ||
        s.nisn.includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.nik.includes(q) ||
        s.kelas.toLowerCase().includes(q);

      const matchesKelas = !filterKelas || s.kelas === filterKelas;
      const matchesJurusan = !filterJurusan || s.jurusan === filterJurusan;
      const matchesAngkatan = !filterAngkatan || s.angkatan === filterAngkatan;
      const matchesStatus = !filterStatus || s.statusSiswa === filterStatus;

      return matchesSearch && matchesKelas && matchesJurusan && matchesAngkatan && matchesStatus;
    });
  }, [students, searchQuery, filterKelas, filterJurusan, filterAngkatan, filterStatus]);

  // Paginated Data
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handleOpenAdd = () => {
    setStudentToEdit(null);
    setIsWizardOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setStudentToEdit(student);
    setIsWizardOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    const success = storage.deleteStudent(studentToDelete.id);
    if (success) {
      showToast('Siswa Dihapus', `Data siswa ${studentToDelete.namaLengkap} berhasil dihapus permanen.`, 'success');
      onRefresh();
    } else {
      showToast('Gagal Menghapus', 'Data siswa tidak dapat ditemukan.', 'error');
    }
    setStudentToDelete(null);
  };

  const handleExportExcel = () => {
    ExportService.exportToExcel(
      filteredStudents,
      storage.getAcademicRecords(),
      storage.getAchievements(),
      storage.getDisciplineRecords(),
      storage.getTalentAssessments()
    );
    showToast('Ekspor Berhasil', `${filteredStudents.length} data siswa diekspor ke format Excel (.xlsx).`, 'success');
  };

  const handlePrintDossier = (student: Student) => {
    ExportService.printStudentReport(student);
  };

  return (
    <div id="students-view" className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Modul Profil & Pemberkasan Siswa
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan biodata lengkap, rekam berkas digital (KK, Akte, Ijazah), dan identitas siswa SMA.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-export-excel-students"
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Ekspor Excel</span>
          </button>
          <button
            id="btn-add-student-modal"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs transition-colors active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa (Wizard)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Real-time Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="search-students-input"
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Cari NISN, Nama, ID, NIK, Kelas..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>

          {/* Filter Kelas */}
          <div className="md:col-span-2">
            <select
              id="filter-kelas-select"
              value={filterKelas}
              onChange={e => {
                setFilterKelas(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Semua Kelas</option>
              {uniqueClasses.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Filter Jurusan */}
          <div className="md:col-span-2">
            <select
              id="filter-jurusan-select"
              value={filterJurusan}
              onChange={e => {
                setFilterJurusan(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Semua Peminatan</option>
              <option value="MIPA">MIPA</option>
              <option value="IPS">IPS</option>
              <option value="Bahasa">Bahasa</option>
              <option value="Fase E (Umum)">Fase E (Umum)</option>
            </select>
          </div>

          {/* Filter Angkatan */}
          <div className="md:col-span-2">
            <select
              id="filter-angkatan-select"
              value={filterAngkatan}
              onChange={e => {
                setFilterAngkatan(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Semua Angkatan</option>
              {uniqueAngkatan.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Filter Status Siswa */}
          <div className="md:col-span-2">
            <select
              id="filter-status-select"
              value={filterStatus}
              onChange={e => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Lulus">Lulus</option>
              <option value="Pindah">Pindah</option>
              <option value="Keluar">Keluar</option>
            </select>
          </div>
        </div>

        {/* Reset Filter Text */}
        {(searchQuery || filterKelas || filterJurusan || filterAngkatan || filterStatus) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Ditemukan <strong>{filteredStudents.length}</strong> siswa yang cocok</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterKelas('');
                setFilterJurusan('');
                setFilterAngkatan('');
                setFilterStatus('');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/90 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Siswa</th>
                <th className="py-3.5 px-3">NISN / NIS</th>
                <th className="py-3.5 px-3">Kelas & Peminatan</th>
                <th className="py-3.5 px-3">Poin Pelanggaran</th>
                <th className="py-3.5 px-3">Berkas Digital</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <p className="font-semibold text-sm">Tidak ada data siswa ditemukan</p>
                    <p className="text-xs mt-1">Coba sesuaikan kata kunci pencarian atau filter Anda.</p>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map(student => {
                  const points = storage.getStudentTotalDisciplinePoints(student.id);
                  const sanction = storage.getSanctionLevel(points);
                  const docCount = student.dokumen?.length || 0;

                  return (
                    <tr key={student.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Siswa */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.fotoUrl || 'https://via.placeholder.com/40?text=Foto'}
                            alt={student.namaLengkap}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-[180px] sm:max-w-xs">
                              {student.namaLengkap}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              {student.id} &bull; {student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* NISN / NIS */}
                      <td className="py-3.5 px-3 font-mono text-xs">
                        <p className="font-semibold text-slate-800">{student.nisn}</p>
                        <p className="text-slate-400 text-[11px]">{student.nis}</p>
                      </td>

                      {/* Kelas & Peminatan */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-md text-xs">
                          {student.kelas}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{student.jurusan}</p>
                      </td>

                      {/* Poin Pelanggaran */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-full border ${sanction.badgeColor}`}>
                          {points} Poin ({sanction.level})
                        </span>
                      </td>

                      {/* Berkas Digital */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-1 text-xs">
                          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span className="font-semibold">{docCount} Dokumen</span>
                        </div>
                        <p className="text-[10px] text-slate-400">KK, Akte, Ijazah</p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                          {student.statusSiswa}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            id={`btn-detail-${student.id}`}
                            onClick={() => setSelectedStudentForDetail(student)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Berkas & Detail Siswa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-print-${student.id}`}
                            onClick={() => handlePrintDossier(student)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Cetak Arsip Resmi / PDF"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-edit-${student.id}`}
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Ubah Data Siswa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            id={`btn-delete-${student.id}`}
                            onClick={() => setStudentToDelete(student)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Data Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-4 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Menampilkan baris <strong>{Math.min((currentPage - 1) * itemsPerPage + 1, filteredStudents.length)}</strong> sampai{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredStudents.length)}</strong> dari total{' '}
            <strong>{filteredStudents.length}</strong> siswa
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-prev-page"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold px-2">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              id="btn-next-page"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Multi-Step Wizard Modal */}
      {isWizardOpen && (
        <StudentWizardModal
          initialData={studentToEdit}
          onClose={() => {
            setIsWizardOpen(false);
            if (propOnCloseAddModal) propOnCloseAddModal();
          }}
          onSaved={() => {
            setIsWizardOpen(false);
            if (propOnCloseAddModal) propOnCloseAddModal();
            onRefresh();
          }}
        />
      )}

      {/* Detail Dossier Modal */}
      {selectedStudentForDetail && (
        <StudentDetailModal
          student={selectedStudentForDetail}
          onClose={() => setSelectedStudentForDetail(null)}
          onPrint={() => handlePrintDossier(selectedStudentForDetail)}
          onEdit={() => {
            const st = selectedStudentForDetail;
            setSelectedStudentForDetail(null);
            handleOpenEdit(st);
          }}
        />
      )}

      {/* Confirm Delete Modal */}
      {studentToDelete && (
        <ConfirmModal
          isOpen={!!studentToDelete}
          title="Hapus Data Siswa"
          message={`Apakah Anda yakin ingin menghapus siswa "${studentToDelete.namaLengkap}" (${studentToDelete.id}) secara permanen? Seluruh riwayat berkas digital juga akan terhapus.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setStudentToDelete(null)}
        />
      )}
    </div>
  );
};

// -------------------------------------------------------------
// SUB-KOMPONEN: MULTI-STEP WIZARD MODAL (4 LANGKAH LENGKAP)
// -------------------------------------------------------------
interface StudentWizardModalProps {
  initialData: Student | null;
  onClose: () => void;
  onSaved: () => void;
}

const StudentWizardModal: React.FC<StudentWizardModalProps> = ({
  initialData,
  onClose,
  onSaved
}) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [formData, setFormData] = useState({
    nisn: initialData?.nisn || '',
    nis: initialData?.nis || '',
    namaLengkap: initialData?.namaLengkap || '',
    nik: initialData?.nik || '',
    tempatLahir: initialData?.tempatLahir || '',
    tanggalLahir: initialData?.tanggalLahir || '',
    jenisKelamin: initialData?.jenisKelamin || ('L' as 'L' | 'P'),
    agama: initialData?.agama || ('Islam' as any),
    alamat: initialData?.alamat || '',
    noTelepon: initialData?.noTelepon || '',
    email: initialData?.email || '',

    // Ortu
    namaAyah: initialData?.namaAyah || '',
    pekerjaanAyah: initialData?.pekerjaanAyah || 'Karyawan Swasta',
    namaIbu: initialData?.namaIbu || '',
    pekerjaanIbu: initialData?.pekerjaanIbu || 'Ibu Rumah Tangga',
    noTeleponOrtu: initialData?.noTeleponOrtu || '',
    penghasilanOrtu: initialData?.penghasilanOrtu || 'Rp 5.000.000 - Rp 10.000.000',

    // Masuk & Kelas
    tahunMasuk: initialData?.tahunMasuk || new Date().getFullYear(),
    angkatan: initialData?.angkatan || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    kelas: initialData?.kelas || 'X-1',
    jurusan: initialData?.jurusan || ('Fase E (Umum)' as any),
    jalurMasuk: initialData?.jalurMasuk || ('Zonasi' as any),
    asalSmp: initialData?.asalSmp || '',
    statusSiswa: initialData?.statusSiswa || ('Aktif' as any),

    // Berkas Dokumen
    dokumen: initialData?.dokumen || ([] as StudentDocument[]),
    fotoUrl: initialData?.fotoUrl || ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validasi Langkah 1
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!formData.namaLengkap.trim()) errors.namaLengkap = 'Nama lengkap wajib diisi.';
    if (!formData.nisn.trim()) errors.nisn = 'NISN 10 digit wajib diisi.';
    else if (!/^\d{10}$/.test(formData.nisn.trim())) errors.nisn = 'Format NISN harus berupa 10 digit angka.';

    if (!formData.nik.trim()) errors.nik = 'NIK 16 digit wajib diisi.';
    else if (!/^\d{16}$/.test(formData.nik.trim())) errors.nik = 'Format NIK harus berupa 16 digit angka.';

    if (!formData.tempatLahir.trim()) errors.tempatLahir = 'Tempat lahir wajib diisi.';
    if (!formData.tanggalLahir) errors.tanggalLahir = 'Tanggal lahir wajib dipilih.';
    if (!formData.alamat.trim()) errors.alamat = 'Alamat wajib diisi.';

    // Validasi ketat nomor telepon & email
    if (!formData.noTelepon.trim()) {
      errors.noTelepon = 'Nomor telepon wajib diisi.';
    } else if (!/^08\d{8,12}$/.test(formData.noTelepon.replace(/[\s-]/g, ''))) {
      errors.noTelepon = 'Format nomor HP tidak valid (contoh: 08123456789).';
    }

    if (!formData.email.trim()) {
      errors.email = 'Alamat email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Format email tidak valid (contoh: siswa@sekolah.sch.id).';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validasi Langkah 2
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    if (!formData.namaAyah.trim()) errors.namaAyah = 'Nama ayah wajib diisi.';
    if (!formData.namaIbu.trim()) errors.namaIbu = 'Nama ibu wajib diisi.';
    if (!formData.noTeleponOrtu.trim()) {
      errors.noTeleponOrtu = 'No. telepon orang tua wajib diisi.';
    } else if (!/^08\d{8,12}$/.test(formData.noTeleponOrtu.replace(/[\s-]/g, ''))) {
      errors.noTeleponOrtu = 'Format nomor HP orang tua tidak valid.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validasi Langkah 3
  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    if (!formData.asalSmp.trim()) errors.asalSmp = 'Asal SMP/MTs wajib diisi.';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(s => Math.min(s + 1, 4) as any);
  };

  const handlePrev = () => {
    setValidationErrors({});
    setStep(s => Math.max(s - 1, 1) as any);
  };

  // Upload File Dokumen (Validasi batas 2MB & ekstensi PDF/JPG/PNG)
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: StudentDocument['type'],
    docTitle: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validasi Ukuran (Maksimal 2MB = 2 * 1024 * 1024 bytes)
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert(`Berkas ${file.name} melebihi batas maksimal 2MB! Ukuran berkas Anda: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      return;
    }

    // 2. Validasi Ekstensi (Hanya PDF, JPG, PNG)
    const validExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.includes(ext)) {
      alert(`Format berkas .${ext} tidak diizinkan! Hanya diperbolehkan berkas bertipe PDF, JPG, atau PNG.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const newDoc: StudentDocument = {
        id: 'DOC-' + Date.now() + Math.random().toString(36).substr(2, 4),
        name: docTitle,
        type,
        fileName: file.name,
        fileSize: file.size,
        fileUrl: base64,
        uploadedAt: new Date().toISOString().slice(0, 10)
      };

      setFormData(prev => {
        // Ganti jika tipe sama sudah ada, atau tambahkan
        const existingFiltered = prev.dokumen.filter(d => d.type !== type);
        const updatedDocs = [...existingFiltered, newDoc];
        // Jika upload pas foto, simpan juga ke fotoUrl
        const newFoto = type === 'foto' ? base64 : prev.fotoUrl;
        return {
          ...prev,
          dokumen: updatedDocs,
          fotoUrl: newFoto
        };
      });

      showToast('Unggah Dokumen', `Berkas ${file.name} (${docTitle}) berhasil diverifikasi & dilampirkan.`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    try {
      storage.saveStudent({
        ...formData,
        id: initialData?.id
      });
      showToast(
        initialData ? 'Siswa Diperbarui' : 'Siswa Berhasil Ditambahkan',
        `Profil ${formData.namaLengkap} telah tersimpan di database SIDATA.`,
        'success'
      );
      onSaved();
    } catch (err) {
      showToast('Terjadi Kesalahan', 'Gagal menyimpan data siswa.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="student-wizard-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#0f2b5c] text-white p-4 sm:p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-400 text-slate-950 rounded">
              Formulir Wizard
            </span>
            <h3 className="text-base sm:text-lg font-bold mt-1">
              {initialData ? 'Ubah Data Siswa' : 'Tambah Biodata & Berkas Siswa Baru'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Data Diri' },
              { num: 2, label: 'Orang Tua' },
              { num: 3, label: 'Akademik' },
              { num: 4, label: 'Dokumen' }
            ].map((s, idx) => {
              const isActive = step === s.num;
              const isPassed = step > s.num;
              return (
                <div key={s.num} className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-blue-700 text-white ring-2 ring-blue-300'
                        : isPassed
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : s.num}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:inline ${isActive ? 'text-blue-900' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                  {idx < 3 && <div className="h-0.5 flex-1 bg-slate-200 mx-1 sm:mx-2"></div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto space-y-4">
          {/* STEP 1: DATA DIRI */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Langkah 1: Identitas Pribadi Siswa</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaLengkap}
                    onChange={e => setFormData({ ...formData, namaLengkap: e.target.value })}
                    placeholder="Nama sesuai akte lahir"
                    className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-xl focus:ring-2 focus:ring-blue-500/30 ${
                      validationErrors.namaLengkap ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {validationErrors.namaLengkap && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.namaLengkap}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Siswa Nasional (NISN) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={formData.nisn}
                    onChange={e => setFormData({ ...formData, nisn: e.target.value.replace(/\D/g, '') })}
                    placeholder="10 digit angka"
                    className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-xl font-mono ${
                      validationErrors.nisn ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {validationErrors.nisn && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.nisn}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={formData.nik}
                    onChange={e => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                    placeholder="16 digit sesuai KK"
                    className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-xl font-mono ${
                      validationErrors.nik ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {validationErrors.nik && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.nik}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Induk Siswa (NIS Lokal)</label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={e => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Misal: 24251001"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.tempatLahir}
                    onChange={e => setFormData({ ...formData, tempatLahir: e.target.value })}
                    placeholder="Kota / Kabupaten"
                    className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-xl ${
                      validationErrors.tempatLahir ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.tanggalLahir}
                    onChange={e => setFormData({ ...formData, tanggalLahir: e.target.value })}
                    className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-xl ${
                      validationErrors.tanggalLahir ? 'border-rose-400' : 'border-slate-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={e => setFormData({ ...formData, jenisKelamin: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Agama</label>
                  <select
                    value={formData.agama}
                    onChange={e => setFormData({ ...formData, agama: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="Islam">Islam</option>
                    <option value="Kristen">Kristen</option>
                    <option value="Katolik">Katolik</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP Siswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.noTelepon}
                    onChange={e => setFormData({ ...formData, noTelepon: e.target.value })}
                    placeholder="Contoh: 08123456789"
                    className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-xl font-mono ${
                      validationErrors.noTelepon ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {validationErrors.noTelepon && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.noTelepon}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Siswa <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="siswa@domain.com"
                    className={`w-full px-3 py-2 text-xs sm:text-sm border rounded-xl ${
                      validationErrors.email ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {validationErrors.email && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Tempat Tinggal <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formData.alamat}
                  onChange={e => setFormData({ ...formData, alamat: e.target.value })}
                  placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* STEP 2: DATA ORANG TUA / WALI */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Langkah 2: Data Orang Tua / Wali</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Ayah Kandung <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaAyah}
                    onChange={e => setFormData({ ...formData, namaAyah: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  />
                  {validationErrors.namaAyah && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.namaAyah}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ayah</label>
                  <select
                    value={formData.pekerjaanAyah}
                    onChange={e => setFormData({ ...formData, pekerjaanAyah: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="PNS / ASN">PNS / ASN</option>
                    <option value="TNI / Polri">TNI / Polri</option>
                    <option value="Karyawan Swasta">Karyawan Swasta</option>
                    <option value="Wiraswasta / Pengusaha">Wiraswasta / Pengusaha</option>
                    <option value="Buruh / Pekerja Lepas">Buruh / Pekerja Lepas</option>
                    <option value="Pensiunan">Pensiunan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Ibu Kandung <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.namaIbu}
                    onChange={e => setFormData({ ...formData, namaIbu: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  />
                  {validationErrors.namaIbu && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.namaIbu}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Ibu</label>
                  <select
                    value={formData.pekerjaanIbu}
                    onChange={e => setFormData({ ...formData, pekerjaanIbu: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="Ibu Rumah Tangga">Ibu Rumah Tangga</option>
                    <option value="PNS / ASN">PNS / ASN</option>
                    <option value="Karyawan Swasta">Karyawan Swasta</option>
                    <option value="Wiraswasta">Wiraswasta</option>
                    <option value="Guru / Dosen">Guru / Dosen</option>
                    <option value="Dokter / Tenaga Medis">Dokter / Tenaga Medis</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    No. Telepon / WhatsApp Orang Tua <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.noTeleponOrtu}
                    onChange={e => setFormData({ ...formData, noTeleponOrtu: e.target.value })}
                    placeholder="Contoh: 081298765432"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono"
                  />
                  {validationErrors.noTeleponOrtu && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.noTeleponOrtu}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rentang Penghasilan Orang Tua</label>
                  <select
                    value={formData.penghasilanOrtu}
                    onChange={e => setFormData({ ...formData, penghasilanOrtu: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="< Rp 1.000.000">&lt; Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 3.000.000">Rp 1.000.000 - Rp 3.000.000</option>
                    <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
                    <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
                    <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: AKADEMIK MASUK & KELAS */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-800 border-b pb-2">Langkah 3: Data Penerimaan & Penempatan Kelas</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Masuk</label>
                  <input
                    type="number"
                    value={formData.tahunMasuk}
                    onChange={e => {
                      const yr = parseInt(e.target.value, 10) || new Date().getFullYear();
                      setFormData({
                        ...formData,
                        tahunMasuk: yr,
                        angkatan: `${yr}/${yr + 1}`
                      });
                    }}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahun Angkatan</label>
                  <input
                    type="text"
                    value={formData.angkatan}
                    onChange={e => setFormData({ ...formData, angkatan: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Penempatan Kelas</label>
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={e => setFormData({ ...formData, kelas: e.target.value })}
                    placeholder="Misal: X-1, XI-MIPA-1, XII-IPS-2"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl font-bold uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Peminatan / Jurusan</label>
                  <select
                    value={formData.jurusan}
                    onChange={e => setFormData({ ...formData, jurusan: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="Fase E (Umum)">Fase E (Umum Kelas X)</option>
                    <option value="MIPA">MIPA (Matematika & Sains)</option>
                    <option value="IPS">IPS (Ilmu Pengetahuan Sosial)</option>
                    <option value="Bahasa">Bahasa & Budaya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jalur Masuk PPDB</label>
                  <select
                    value={formData.jalurMasuk}
                    onChange={e => setFormData({ ...formData, jalurMasuk: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  >
                    <option value="Zonasi">Zonasi Domisili</option>
                    <option value="Prestasi">Prestasi (Akademik / Non-Akademik)</option>
                    <option value="Afirmasi">Afirmasi (Keluarga Ekonomi Kurang Mampu)</option>
                    <option value="Perpindahan Tugas Orang Tua">Perpindahan Tugas Orang Tua</option>
                    <option value="Mandiri">Tes Mandiri Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asal SMP / MTs <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.asalSmp}
                    onChange={e => setFormData({ ...formData, asalSmp: e.target.value })}
                    placeholder="Nama SMP asal"
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-xl"
                  />
                  {validationErrors.asalSmp && <p className="text-[11px] text-rose-600 mt-1">{validationErrors.asalSmp}</p>}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: BERKAS DOKUMEN DIGITAL (UPLOAD) */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h4 className="text-sm font-bold text-slate-800">Langkah 4: Unggah Dokumen & Berkas Digital</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Maksimal ukuran file <strong>2MB</strong> per berkas. Format didukung: <strong>PDF, JPG, PNG</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Pas Foto */}
                <div className="p-4 border border-dashed rounded-xl bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Pas Foto Resmi (3x4)</span>
                    {formData.fotoUrl && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  {formData.fotoUrl ? (
                    <div className="flex items-center gap-3">
                      <img src={formData.fotoUrl} alt="Foto Siswa" className="w-12 h-14 object-cover rounded-md border" />
                      <span className="text-xs text-emerald-700 font-semibold">Foto Terunggah</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">Belum ada pas foto.</p>
                  )}
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={e => handleFileUpload(e, 'foto', 'Pas Foto Siswa')}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* 2. Kartu Keluarga (KK) */}
                <div className="p-4 border border-dashed rounded-xl bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Kartu Keluarga (KK)</span>
                    {formData.dokumen.some(d => d.type === 'kk') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {formData.dokumen.find(d => d.type === 'kk')?.fileName || 'Belum diunggah'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => handleFileUpload(e, 'kk', 'Kartu Keluarga')}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* 3. Akte Kelahiran */}
                <div className="p-4 border border-dashed rounded-xl bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Akte Kelahiran</span>
                    {formData.dokumen.some(d => d.type === 'akte') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {formData.dokumen.find(d => d.type === 'akte')?.fileName || 'Belum diunggah'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => handleFileUpload(e, 'akte', 'Akte Kelahiran')}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* 4. Ijazah SMP */}
                <div className="p-4 border border-dashed rounded-xl bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Ijazah / SKL SMP</span>
                    {formData.dokumen.some(d => d.type === 'ijazah') && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {formData.dokumen.find(d => d.type === 'ijazah')?.fileName || 'Belum diunggah'}
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={e => handleFileUpload(e, 'ijazah', 'Ijazah SMP')}
                    className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
            >
              &larr; Sebelumnya
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl"
            >
              Batal
            </button>

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-600 rounded-xl shadow-xs"
              >
                Lanjut Langkah {step + 1} &rarr;
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Simpan Seluruh Data Siswa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// SUB-KOMPONEN: DETAIL SISWA & DOSSIER MODAL
// -------------------------------------------------------------
interface StudentDetailModalProps {
  student: Student;
  onClose: () => void;
  onPrint: () => void;
  onEdit: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  onPrint,
  onEdit
}) => {
  const points = storage.getStudentTotalDisciplinePoints(student.id);
  const sanction = storage.getSanctionLevel(points);
  const academic = storage.getAcademicRecords().filter(a => a.studentId === student.id);
  const achievements = storage.getAchievements().filter(a => a.studentId === student.id);

  return (
    <div id="student-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#0f2b5c] text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={student.fotoUrl || 'https://via.placeholder.com/80?text=Foto'}
              alt={student.namaLengkap}
              className="w-16 h-20 object-cover rounded-xl border-2 border-white/20 shadow-md shrink-0"
            />
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-800 text-blue-200 rounded uppercase">
                {student.id}
              </span>
              <h3 className="text-xl font-extrabold mt-1">{student.namaLengkap}</h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Kelas: <strong>{student.kelas}</strong> &bull; Peminatan: <strong>{student.jurusan}</strong> &bull; NISN: {student.nisn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Dossier */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border">
              <span className="text-[11px] text-slate-500 block">Status Siswa</span>
              <span className="font-bold text-emerald-700">{student.statusSiswa}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border">
              <span className="text-[11px] text-slate-500 block">Poin Kedisiplinan</span>
              <span className={`font-bold ${points > 20 ? 'text-rose-600' : 'text-slate-800'}`}>
                {points} Poin ({sanction.level})
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border">
              <span className="text-[11px] text-slate-500 block">Prestasi Tercatat</span>
              <span className="font-bold text-amber-600">{achievements.length} Kejuaraan</span>
            </div>
          </div>

          {/* Identitas Diri */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b pb-1 text-xs uppercase tracking-wider text-blue-900">
              Identitas Pribadi & Domisili
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div><span className="text-slate-400 block">NIK:</span><span className="font-semibold font-mono">{student.nik}</span></div>
              <div><span className="text-slate-400 block">TTL:</span><span className="font-semibold">{student.tempatLahir}, {student.tanggalLahir}</span></div>
              <div><span className="text-slate-400 block">Jenis Kelamin / Agama:</span><span className="font-semibold">{student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} / {student.agama}</span></div>
              <div><span className="text-slate-400 block">No. HP Siswa:</span><span className="font-semibold font-mono">{student.noTelepon}</span></div>
              <div><span className="text-slate-400 block">Email:</span><span className="font-semibold">{student.email}</span></div>
              <div><span className="text-slate-400 block">Asal SMP:</span><span className="font-semibold">{student.asalSmp}</span></div>
              <div className="col-span-2 sm:col-span-3"><span className="text-slate-400 block">Alamat Rumah:</span><span className="font-semibold">{student.alamat}</span></div>
            </div>
          </div>

          {/* Orang Tua */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b pb-1 text-xs uppercase tracking-wider text-blue-900">
              Orang Tua / Wali
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs">
              <div><span className="text-slate-400 block">Nama Ayah:</span><span className="font-semibold">{student.namaAyah} ({student.pekerjaanAyah})</span></div>
              <div><span className="text-slate-400 block">Nama Ibu:</span><span className="font-semibold">{student.namaIbu} ({student.pekerjaanIbu})</span></div>
              <div><span className="text-slate-400 block">Kontak Ortu:</span><span className="font-semibold font-mono">{student.noTeleponOrtu}</span></div>
              <div><span className="text-slate-400 block">Penghasilan:</span><span className="font-semibold">{student.penghasilanOrtu}</span></div>
            </div>
          </div>

          {/* Berkas Dokumen */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b pb-1 text-xs uppercase tracking-wider text-blue-900">
              Berkas Arsip Digital
            </h4>
            {student.dokumen && student.dokumen.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {student.dokumen.map(doc => (
                  <div key={doc.id} className="p-2.5 rounded-lg border bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-semibold text-xs text-slate-800">{doc.name}</p>
                        <p className="text-[10px] text-slate-400">{doc.fileName} &bull; {(doc.fileSize / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    {doc.fileUrl && doc.fileUrl !== '#' && (
                      <a
                        href={doc.fileUrl}
                        download={doc.fileName}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        Unduh
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada dokumen digital yang dilampirkan.</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen Resmi (PDF)</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-xl text-xs shadow-xs"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Biodata</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
