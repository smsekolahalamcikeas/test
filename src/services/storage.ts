import {
  Student,
  AcademicRecord,
  Achievement,
  DisciplineRecord,
  TalentAssessment,
  AuditLog,
  User
} from '../types';
import {
  DEFAULT_USERS,
  INITIAL_STUDENTS,
  INITIAL_ACADEMICS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_DISCIPLINES,
  INITIAL_TALENTS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'sidata_current_user',
  STUDENTS: 'sidata_students',
  ACADEMIC: 'sidata_academic',
  ACHIEVEMENTS: 'sidata_achievements',
  DISCIPLINE: 'sidata_discipline',
  TALENT: 'sidata_talent',
  AUDIT_LOGS: 'sidata_audit_logs',
  GAS_URL: 'sidata_gas_url'
};

// Formatter Waktu WIB (Asia/Jakarta)
export function getWibTimestamp(): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }); // YYYY-MM-DD
  const timeStr = now.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour12: false
  });
  return `${dateStr} ${timeStr} WIB`;
}

// Format ID Berbasis Timestamp
export function generateRecordId(prefix: string): string {
  const now = new Date();
  const yr = now.getFullYear();
  const mo = String(now.getMonth() + 1).padStart(2, '0');
  const da = String(now.getDate()).padStart(2, '0');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${yr}${mo}${da}-${randomSuffix}`;
}

export const storage = {
  // Current Active User
  getCurrentUser(): User {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_USERS[0]; // default Tata Usaha
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.addAuditLog('Sistem', 'LOGIN', user.id, `Beralih peran menjadi: ${user.name} (${user.roleTitle})`);
  },

  // GAS Web App URL
  getGasUrl(): string {
    return localStorage.getItem(STORAGE_KEYS.GAS_URL) || '';
  },

  setGasUrl(url: string): void {
    localStorage.setItem(STORAGE_KEYS.GAS_URL, url);
  },

  // STUDENTS CRUD
  getStudents(): Student[] {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_STUDENTS;
    }
  },

  saveStudent(student: Partial<Student>): Student {
    const students = this.getStudents();
    const isEdit = !!student.id;
    let savedStudent: Student;

    if (isEdit) {
      const idx = students.findIndex(s => s.id === student.id);
      if (idx !== -1) {
        savedStudent = {
          ...students[idx],
          ...student,
          updatedAt: getWibTimestamp()
        } as Student;
        students[idx] = savedStudent;
        this.addAuditLog('Profil', 'UBAH', savedStudent.id, `Memperbarui biodata siswa: ${savedStudent.namaLengkap} (${savedStudent.kelas})`);
      } else {
        throw new Error('Student not found');
      }
    } else {
      const yr = new Date().getFullYear();
      const count = students.length + 1;
      const id = `SISWA-${yr}-${String(count).padStart(4, '0')}`;
      savedStudent = {
        id,
        nisn: student.nisn || '',
        nis: student.nis || '',
        nik: student.nik || '',
        namaLengkap: student.namaLengkap || '',
        tempatLahir: student.tempatLahir || '',
        tanggalLahir: student.tanggalLahir || '',
        jenisKelamin: student.jenisKelamin || 'L',
        agama: student.agama || 'Islam',
        alamat: student.alamat || '',
        noTelepon: student.noTelepon || '',
        email: student.email || '',

        namaAyah: student.namaAyah || '',
        pekerjaanAyah: student.pekerjaanAyah || '',
        namaIbu: student.namaIbu || '',
        pekerjaanIbu: student.pekerjaanIbu || '',
        noTeleponOrtu: student.noTeleponOrtu || '',
        penghasilanOrtu: student.penghasilanOrtu || '',

        tahunMasuk: student.tahunMasuk || yr,
        angkatan: student.angkatan || `${yr}/${yr + 1}`,
        kelas: student.kelas || 'X-1',
        jurusan: student.jurusan || 'Fase E (Umum)',
        jalurMasuk: student.jalurMasuk || 'Zonasi',
        asalSmp: student.asalSmp || '',
        statusSiswa: student.statusSiswa || 'Aktif',

        fotoUrl: student.fotoUrl || '',
        dokumen: student.dokumen || [],
        createdAt: getWibTimestamp(),
        updatedAt: getWibTimestamp()
      };
      students.unshift(savedStudent);
      this.addAuditLog('Profil', 'TAMBAH', savedStudent.id, `Mendaftarkan siswa baru: ${savedStudent.namaLengkap} (${savedStudent.kelas})`);
    }

    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.syncToGas('saveStudent', savedStudent);
    return savedStudent;
  },

  deleteStudent(id: string): boolean {
    const students = this.getStudents();
    const target = students.find(s => s.id === id);
    if (!target) return false;

    const filtered = students.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
    this.addAuditLog('Profil', 'HAPUS', id, `Menghapus data siswa: ${target.namaLengkap}`);
    this.syncToGas('deleteStudent', { id });
    return true;
  },

  // ACADEMIC RECORDS
  getAcademicRecords(): AcademicRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACADEMIC);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ACADEMIC, JSON.stringify(INITIAL_ACADEMICS));
      return INITIAL_ACADEMICS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_ACADEMICS;
    }
  },

  saveAcademicRecord(record: Partial<AcademicRecord>): AcademicRecord {
    const records = this.getAcademicRecords();
    const isEdit = !!record.id;
    let saved: AcademicRecord;

    // Kalkulasi rata-rata otomatis
    const sum = (record.mataPelajaran || []).reduce((acc, mp) => acc + (mp.nilaiAkhir || 0), 0);
    const avg = record.mataPelajaran && record.mataPelajaran.length > 0
      ? Number((sum / record.mataPelajaran.length).toFixed(1))
      : 0;

    if (isEdit) {
      const idx = records.findIndex(r => r.id === record.id);
      if (idx !== -1) {
        saved = {
          ...records[idx],
          ...record,
          rataRataNilai: avg,
          updatedAt: getWibTimestamp()
        } as AcademicRecord;
        records[idx] = saved;
        this.addAuditLog('Akademik', 'UBAH', saved.id, `Memperbarui nilai semester ${saved.semester} siswa: ${saved.studentName}`);
      } else {
        throw new Error('Record not found');
      }
    } else {
      saved = {
        id: generateRecordId('AKAD'),
        studentId: record.studentId || '',
        studentName: record.studentName || '',
        kelas: record.kelas || '',
        semester: record.semester || 1,
        tahunAjaran: record.tahunAjaran || '2024/2025',
        kurikulum: record.kurikulum || 'Kurikulum Merdeka',
        mataPelajaran: record.mataPelajaran || [],
        rataRataNilai: avg,
        rankingKelas: record.rankingKelas,
        catatanAkademik: record.catatanAkademik || '',
        updatedAt: getWibTimestamp()
      };
      records.unshift(saved);
      this.addAuditLog('Akademik', 'TAMBAH', saved.id, `Menginput nilai semester ${saved.semester} siswa: ${saved.studentName} (Rata-rata: ${avg})`);
    }

    localStorage.setItem(STORAGE_KEYS.ACADEMIC, JSON.stringify(records));
    this.syncToGas('saveAcademic', saved);
    return saved;
  },

  deleteAcademicRecord(id: string): boolean {
    const records = this.getAcademicRecords();
    const target = records.find(r => r.id === id);
    if (!target) return false;

    const filtered = records.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACADEMIC, JSON.stringify(filtered));
    this.addAuditLog('Akademik', 'HAPUS', id, `Menghapus nilai semester ${target.semester} siswa: ${target.studentName}`);
    this.syncToGas('deleteAcademic', { id });
    return true;
  },

  // ACHIEVEMENTS
  getAchievements(): Achievement[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return INITIAL_ACHIEVEMENTS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_ACHIEVEMENTS;
    }
  },

  saveAchievement(item: Partial<Achievement>): Achievement {
    const achievements = this.getAchievements();
    const isEdit = !!item.id;
    let saved: Achievement;

    if (isEdit) {
      const idx = achievements.findIndex(a => a.id === item.id);
      if (idx !== -1) {
        saved = { ...achievements[idx], ...item } as Achievement;
        achievements[idx] = saved;
        this.addAuditLog('Prestasi', 'UBAH', saved.id, `Memperbarui prestasi: ${saved.namaLomba} (${saved.studentName})`);
      } else {
        throw new Error('Not found');
      }
    } else {
      saved = {
        id: generateRecordId('PRES'),
        studentId: item.studentId || '',
        studentName: item.studentName || '',
        kelas: item.kelas || '',
        namaLomba: item.namaLomba || '',
        peringkat: item.peringkat || 'Juara 1',
        tingkat: item.tingkat || 'Sekolah',
        bidang: item.bidang || 'Akademik',
        penyelenggara: item.penyelenggara || '',
        tanggalPerolehan: item.tanggalPerolehan || new Date().toISOString().slice(0, 10),
        guruPembimbing: item.guruPembimbing || '',
        buktiSertifikatUrl: item.buktiSertifikatUrl || '',
        createdAt: getWibTimestamp()
      };
      achievements.unshift(saved);
      this.addAuditLog('Prestasi', 'TAMBAH', saved.id, `Mencatat prestasi baru: ${saved.namaLomba} - ${saved.peringkat} (${saved.studentName})`);
    }

    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    this.syncToGas('saveAchievement', saved);
    return saved;
  },

  deleteAchievement(id: string): boolean {
    const list = this.getAchievements();
    const target = list.find(a => a.id === id);
    if (!target) return false;

    const filtered = list.filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(filtered));
    this.addAuditLog('Prestasi', 'HAPUS', id, `Menghapus rekaman prestasi: ${target.namaLomba}`);
    this.syncToGas('deleteAchievement', { id });
    return true;
  },

  // DISCIPLINE RECORDS
  getDisciplineRecords(): DisciplineRecord[] {
    const data = localStorage.getItem(STORAGE_KEYS.DISCIPLINE);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.DISCIPLINE, JSON.stringify(INITIAL_DISCIPLINES));
      return INITIAL_DISCIPLINES;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_DISCIPLINES;
    }
  },

  saveDisciplineRecord(item: Partial<DisciplineRecord>): DisciplineRecord {
    const list = this.getDisciplineRecords();
    const isEdit = !!item.id;
    let saved: DisciplineRecord;

    if (isEdit) {
      const idx = list.findIndex(d => d.id === item.id);
      if (idx !== -1) {
        saved = { ...list[idx], ...item } as DisciplineRecord;
        list[idx] = saved;
        this.addAuditLog('Kedisiplinan', 'UBAH', saved.id, `Memperbarui log kedisiplinan: ${saved.jenisPelanggaran} (${saved.studentName})`);
      } else {
        throw new Error('Not found');
      }
    } else {
      saved = {
        id: generateRecordId('DIS'),
        studentId: item.studentId || '',
        studentName: item.studentName || '',
        kelas: item.kelas || '',
        tanggalKejadian: item.tanggalKejadian || new Date().toISOString().slice(0, 10),
        jenisPelanggaran: item.jenisPelanggaran || '',
        kategori: item.kategori || 'Ringan',
        poin: item.poin || 5,
        lokasi: item.lokasi || 'Lingkungan Sekolah',
        guruPencatat: item.guruPencatat || '',
        tindakanLangsung: item.tindakanLangsung || '',
        statusPenanganan: item.statusPenanganan || 'Dalam Pembinaan',
        catatanKonseling: item.catatanKonseling || '',
        createdAt: getWibTimestamp()
      };
      list.unshift(saved);
      this.addAuditLog('Kedisiplinan', 'TAMBAH', saved.id, `Mencatat pelanggaran tata tertib: ${saved.jenisPelanggaran} (+${saved.poin} poin) untuk ${saved.studentName}`);
    }

    localStorage.setItem(STORAGE_KEYS.DISCIPLINE, JSON.stringify(list));
    this.syncToGas('saveDiscipline', saved);
    return saved;
  },

  deleteDisciplineRecord(id: string): boolean {
    const list = this.getDisciplineRecords();
    const target = list.find(d => d.id === id);
    if (!target) return false;

    const filtered = list.filter(d => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE, JSON.stringify(filtered));
    this.addAuditLog('Kedisiplinan', 'HAPUS', id, `Menghapus pelanggaran: ${target.jenisPelanggaran} (${target.studentName})`);
    this.syncToGas('deleteDiscipline', { id });
    return true;
  },

  getStudentTotalDisciplinePoints(studentId: string): number {
    const records = this.getDisciplineRecords().filter(d => d.studentId === studentId);
    return records.reduce((sum, r) => sum + (r.poin || 0), 0);
  },

  getSanctionLevel(points: number): { level: string; badgeColor: string; description: string } {
    if (points === 0) {
      return { level: 'Tertib & Disiplin', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', description: 'Tidak ada pelanggaran tercatat.' };
    }
    if (points <= 10) {
      return { level: 'Peringatan Ringan', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200', description: 'Masih dalam batas toleransi pembinaan kelas.' };
    }
    if (points <= 25) {
      return { level: 'Peringatan Lisan', badgeColor: 'bg-blue-100 text-blue-800 border-blue-200', description: 'Teguran lisan dan bimbingan wali kelas.' };
    }
    if (points <= 50) {
      return { level: 'Panggilan Orang Tua I', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300', description: 'Surat panggilan orang tua tahap 1 oleh Guru BK.' };
    }
    if (points <= 75) {
      return { level: 'Panggilan Ortu II / SP', badgeColor: 'bg-orange-100 text-orange-800 border-orange-300', description: 'Surat Peringatan (SP) dan penandatanganan pakta integritas.' };
    }
    return { level: 'Skorsing / Sidang Kasus', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300', description: 'Skorsing akademis dan sidang dewan guru/kepala sekolah.' };
  },

  // TALENT ASSESSMENTS
  getTalentAssessments(): TalentAssessment[] {
    const data = localStorage.getItem(STORAGE_KEYS.TALENT);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TALENT, JSON.stringify(INITIAL_TALENTS));
      return INITIAL_TALENTS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_TALENTS;
    }
  },

  saveTalentAssessment(item: Partial<TalentAssessment>): TalentAssessment {
    const list = this.getTalentAssessments();
    const isEdit = !!item.id;
    let saved: TalentAssessment;

    if (isEdit) {
      const idx = list.findIndex(t => t.id === item.id);
      if (idx !== -1) {
        saved = { ...list[idx], ...item } as TalentAssessment;
        list[idx] = saved;
        this.addAuditLog('BakatMinat', 'UBAH', saved.id, `Memperbarui hasil asesmen psikotes: ${saved.studentName}`);
      } else {
        throw new Error('Not found');
      }
    } else {
      saved = {
        id: generateRecordId('TAL'),
        studentId: item.studentId || '',
        studentName: item.studentName || '',
        tanggalTes: item.tanggalTes || new Date().toISOString().slice(0, 10),
        lembagaPsikotes: item.lembagaPsikotes || '',
        skorIq: item.skorIq,
        tipeHollandRiasec: item.tipeHollandRiasec || '',
        gayaBelajar: item.gayaBelajar || 'Visual',
        minatKarir: item.minatKarir || [],
        rekomendasiJurusanKuliah: item.rekomendasiJurusanKuliah || [],
        saranPengembangan: item.saranPengembangan || '',
        konselorBk: item.konselorBk || '',
        createdAt: getWibTimestamp()
      };
      list.unshift(saved);
      this.addAuditLog('BakatMinat', 'TAMBAH', saved.id, `Menambahkan hasil psikotes & minat karir untuk: ${saved.studentName}`);
    }

    localStorage.setItem(STORAGE_KEYS.TALENT, JSON.stringify(list));
    this.syncToGas('saveTalent', saved);
    return saved;
  },

  deleteTalentAssessment(id: string): boolean {
    const list = this.getTalentAssessments();
    const target = list.find(t => t.id === id);
    if (!target) return false;

    const filtered = list.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TALENT, JSON.stringify(filtered));
    this.addAuditLog('BakatMinat', 'HAPUS', id, `Menghapus asesmen bakat minat: ${target.studentName}`);
    this.syncToGas('deleteTalent', { id });
    return true;
  },

  // AUDIT LOGS
  getAuditLogs(): AuditLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(data);
    } catch (e) {
      return INITIAL_AUDIT_LOGS;
    }
  },

  addAuditLog(
    module: AuditLog['module'],
    action: AuditLog['action'],
    recordId: string | undefined,
    description: string
  ): void {
    const user = this.getCurrentUser();
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: 'LOG-' + Date.now(),
      timestamp: getWibTimestamp(),
      userId: user.id,
      userName: user.name,
      userRole: user.roleTitle,
      module,
      action,
      recordId,
      description
    };
    logs.unshift(newLog);
    // Keep last 150 logs
    const capped = logs.slice(0, 150);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(capped));
  },

  // RESET TO DEFAULT (Demo Data Recovery)
  resetToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
    localStorage.setItem(STORAGE_KEYS.ACADEMIC, JSON.stringify(INITIAL_ACADEMICS));
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(INITIAL_ACHIEVEMENTS));
    localStorage.setItem(STORAGE_KEYS.DISCIPLINE, JSON.stringify(INITIAL_DISCIPLINES));
    localStorage.setItem(STORAGE_KEYS.TALENT, JSON.stringify(INITIAL_TALENTS));
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  },

  // GAS Sync Helper (Non-blocking)
  async syncToGas(action: string, payload: any): Promise<void> {
    const url = this.getGasUrl();
    if (!url) return;
    try {
      await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, data: payload })
      });
    } catch (e) {
      console.warn('Google Apps Script background sync failed:', e);
    }
  }
};
