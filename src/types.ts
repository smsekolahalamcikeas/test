export type UserRole = 'tata_usaha' | 'guru_bk' | 'wali_kelas' | 'kepala_sekolah';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl?: string;
  nip?: string;
  username: string;
}

export type Gender = 'L' | 'P';
export type Religion = 'Islam' | 'Kristen' | 'Katolik' | 'Hindu' | 'Buddha' | 'Konghucu';
export type StudentStatus = 'Aktif' | 'Lulus' | 'Pindah' | 'Keluar';
export type EntryPath = 'Zonasi' | 'Prestasi' | 'Afirmasi' | 'Perpindahan Tugas Orang Tua' | 'Mandiri';
export type Major = 'MIPA' | 'IPS' | 'Bahasa' | 'Fase E (Umum)';

export interface StudentDocument {
  id: string;
  name: string;
  type: 'kk' | 'akte' | 'ijazah' | 'foto' | 'lainnya';
  fileName: string;
  fileSize: number; // in bytes
  fileUrl?: string;
  uploadedAt: string;
}

export interface Student {
  id: string; // ID format: SISWA-YYYY-XXXX (e.g., SISWA-2024-0012)
  nisn: string; // 10 digits
  nis: string;
  nik: string; // 16 digits
  namaLengkap: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: Gender;
  agama: Religion;
  alamat: string;
  noTelepon: string;
  email: string;

  // Orang Tua / Wali
  namaAyah: string;
  pekerjaanAyah: string;
  namaIbu: string;
  pekerjaanIbu: string;
  noTeleponOrtu: string;
  penghasilanOrtu: string;

  // Data Akademik Masuk & Kelas
  tahunMasuk: number;
  angkatan: string; // e.g. "2024/2025"
  kelas: string; // e.g. "X-1", "XI-MIPA-2", "XII-IPS-1"
  jurusan: Major;
  jalurMasuk: EntryPath;
  asalSmp: string;
  statusSiswa: StudentStatus;

  // Berkas Dokumen Digital
  fotoUrl?: string;
  dokumen: StudentDocument[];

  createdAt: string;
  updatedAt: string;
}

export interface SubjectScore {
  namaMapel: string;
  kategori: 'Wajib' | 'Peminatan' | 'Muatan Lokal';
  kkm: number;
  nilaiPengetahuan: number;
  nilaiKeterampilan: number;
  nilaiAkhir: number;
  predikat: 'A' | 'B' | 'C' | 'D';
}

export interface AcademicRecord {
  id: string; // AKAD-YYYYMMDD-XXXX
  studentId: string;
  studentName: string;
  kelas: string;
  semester: 1 | 2 | 3 | 4 | 5 | 6;
  tahunAjaran: string; // e.g. "2024/2025"
  kurikulum: 'Kurikulum Merdeka' | 'Kurikulum 2013';
  mataPelajaran: SubjectScore[];
  rataRataNilai: number;
  rankingKelas?: number;
  catatanAkademik?: string;
  updatedAt: string;
}

export interface Achievement {
  id: string; // PRES-YYYYMMDD-XXXX
  studentId: string;
  studentName: string;
  kelas: string;
  namaLomba: string;
  peringkat: string; // e.g. Juara 1, Medali Emas, Harapan 2
  tingkat: 'Sekolah' | 'Kecamatan' | 'Kota/Kabupaten' | 'Provinsi' | 'Nasional' | 'Internasional';
  bidang: 'Akademik' | 'Sains & Riset' | 'Olahraga' | 'Seni & Budaya' | 'Robotika & IT' | 'Keagamaan';
  penyelenggara: string;
  tanggalPerolehan: string;
  guruPembimbing?: string;
  buktiSertifikatUrl?: string; // base64 or link drive
  createdAt: string;
}

export interface DisciplineRule {
  id: string;
  kategori: 'Ringan' | 'Sedang' | 'Berat';
  namaPelanggaran: string;
  poinDefault: number;
}

export interface DisciplineRecord {
  id: string; // DIS-YYYYMMDD-XXXX
  studentId: string;
  studentName: string;
  kelas: string;
  tanggalKejadian: string;
  jenisPelanggaran: string;
  kategori: 'Ringan' | 'Sedang' | 'Berat';
  poin: number;
  lokasi: string;
  guruPencatat: string;
  tindakanLangsung: string;
  statusPenanganan: 'Dalam Pembinaan' | 'Panggilan Orang Tua' | 'Surat Peringatan' | 'Selesai Dibina';
  catatanKonseling?: string;
  createdAt: string;
}

export interface TalentAssessment {
  id: string; // TAL-YYYYMMDD-XXXX
  studentId: string;
  studentName: string;
  tanggalTes: string;
  lembagaPsikotes: string;
  skorIq?: number;
  tipeHollandRiasec: string; // e.g. "IRC (Investigative, Realistic, Conventional)"
  gayaBelajar: 'Visual' | 'Auditori' | 'Kinestetik' | 'Campuran';
  minatKarir: string[];
  rekomendasiJurusanKuliah: string[];
  saranPengembangan?: string;
  konselorBk: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string; // formatted WIB timestamp
  userId: string;
  userName: string;
  userRole: string;
  module: 'Profil' | 'Akademik' | 'Prestasi' | 'Kedisiplinan' | 'BakatMinat' | 'Sistem';
  action: 'TAMBAH' | 'UBAH' | 'HAPUS' | 'EKSPOR' | 'LOGIN';
  recordId?: string;
  description: string;
}

export interface GasConfig {
  webAppUrl: string;
  spreadsheetId?: string;
  driveFolderId?: string;
  lastSyncedAt?: string;
}
