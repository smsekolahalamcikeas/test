import {
  User,
  Student,
  AcademicRecord,
  Achievement,
  DisciplineRecord,
  DisciplineRule,
  TalentAssessment,
  AuditLog
} from '../types';

export const DEFAULT_USERS: User[] = [
  {
    id: 'USR-TU-01',
    name: 'Budi Santoso, S.Kom',
    username: 'tata_usaha',
    role: 'tata_usaha',
    roleTitle: 'Staf Tata Usaha & Kesiswaan',
    nip: '198504122010011005',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-BK-01',
    name: 'Dra. Siti Rahmawati, M.Pd',
    username: 'guru_bk',
    role: 'guru_bk',
    roleTitle: 'Guru Bimbingan Konseling (BK)',
    nip: '197908152005012004',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-WK-01',
    name: 'Ahmad Fauzi, S.Pd',
    username: 'wali_kelas',
    role: 'wali_kelas',
    roleTitle: 'Wali Kelas XI-MIPA-1',
    nip: '198802202014021003',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'USR-KS-01',
    name: 'Dr. H. Bambang Hartono, M.M',
    username: 'kepala_sekolah',
    role: 'kepala_sekolah',
    roleTitle: 'Kepala Sekolah',
    nip: '196811051994031002',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const DISCIPLINE_RULES: DisciplineRule[] = [
  // Ringan (5 - 15 Poin)
  { id: 'R-01', kategori: 'Ringan', namaPelanggaran: 'Terlambat masuk sekolah (< 15 menit)', poinDefault: 5 },
  { id: 'R-02', kategori: 'Ringan', namaPelanggaran: 'Seragam tidak lengkap / tidak beratribut rapi', poinDefault: 5 },
  { id: 'R-03', kategori: 'Ringan', namaPelanggaran: 'Rambut tidak sesuai ketentuan tata tertib', poinDefault: 10 },
  { id: 'R-04', kategori: 'Ringan', namaPelanggaran: 'Membuang sampah sembarangan di lingkungan sekolah', poinDefault: 5 },
  { id: 'R-05', kategori: 'Ringan', namaPelanggaran: 'Menggunakan HP saat jam pelajaran tanpa izin guru', poinDefault: 15 },

  // Sedang (20 - 40 Poin)
  { id: 'S-01', kategori: 'Sedang', namaPelanggaran: 'Meninggalkan kelas/sekolah tanpa izin (Bolos)', poinDefault: 25 },
  { id: 'S-02', kategori: 'Sedang', namaPelanggaran: 'Melompati pagar sekolah', poinDefault: 30 },
  { id: 'S-03', kategori: 'Sedang', namaPelanggaran: 'Mencontek / kecurangan saat asesmen sumatif', poinDefault: 25 },
  { id: 'S-04', kategori: 'Sedang', namaPelanggaran: 'Membawa rokok / vape / rokok elektrik', poinDefault: 40 },
  { id: 'S-05', kategori: 'Sedang', namaPelanggaran: 'Mengotori / merusak sarana dan prasarana sekolah', poinDefault: 30 },

  // Berat (50 - 100 Poin)
  { id: 'B-01', kategori: 'Berat', namaPelanggaran: 'Perundungan / Bullying (Fisik, Verbal, Siber)', poinDefault: 60 },
  { id: 'B-02', kategori: 'Berat', namaPelanggaran: 'Terlibat perkelahian / tawuran antar pelajar', poinDefault: 75 },
  { id: 'B-03', kategori: 'Berat', namaPelanggaran: 'Membawa senjata tajam atau senjata berbahaya', poinDefault: 80 },
  { id: 'B-04', kategori: 'Berat', namaPelanggaran: 'Membawa / mengonsumsi miras atau narkoba', poinDefault: 100 },
  { id: 'B-05', kategori: 'Berat', namaPelanggaran: 'Melakukan tindakan asusila / pelanggaran norma berat', poinDefault: 100 }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'SISWA-2024-0001',
    nisn: '0067823910',
    nis: '24251001',
    nik: '3273012504070001',
    namaLengkap: 'Muhammad Rizky Pratama',
    tempatLahir: 'Bandung',
    tanggalLahir: '2007-04-25',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'Jl. Dago Asri No. 42, Coblong, Kota Bandung',
    noTelepon: '081223344556',
    email: 'm.rizky.pratama@gmail.com',

    namaAyah: 'Hendra Pratama, S.T',
    pekerjaanAyah: 'Karyawan Swasta',
    namaIbu: 'Dewi Lestari, S.Pd',
    pekerjaanIbu: 'Guru / Dosen',
    noTeleponOrtu: '081398765432',
    penghasilanOrtu: 'Rp 5.000.000 - Rp 10.000.000',

    tahunMasuk: 2023,
    angkatan: '2023/2024',
    kelas: 'XI-MIPA-1',
    jurusan: 'MIPA',
    jalurMasuk: 'Prestasi',
    asalSmp: 'SMP Negeri 1 Bandung',
    statusSiswa: 'Aktif',

    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    dokumen: [
      { id: 'DOC-01', name: 'Kartu Keluarga', type: 'kk', fileName: 'KK_Rizky_Pratama.pdf', fileSize: 412000, fileUrl: '#', uploadedAt: '2023-07-15' },
      { id: 'DOC-02', name: 'Akte Kelahiran', type: 'akte', fileName: 'Akte_Rizky.pdf', fileSize: 320000, fileUrl: '#', uploadedAt: '2023-07-15' },
      { id: 'DOC-03', name: 'Ijazah SMP', type: 'ijazah', fileName: 'Ijazah_SMP1_Rizky.pdf', fileSize: 850000, fileUrl: '#', uploadedAt: '2023-07-15' }
    ],
    createdAt: '2023-07-15 08:30:00 WIB',
    updatedAt: '2024-08-10 14:15:00 WIB'
  },
  {
    id: 'SISWA-2024-0002',
    nisn: '0071982455',
    nis: '24251002',
    nik: '3273026108070002',
    namaLengkap: 'Annisa Putri Maharani',
    tempatLahir: 'Jakarta',
    tanggalLahir: '2007-08-21',
    jenisKelamin: 'P',
    agama: 'Islam',
    alamat: 'Jl. Cisitu Indah V No. 18, Dago, Bandung',
    noTelepon: '081399887766',
    email: 'annisa.maharani@gmail.com',

    namaAyah: 'Bambang Irawan',
    pekerjaanAyah: 'Wiraswasta / Pengusaha',
    namaIbu: 'Rina Kusuma',
    pekerjaanIbu: 'Ibu Rumah Tangga',
    noTeleponOrtu: '081233449900',
    penghasilanOrtu: '> Rp 10.000.000',

    tahunMasuk: 2023,
    angkatan: '2023/2024',
    kelas: 'XI-MIPA-1',
    jurusan: 'MIPA',
    jalurMasuk: 'Zonasi',
    asalSmp: 'SMP Negeri 5 Bandung',
    statusSiswa: 'Aktif',

    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    dokumen: [
      { id: 'DOC-04', name: 'Kartu Keluarga', type: 'kk', fileName: 'KK_Annisa.pdf', fileSize: 390000, fileUrl: '#', uploadedAt: '2023-07-16' },
      { id: 'DOC-05', name: 'Akte Kelahiran', type: 'akte', fileName: 'Akte_Annisa.pdf', fileSize: 280000, fileUrl: '#', uploadedAt: '2023-07-16' },
      { id: 'DOC-06', name: 'Ijazah SMP', type: 'ijazah', fileName: 'Ijazah_SMP5_Annisa.pdf', fileSize: 720000, fileUrl: '#', uploadedAt: '2023-07-16' }
    ],
    createdAt: '2023-07-16 09:15:00 WIB',
    updatedAt: '2024-07-20 11:00:00 WIB'
  },
  {
    id: 'SISWA-2024-0003',
    nisn: '0065432190',
    nis: '24251003',
    nik: '3273031201070003',
    namaLengkap: 'Fajar Nugraha',
    tempatLahir: 'Cimahi',
    tanggalLahir: '2007-01-12',
    jenisKelamin: 'L',
    agama: 'Islam',
    alamat: 'Jl. Sangkuriang No. 77, Coblong, Bandung',
    noTelepon: '085712348899',
    email: 'fajar.nugraha07@gmail.com',

    namaAyah: 'Agus Nugraha',
    pekerjaanAyah: 'PNS / ASN',
    namaIbu: 'Sri Wahyuni',
    pekerjaanIbu: 'Karyawan Swasta',
    noTeleponOrtu: '085698761122',
    penghasilanOrtu: 'Rp 5.000.000 - Rp 10.000.000',

    tahunMasuk: 2023,
    angkatan: '2023/2024',
    kelas: 'XI-IPS-2',
    jurusan: 'IPS',
    jalurMasuk: 'Zonasi',
    asalSmp: 'SMP Negeri 2 Cimahi',
    statusSiswa: 'Aktif',

    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    dokumen: [
      { id: 'DOC-07', name: 'Kartu Keluarga', type: 'kk', fileName: 'KK_Fajar.pdf', fileSize: 350000, fileUrl: '#', uploadedAt: '2023-07-16' },
      { id: 'DOC-08', name: 'Akte Kelahiran', type: 'akte', fileName: 'Akte_Fajar.pdf', fileSize: 310000, fileUrl: '#', uploadedAt: '2023-07-16' }
    ],
    createdAt: '2023-07-16 10:20:00 WIB',
    updatedAt: '2024-06-18 13:40:00 WIB'
  },
  {
    id: 'SISWA-2024-0004',
    nisn: '0089123456',
    nis: '24251004',
    nik: '3273045511080004',
    namaLengkap: 'Clarissa Jessica Wijaya',
    tempatLahir: 'Surabaya',
    tanggalLahir: '2008-11-15',
    jenisKelamin: 'P',
    agama: 'Kristen',
    alamat: 'Komp. Setiabudhi Regency Blok B-12, Bandung',
    noTelepon: '081299881122',
    email: 'clarissa.wijaya@outlook.com',

    namaAyah: 'David Wijaya',
    pekerjaanAyah: 'Wiraswasta / Pengusaha',
    namaIbu: 'Silvia Tanuwijaya',
    pekerjaanIbu: 'Wiraswasta',
    noTeleponOrtu: '081122334455',
    penghasilanOrtu: '> Rp 10.000.000',

    tahunMasuk: 2024,
    angkatan: '2024/2025',
    kelas: 'X-1',
    jurusan: 'Fase E (Umum)',
    jalurMasuk: 'Mandiri',
    asalSmp: 'SMP Kristen 1 Bandung',
    statusSiswa: 'Aktif',

    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    dokumen: [
      { id: 'DOC-09', name: 'Kartu Keluarga', type: 'kk', fileName: 'KK_Clarissa.pdf', fileSize: 460000, fileUrl: '#', uploadedAt: '2024-07-10' },
      { id: 'DOC-10', name: 'Akte Kelahiran', type: 'akte', fileName: 'Akte_Clarissa.pdf', fileSize: 340000, fileUrl: '#', uploadedAt: '2024-07-10' },
      { id: 'DOC-11', name: 'Ijazah SMP', type: 'ijazah', fileName: 'Ijazah_Clarissa.pdf', fileSize: 810000, fileUrl: '#', uploadedAt: '2024-07-10' }
    ],
    createdAt: '2024-07-10 09:00:00 WIB',
    updatedAt: '2024-07-10 09:00:00 WIB'
  }
];

export const INITIAL_ACADEMICS: AcademicRecord[] = [
  {
    id: 'AKAD-202401-001',
    studentId: 'SISWA-2024-0001',
    studentName: 'Muhammad Rizky Pratama',
    kelas: 'XI-MIPA-1',
    semester: 3,
    tahunAjaran: '2024/2025',
    kurikulum: 'Kurikulum Merdeka',
    rataRataNilai: 91.2,
    rankingKelas: 2,
    catatanAkademik: 'Prestasi sangat menonjol di bidang Matematika Tingkat Lanjut dan Fisika.',
    mataPelajaran: [
      { namaMapel: 'Pendidikan Agama & Budi Pekerti', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 90, nilaiKeterampilan: 92, nilaiAkhir: 91, predikat: 'A' },
      { namaMapel: 'Pendidikan Pancasila', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 88, nilaiKeterampilan: 89, nilaiAkhir: 88.5, predikat: 'A' },
      { namaMapel: 'Bahasa Indonesia', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 87, nilaiKeterampilan: 88, nilaiAkhir: 87.5, predikat: 'B' },
      { namaMapel: 'Matematika Tingkat Lanjut', kategori: 'Peminatan', kkm: 75, nilaiPengetahuan: 96, nilaiKeterampilan: 98, nilaiAkhir: 97, predikat: 'A' },
      { namaMapel: 'Fisika', kategori: 'Peminatan', kkm: 75, nilaiPengetahuan: 94, nilaiKeterampilan: 95, nilaiAkhir: 94.5, predikat: 'A' },
      { namaMapel: 'Kimia', kategori: 'Peminatan', kkm: 75, nilaiPengetahuan: 90, nilaiKeterampilan: 92, nilaiAkhir: 91, predikat: 'A' },
      { namaMapel: 'Bahasa Inggris', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 88, nilaiKeterampilan: 90, nilaiAkhir: 89, predikat: 'A' }
    ],
    updatedAt: '2024-12-20 10:00:00 WIB'
  },
  {
    id: 'AKAD-202401-002',
    studentId: 'SISWA-2024-0002',
    studentName: 'Annisa Putri Maharani',
    kelas: 'XI-MIPA-1',
    semester: 3,
    tahunAjaran: '2024/2025',
    kurikulum: 'Kurikulum Merdeka',
    rataRataNilai: 93.4,
    rankingKelas: 1,
    catatanAkademik: 'Sangat tekun dan konsisten di seluruh rumpun sains dan bahasa Inggris.',
    mataPelajaran: [
      { namaMapel: 'Pendidikan Agama & Budi Pekerti', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 92, nilaiKeterampilan: 94, nilaiAkhir: 93, predikat: 'A' },
      { namaMapel: 'Pendidikan Pancasila', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 91, nilaiKeterampilan: 92, nilaiAkhir: 91.5, predikat: 'A' },
      { namaMapel: 'Bahasa Indonesia', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 93, nilaiKeterampilan: 94, nilaiAkhir: 93.5, predikat: 'A' },
      { namaMapel: 'Matematika Tingkat Lanjut', kategori: 'Peminatan', kkm: 75, nilaiPengetahuan: 95, nilaiKeterampilan: 96, nilaiAkhir: 95.5, predikat: 'A' },
      { namaMapel: 'Biologi', kategori: 'Peminatan', kkm: 75, nilaiPengetahuan: 96, nilaiKeterampilan: 97, nilaiAkhir: 96.5, predikat: 'A' },
      { namaMapel: 'Kimia', kategori: 'Peminatan', kkm: 75, nilaiPengetahuan: 92, nilaiKeterampilan: 94, nilaiAkhir: 93, predikat: 'A' },
      { namaMapel: 'Bahasa Inggris', kategori: 'Wajib', kkm: 75, nilaiPengetahuan: 91, nilaiKeterampilan: 93, nilaiAkhir: 92, predikat: 'A' }
    ],
    updatedAt: '2024-12-20 10:30:00 WIB'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'PRES-2024-001',
    studentId: 'SISWA-2024-0001',
    studentName: 'Muhammad Rizky Pratama',
    kelas: 'XI-MIPA-1',
    namaLomba: 'Olimpiade Sains Nasional (OSN) Bidang Fisika',
    peringkat: 'Medali Perak (Juara 2)',
    tingkat: 'Nasional',
    bidang: 'Sains & Riset',
    penyelenggara: 'Balai Pengembangan Talenta Indonesia (BPTI) Kemdikbudristek',
    tanggalPerolehan: '2024-08-30',
    guruPembimbing: 'Drs. Supriyadi, M.Si',
    buktiSertifikatUrl: '#',
    createdAt: '2024-09-02 09:00:00 WIB'
  },
  {
    id: 'PRES-2024-002',
    studentId: 'SISWA-2024-0002',
    studentName: 'Annisa Putri Maharani',
    kelas: 'XI-MIPA-1',
    namaLomba: 'Lomba Debat Bahasa Inggris National Schools Debating Championship (NSDC)',
    peringkat: 'Juara 1 & Best Speaker',
    tingkat: 'Provinsi',
    bidang: 'Akademik',
    penyelenggara: 'Dinas Pendidikan Provinsi Jawa Barat',
    tanggalPerolehan: '2024-06-15',
    guruPembimbing: 'Nurul Hidayati, S.Pd',
    buktiSertifikatUrl: '#',
    createdAt: '2024-06-18 10:15:00 WIB'
  }
];

export const INITIAL_DISCIPLINES: DisciplineRecord[] = [
  {
    id: 'DIS-2024-001',
    studentId: 'SISWA-2024-0003',
    studentName: 'Fajar Nugraha',
    kelas: 'XI-IPS-2',
    tanggalKejadian: '2024-09-05',
    jenisPelanggaran: 'Terlambat masuk sekolah (> 20 menit)',
    kategori: 'Ringan',
    poin: 5,
    lokasi: 'Gerbang Depan Sekolah',
    guruPencatat: 'Asep Kusnadi, S.Pd (Guru Piket)',
    tindakanLangsung: 'Diberikan teguran lisan dan menyanyikan lagu Indonesia Raya',
    statusPenanganan: 'Dalam Pembinaan',
    catatanKonseling: 'Siswa mengalami kendala rantai motor putus di perjalanan.',
    createdAt: '2024-09-05 07:30:00 WIB'
  },
  {
    id: 'DIS-2024-002',
    studentId: 'SISWA-2024-0003',
    studentName: 'Fajar Nugraha',
    kelas: 'XI-IPS-2',
    tanggalKejadian: '2024-09-18',
    jenisPelanggaran: 'Meninggalkan kelas saat jam pelajaran tanpa izin (Bolos)',
    kategori: 'Sedang',
    poin: 25,
    lokasi: 'Kantin Belakang Sekolah',
    guruPencatat: 'Dra. Siti Rahmawati, M.Pd (Guru BK)',
    tindakanLangsung: 'Dipanggil ke ruang BK untuk klarifikasi',
    statusPenanganan: 'Panggilan Orang Tua',
    catatanKonseling: 'Telah diklarifikasi bersama orang tua. Siswa berjanji tidak mengulangi dan menandatangani surat komitmen.',
    createdAt: '2024-09-18 11:20:00 WIB'
  }
];

export const INITIAL_TALENTS: TalentAssessment[] = [
  {
    id: 'TAL-2024-001',
    studentId: 'SISWA-2024-0001',
    studentName: 'Muhammad Rizky Pratama',
    tanggalTes: '2023-09-12',
    lembagaPsikotes: 'Lembaga Psikologi Terapan Universitas Indonesia',
    skorIq: 132,
    tipeHollandRiasec: 'IRC (Investigative, Realistic, Conventional)',
    gayaBelajar: 'Visual',
    minatKarir: ['Peneliti Fisika', 'Software Engineer', 'Teknik Penerbangan'],
    rekomendasiJurusanKuliah: ['Fisika Murni (ITB/UI)', 'Teknik Informatika (ITB)', 'Teknik Dirgantara (ITB)'],
    saranPengembangan: 'Diberikan ruang bimbingan intensif olimpiade dan penguatan portofolio SNBP.',
    konselorBk: 'Dra. Siti Rahmawati, M.Pd',
    createdAt: '2023-09-20 10:00:00 WIB'
  },
  {
    id: 'TAL-2024-002',
    studentId: 'SISWA-2024-0002',
    studentName: 'Annisa Putri Maharani',
    tanggalTes: '2023-09-12',
    lembagaPsikotes: 'Lembaga Psikologi Terapan Universitas Indonesia',
    skorIq: 128,
    tipeHollandRiasec: 'SIA (Social, Investigative, Artistic)',
    gayaBelajar: 'Auditori',
    minatKarir: ['Diplomat / Hubungan Internasional', 'Dokter Umum', 'Psikolog Klinis'],
    rekomendasiJurusanKuliah: ['Kedokteran (UI/UNPAD)', 'Hubungan Internasional (UI/UGM)', 'Psikologi (UNPAD)'],
    saranPengembangan: 'Didorong mengikuti kompetisi debat internasional dan kepemimpinan OSIS.',
    konselorBk: 'Dra. Siti Rahmawati, M.Pd',
    createdAt: '2023-09-20 10:30:00 WIB'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2024-09-10 08:00:15 WIB',
    userId: 'USR-TU-01',
    userName: 'Budi Santoso, S.Kom',
    userRole: 'tata_usaha',
    module: 'Sistem',
    action: 'LOGIN',
    description: 'Masuk ke Sistem Database Terpadu SIDATA SMA.'
  },
  {
    id: 'LOG-002',
    timestamp: '2024-09-10 08:30:40 WIB',
    userId: 'USR-TU-01',
    userName: 'Budi Santoso, S.Kom',
    userRole: 'tata_usaha',
    module: 'Profil',
    action: 'TAMBAH',
    recordId: 'SISWA-2024-0004',
    description: 'Menambahkan siswa baru: Clarissa Jessica Wijaya (X-1).'
  },
  {
    id: 'LOG-003',
    timestamp: '2024-09-10 09:15:22 WIB',
    userId: 'USR-BK-01',
    userName: 'Dra. Siti Rahmawati, M.Pd',
    userRole: 'guru_bk',
    module: 'Kedisiplinan',
    action: 'TAMBAH',
    recordId: 'DIS-2024-002',
    description: 'Mencatat penambahan poin sanksi (+25 poin) untuk Fajar Nugraha.'
  }
];
