import * as XLSX from 'xlsx';
import {
  Student,
  AcademicRecord,
  Achievement,
  DisciplineRecord,
  TalentAssessment
} from '../types';
import { storage } from './storage';

export const ExportService = {
  // Ekspor Seluruh Database ke Excel (.xlsx) dengan 5 Sheet Terpisah
  exportToExcel(
    students: Student[],
    academics: AcademicRecord[],
    achievements: Achievement[],
    disciplines: DisciplineRecord[],
    talents: TalentAssessment[]
  ) {
    const wb = XLSX.utils.book_new();

    // 1. Sheet Profil Siswa
    const studentRows = students.map((s, idx) => ({
      No: idx + 1,
      ID_Siswa: s.id,
      NISN: s.nisn,
      NIS: s.nis,
      NIK: s.nik,
      Nama_Lengkap: s.namaLengkap,
      Jenis_Kelamin: s.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      Tempat_Lahir: s.tempatLahir,
      Tanggal_Lahir: s.tanggalLahir,
      Agama: s.agama,
      Kelas: s.kelas,
      Jurusan: s.jurusan,
      Jalur_Masuk: s.jalurMasuk,
      Tahun_Masuk: s.tahunMasuk,
      Angkatan: s.angkatan,
      Asal_SMP: s.asalSmp,
      No_HP: s.noTelepon,
      Email: s.email,
      Alamat: s.alamat,
      Nama_Ayah: s.namaAyah,
      Pekerjaan_Ayah: s.pekerjaanAyah,
      Nama_Ibu: s.namaIbu,
      Pekerjaan_Ibu: s.pekerjaanIbu,
      No_HP_Ortu: s.noTeleponOrtu,
      Penghasilan_Ortu: s.penghasilanOrtu,
      Status_Siswa: s.statusSiswa,
      Poin_Disiplin: storage.getStudentTotalDisciplinePoints(s.id)
    }));
    const wsStudents = XLSX.utils.json_to_sheet(studentRows);
    XLSX.utils.book_append_sheet(wb, wsStudents, 'Profil_Siswa');

    // 2. Sheet Akademik
    const academicRows = academics.map((a, idx) => ({
      No: idx + 1,
      ID_Rekam: a.id,
      ID_Siswa: a.studentId,
      Nama_Siswa: a.studentName,
      Kelas: a.kelas,
      Semester: a.semester,
      Tahun_Ajaran: a.tahunAjaran,
      Kurikulum: a.kurikulum,
      Rata_Rata_Nilai: a.rataRataNilai,
      Ranking_Kelas: a.rankingKelas || '-',
      Catatan_Akademik: a.catatanAkademik || '-'
    }));
    const wsAcademics = XLSX.utils.json_to_sheet(academicRows);
    XLSX.utils.book_append_sheet(wb, wsAcademics, 'Rekam_Akademik');

    // 3. Sheet Prestasi
    const achievementRows = achievements.map((ach, idx) => ({
      No: idx + 1,
      ID_Prestasi: ach.id,
      ID_Siswa: ach.studentId,
      Nama_Siswa: ach.studentName,
      Kelas: ach.kelas,
      Nama_Lomba: ach.namaLomba,
      Peringkat: ach.peringkat,
      Tingkat: ach.tingkat,
      Bidang: ach.bidang,
      Penyelenggara: ach.penyelenggara,
      Tanggal_Perolehan: ach.tanggalPerolehan,
      Guru_Pembimbing: ach.guruPembimbing || '-'
    }));
    const wsAchievements = XLSX.utils.json_to_sheet(achievementRows);
    XLSX.utils.book_append_sheet(wb, wsAchievements, 'Daftar_Prestasi');

    // 4. Sheet Kedisiplinan
    const disciplineRows = disciplines.map((d, idx) => ({
      No: idx + 1,
      ID_Kasus: d.id,
      ID_Siswa: d.studentId,
      Nama_Siswa: d.studentName,
      Kelas: d.kelas,
      Tanggal_Kejadian: d.tanggalKejadian,
      Jenis_Pelanggaran: d.jenisPelanggaran,
      Kategori: d.kategori,
      Poin_Sanksi: d.poin,
      Lokasi: d.lokasi,
      Guru_Pencatat: d.guruPencatat,
      Tindakan_Langsung: d.tindakanLangsung,
      Status_Penanganan: d.statusPenanganan,
      Catatan_BK: d.catatanKonseling || '-'
    }));
    const wsDisciplines = XLSX.utils.json_to_sheet(disciplineRows);
    XLSX.utils.book_append_sheet(wb, wsDisciplines, 'Log_Kedisiplinan');

    // 5. Sheet Bakat Minat
    const talentRows = talents.map((t, idx) => ({
      No: idx + 1,
      ID_Asesmen: t.id,
      ID_Siswa: t.studentId,
      Nama_Siswa: t.studentName,
      Tanggal_Tes: t.tanggalTes,
      Lembaga_Psikotes: t.lembagaPsikotes,
      Skor_IQ: t.skorIq || '-',
      Holland_RIASEC: t.tipeHollandRiasec,
      Gaya_Belajar: t.gayaBelajar,
      Rekomendasi_Kuliah: t.rekomendasiJurusanKuliah.join(', '),
      Peminatan_Karir: t.minatKarir.join(', '),
      Saran_BK: t.saranPengembangan || '-',
      Konselor_BK: t.konselorBk
    }));
    const wsTalents = XLSX.utils.json_to_sheet(talentRows);
    XLSX.utils.book_append_sheet(wb, wsTalents, 'Bakat_Minat');

    // Unduh berkas
    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `SIDATA_DATABASE_SMA_${dateStr}.xlsx`);
    storage.addAuditLog('Sistem', 'EKSPOR', undefined, `Mengekspor seluruh database (${students.length} siswa) ke format Excel (.xlsx)`);
  },

  // Cetak Lembar Rapor / Arsip Resmi Siswa (PDF / Print-friendly)
  printStudentReport(student: Student) {
    const academics = storage.getAcademicRecords().filter(a => a.studentId === student.id);
    const achievements = storage.getAchievements().filter(a => a.studentId === student.id);
    const disciplines = storage.getDisciplineRecords().filter(d => d.studentId === student.id);
    const talents = storage.getTalentAssessments().find(t => t.studentId === student.id);
    const totalPoints = storage.getStudentTotalDisciplinePoints(student.id);
    const sanction = storage.getSanctionLevel(totalPoints);

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Mohon izinkan pop-up browser untuk mencetak berkas arsip siswa.');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Arsip Profil Siswa - ${student.namaLengkap} (${student.id})</title>
  <style>
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.4;
      color: #000;
      margin: 20mm 15mm 20mm 15mm;
    }
    .header {
      text-align: center;
      border-bottom: 3px double #000;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }
    .header h2 { margin: 0; font-size: 14pt; font-weight: bold; text-transform: uppercase; }
    .header h1 { margin: 2px 0; font-size: 16pt; font-weight: bold; text-transform: uppercase; }
    .header p { margin: 2px 0; font-size: 10pt; }
    .title {
      text-align: center;
      font-weight: bold;
      font-size: 13pt;
      text-decoration: underline;
      margin: 12px 0 16px 0;
      text-transform: uppercase;
    }
    .grid-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12px;
    }
    .grid-table td {
      padding: 4px 6px;
      vertical-align: top;
      font-size: 11pt;
    }
    .grid-table td.label {
      width: 28%;
      font-weight: bold;
    }
    .grid-table td.colon {
      width: 2%;
    }
    .section-title {
      font-weight: bold;
      font-size: 11pt;
      background-color: #eee;
      padding: 4px 8px;
      margin: 14px 0 6px 0;
      border-left: 4px solid #000;
      text-transform: uppercase;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      margin-bottom: 12px;
    }
    .data-table th, .data-table td {
      border: 1px solid #000;
      padding: 4px 6px;
      font-size: 10pt;
    }
    .data-table th {
      background-color: #f5f5f5;
      text-align: center;
      font-weight: bold;
    }
    .footer-signs {
      margin-top: 30px;
      width: 100%;
      border-collapse: collapse;
    }
    .footer-signs td {
      width: 50%;
      text-align: center;
      font-size: 11pt;
      vertical-align: top;
    }
    .sign-space {
      height: 65px;
    }
    @media print {
      @page { margin: 15mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>Pemerintah Daerah Provinsi Jawa Barat</h2>
    <h2>Dinas Pendidikan & Kebudayaan</h2>
    <h1>SMA Negeri 1 Terpadu Nusantara</h1>
    <p>Jl. Ir. H. Djuanda No. 120 Bandung - Telp. (022) 2501234 - Website: sman1terpadu.sch.id</p>
  </div>

  <div class="title">LEMBAR ARSIP DATA TERPADU SISWA (SIDATA)</div>

  <table class="grid-table">
    <tr>
      <td class="label">Nomor Induk Siswa (NIS)</td><td class="colon">:</td><td>${student.nis} / ID: ${student.id}</td>
      <td rowspan="5" style="width: 110px; text-align: right;">
        <img src="${student.fotoUrl || 'https://via.placeholder.com/100x130?text=Foto'}" style="width: 100px; height: 130px; object-fit: cover; border: 1px solid #000; padding: 2px;" alt="Foto Siswa" />
      </td>
    </tr>
    <tr><td class="label">NISN</td><td class="colon">:</td><td>${student.nisn}</td></tr>
    <tr><td class="label">Nama Lengkap</td><td class="colon">:</td><td><strong>${student.namaLengkap}</strong></td></tr>
    <tr><td class="label">Tempat, Tanggal Lahir</td><td class="colon">:</td><td>${student.tempatLahir}, ${student.tanggalLahir}</td></tr>
    <tr><td class="label">Jenis Kelamin / Agama</td><td class="colon">:</td><td>${student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'} / ${student.agama}</td></tr>
    <tr><td class="label">Kelas / Peminatan</td><td class="colon">:</td><td colspan="2">${student.kelas} (${student.jurusan})</td></tr>
    <tr><td class="label">Tahun Masuk / Angkatan</td><td class="colon">:</td><td colspan="2">${student.tahunMasuk} (Angkatan ${student.angkatan}) - Jalur: ${student.jalurMasuk}</td></tr>
    <tr><td class="label">Asal SMP / MTs</td><td class="colon">:</td><td colspan="2">${student.asalSmp}</td></tr>
    <tr><td class="label">Alamat Rumah</td><td class="colon">:</td><td colspan="2">${student.alamat}</td></tr>
    <tr><td class="label">No. Telepon / Email</td><td class="colon">:</td><td colspan="2">${student.noTelepon} &bull; ${student.email}</td></tr>
    <tr><td class="label">Orang Tua (Ayah / Ibu)</td><td class="colon">:</td><td colspan="2">${student.namaAyah} (${student.pekerjaanAyah}) & ${student.namaIbu} (${student.pekerjaanIbu})</td></tr>
    <tr><td class="label">Kontak Orang Tua</td><td class="colon">:</td><td colspan="2">${student.noTeleponOrtu}</td></tr>
  </table>

  <div class="section-title">I. Rekam Jejak Nilai Akademik Rapor</div>
  ${academics.length === 0 ? '<p><em>Belum ada catatan akademik semester tersimpan.</em></p>' : `
    <table class="data-table">
      <thead>
        <tr>
          <th>Semester</th>
          <th>Tahun Ajaran</th>
          <th>Kurikulum</th>
          <th>Rata-rata Nilai</th>
          <th>Peringkat Kelas</th>
          <th>Catatan Evaluasi Guru</th>
        </tr>
      </thead>
      <tbody>
        ${academics.map(a => `
          <tr>
            <td style="text-align:center;">Semester ${a.semester}</td>
            <td style="text-align:center;">${a.tahunAjaran}</td>
            <td>${a.kurikulum}</td>
            <td style="text-align:center; font-weight:bold;">${a.rataRataNilai}</td>
            <td style="text-align:center;">${a.rankingKelas ? '#' + a.rankingKelas : '-'}</td>
            <td>${a.catatanAkademik || '-'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `}

  <div class="section-title">II. Rekam Prestasi & Kejuaraan Siswa</div>
  ${achievements.length === 0 ? '<p><em>Tidak ada catatan kejuaraan / lomba.</em></p>' : `
    <table class="data-table">
      <thead>
        <tr>
          <th>Nama Kompetisi</th>
          <th>Peringkat</th>
          <th>Tingkat</th>
          <th>Bidang</th>
          <th>Penyelenggara</th>
          <th>Tanggal</th>
        </tr>
      </thead>
      <tbody>
        ${achievements.map(ach => `
          <tr>
            <td><strong>${ach.namaLomba}</strong></td>
            <td style="text-align:center;">${ach.peringkat}</td>
            <td style="text-align:center;">${ach.tingkat}</td>
            <td>${ach.bidang}</td>
            <td>${ach.penyelenggara}</td>
            <td style="text-align:center;">${ach.tanggalPerolehan}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `}

  <div class="section-title">III. Log Kedisiplinan & Poin Sanksi Tata Tertib</div>
  <p style="margin: 4px 0 6px 0; font-size: 10pt;">
    Akumulasi Poin Pelanggaran: <strong>${totalPoints} Poin</strong> &bull; Status: <strong>${sanction.level}</strong>
  </p>
  ${disciplines.length === 0 ? '<p><em>Catatan kedisiplinan bersih (0 poin pelanggaran).</em></p>' : `
    <table class="data-table">
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Jenis Pelanggaran</th>
          <th>Kategori</th>
          <th>Poin</th>
          <th>Tindakan / Pembinaan</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${disciplines.map(d => `
          <tr>
            <td style="text-align:center;">${d.tanggalKejadian}</td>
            <td>${d.jenisPelanggaran}</td>
            <td style="text-align:center;">${d.kategori}</td>
            <td style="text-align:center; font-weight:bold; color:red;">+${d.poin}</td>
            <td>${d.tindakanLangsung}</td>
            <td style="text-align:center;">${d.statusPenanganan}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `}

  ${talents ? `
    <div class="section-title">IV. Asesmen Bakat, Minat & Potensi Karir</div>
    <table class="grid-table">
      <tr><td class="label">Skor IQ / Holland RIASEC</td><td class="colon">:</td><td>${talents.skorIq || '-'} / ${talents.tipeHollandRiasec}</td></tr>
      <tr><td class="label">Gaya Belajar Dominan</td><td class="colon">:</td><td>${talents.gayaBelajar}</td></tr>
      <tr><td class="label">Rekomendasi Jurusan PTN</td><td class="colon">:</td><td>${talents.rekomendasiJurusanKuliah.join(', ')}</td></tr>
      <tr><td class="label">Saran Pengembangan BK</td><td class="colon">:</td><td>${talents.saranPengembangan || '-'} (Konselor: ${talents.konselorBk})</td></tr>
    </table>
  ` : ''}

  <table class="footer-signs">
    <tr>
      <td>
        Mengetahui,<br>
        Kepala Sekolah SMA Negeri 1 Terpadu<br>
        <div class="sign-space"></div>
        <strong>Dr. H. Bambang Hartono, M.M</strong><br>
        NIP. 196811051994031002
      </td>
      <td>
        Bandung, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
        Koordinator Tata Usaha & Kesiswaan<br>
        <div class="sign-space"></div>
        <strong>Budi Santoso, S.Kom</strong><br>
        NIP. 198504122010011005
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);

    storage.addAuditLog('Profil', 'EKSPOR', student.id, `Mencetak arsip resmi PDF untuk siswa: ${student.namaLengkap}`);
  }
};
