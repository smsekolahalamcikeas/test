/**
 * =========================================================================================
 * SIDATA SMA (SISTEM INFORMASI DATABASE SISWA TERPADU SMA) - BACKEND GOOGLE APPS SCRIPT
 * =========================================================================================
 * 
 * Petunjuk Pemasangan:
 * 1. Buka Google Spreadsheet baru di Google Drive Anda.
 * 2. Klik menu 'Extensions' -> 'Apps Script'.
 * 3. Hapus kode bawaan, lalu paste seluruh skrip ini ke dalam editor Apps Script.
 * 4. Klik 'Deploy' -> 'New deployment'.
 * 5. Pilih jenis 'Web app'.
 * 6. Set 'Execute as': 'Me' (akun Google Anda).
 * 7. Set 'Who has access': 'Anyone' (Siapa saja).
 * 8. Klik 'Deploy', berikan izin otorisasi Google, lalu salin URL Web App yang dihasilkan.
 * 9. Masukkan URL tersebut ke dalam modal 'Integrasi GAS' di aplikasi SIDATA.
 */

// Konstanta Nama Sheet
const SHEET_NAMES = {
  SISWA: 'Data_Siswa',
  AKADEMIK: 'Rekam_Akademik',
  PRESTASI: 'Daftar_Prestasi',
  DISIPLIN: 'Log_Kedisiplinan',
  BAKAT: 'Bakat_Minat_Psikotes'
};

const DRIVE_FOLDER_NAME = 'SIDATA_DOKUMEN_SISWA';

/**
 * Entry Point GET (Untuk PING & GET DATA)
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'ping';
    
    if (action === 'ping') {
      return responseJSON({
        status: 'success',
        message: 'Koneksi Google Apps Script SIDATA Aktif & Siap Digunakan!',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'getAll') {
      initSheetsIfMissing();
      return responseJSON({
        status: 'success',
        students: getSheetData(SHEET_NAMES.SISWA),
        academics: getSheetData(SHEET_NAMES.AKADEMIK),
        achievements: getSheetData(SHEET_NAMES.PRESTASI),
        disciplines: getSheetData(SHEET_NAMES.DISIPLIN),
        talents: getSheetData(SHEET_NAMES.BAKAT)
      });
    }

    return responseJSON({ status: 'error', message: 'Aksi GET tidak dikenali.' });
  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

/**
 * Entry Point POST (Untuk Menyimpan / Mengubah / Menghapus Data)
 */
function doPost(e) {
  try {
    initSheetsIfMissing();
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    const data = contents.data;

    switch (action) {
      case 'saveStudent':
        upsertRecord(SHEET_NAMES.SISWA, data.id, [
          data.id, data.nisn, data.nis, data.nik, data.namaLengkap,
          data.tempatLahir, data.tanggalLahir, data.jenisKelamin, data.agama,
          data.kelas, data.jurusan, data.jalurMasuk, data.tahunMasuk,
          data.angkatan, data.asalSmp, data.noTelepon, data.email, data.alamat,
          data.namaAyah, data.pekerjaanAyah, data.namaIbu, data.pekerjaanIbu,
          data.noTeleponOrtu, data.penghasilanOrtu, data.statusSiswa,
          data.fotoUrl || '', JSON.stringify(data.dokumen || []),
          data.createdAt, data.updatedAt
        ]);
        return responseJSON({ status: 'success', message: 'Data siswa tersimpan di Google Sheet.' });

      case 'deleteStudent':
        deleteRecord(SHEET_NAMES.SISWA, data.id);
        return responseJSON({ status: 'success', message: 'Data siswa dihapus dari Google Sheet.' });

      case 'saveAcademic':
        upsertRecord(SHEET_NAMES.AKADEMIK, data.id, [
          data.id, data.studentId, data.studentName, data.kelas, data.semester,
          data.tahunAjaran, data.kurikulum, data.rataRataNilai, data.rankingKelas || '',
          data.catatanAkademik || '', JSON.stringify(data.mataPelajaran || []),
          data.updatedAt
        ]);
        return responseJSON({ status: 'success', message: 'Data akademik tersimpan.' });

      case 'deleteAcademic':
        deleteRecord(SHEET_NAMES.AKADEMIK, data.id);
        return responseJSON({ status: 'success', message: 'Data akademik dihapus.' });

      case 'saveAchievement':
        upsertRecord(SHEET_NAMES.PRESTASI, data.id, [
          data.id, data.studentId, data.studentName, data.kelas, data.namaLomba,
          data.peringkat, data.tingkat, data.bidang, data.penyelenggara,
          data.tanggalPerolehan, data.guruPembimbing || '', data.buktiSertifikatUrl || '',
          data.createdAt
        ]);
        return responseJSON({ status: 'success', message: 'Prestasi tersimpan.' });

      case 'deleteAchievement':
        deleteRecord(SHEET_NAMES.PRESTASI, data.id);
        return responseJSON({ status: 'success', message: 'Prestasi dihapus.' });

      case 'saveDiscipline':
        upsertRecord(SHEET_NAMES.DISIPLIN, data.id, [
          data.id, data.studentId, data.studentName, data.kelas, data.tanggalKejadian,
          data.jenisPelanggaran, data.kategori, data.poin, data.lokasi,
          data.guruPencatat, data.tindakanLangsung, data.statusPenanganan,
          data.catatanKonseling || '', data.createdAt
        ]);
        return responseJSON({ status: 'success', message: 'Log kedisiplinan tersimpan.' });

      case 'deleteDiscipline':
        deleteRecord(SHEET_NAMES.DISIPLIN, data.id);
        return responseJSON({ status: 'success', message: 'Log kedisiplinan dihapus.' });

      case 'saveTalent':
        upsertRecord(SHEET_NAMES.BAKAT, data.id, [
          data.id, data.studentId, data.studentName, data.tanggalTes,
          data.lembagaPsikotes, data.skorIq || '', data.tipeHollandRiasec,
          data.gayaBelajar, (data.minatKarir || []).join(', '),
          (data.rekomendasiJurusanKuliah || []).join(', '),
          data.saranPengembangan || '', data.konselorBk, data.createdAt
        ]);
        return responseJSON({ status: 'success', message: 'Asesmen bakat minat tersimpan.' });

      case 'deleteTalent':
        deleteRecord(SHEET_NAMES.BAKAT, data.id);
        return responseJSON({ status: 'success', message: 'Asesmen bakat minat dihapus.' });

      case 'uploadDriveFile':
        const fileUrl = saveBase64ToDrive(data.base64Data, data.fileName, data.mimeType);
        return responseJSON({ status: 'success', fileUrl: fileUrl });

      default:
        return responseJSON({ status: 'error', message: 'Aksi POST tidak dikenal.' });
    }
  } catch (err) {
    return responseJSON({ status: 'error', message: err.toString() });
  }
}

/**
 * Simpan berkas Base64 ke Google Drive di Folder SIDATA
 */
function saveBase64ToDrive(base64Data, fileName, mimeType) {
  let folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  let folder;
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
    folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  }

  const decoded = Utilities.base64Decode(base64Data);
  const blob = Utilities.newBlob(decoded, mimeType || 'application/octet-stream', fileName);
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

/**
 * Upsert baris pada Sheet berdasarkan ID (Kolom A)
 */
function upsertRecord(sheetName, id, rowValues) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
      return;
    }
  }
  // Jika belum ada, append baris baru
  sheet.appendRow(rowValues);
}

/**
 * Hapus baris berdasarkan ID
 */
function deleteRecord(sheetName, id) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      return;
    }
  }
}

/**
 * Ambil data dari sheet sebagai Array of Objects
 */
function getSheetData(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return [];

  const headers = values[0];
  const results = [];

  for (let i = 1; i < values.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[i][j];
    }
    results.push(obj);
  }
  return results;
}

/**
 * Inisialisasi Sheet & Header Otomatis jika belum ada
 */
function initSheetsIfMissing() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const headers = {
    [SHEET_NAMES.SISWA]: [
      'ID_Siswa', 'NISN', 'NIS', 'NIK', 'Nama_Lengkap', 'Tempat_Lahir', 'Tanggal_Lahir',
      'Jenis_Kelamin', 'Agama', 'Kelas', 'Jurusan', 'Jalur_Masuk', 'Tahun_Masuk',
      'Angkatan', 'Asal_SMP', 'No_HP', 'Email', 'Alamat', 'Nama_Ayah', 'Pekerjaan_Ayah',
      'Nama_Ibu', 'Pekerjaan_Ibu', 'No_HP_Ortu', 'Penghasilan_Ortu', 'Status_Siswa',
      'Foto_URL', 'Dokumen_JSON', 'Waktu_Dibuat', 'Waktu_Diubah'
    ],
    [SHEET_NAMES.AKADEMIK]: [
      'ID_Akademik', 'ID_Siswa', 'Nama_Siswa', 'Kelas', 'Semester', 'Tahun_Ajaran',
      'Kurikulum', 'Rata_Rata_Nilai', 'Ranking_Kelas', 'Catatan_Akademik',
      'Nilai_Mapel_JSON', 'Waktu_Diubah'
    ],
    [SHEET_NAMES.PRESTASI]: [
      'ID_Prestasi', 'ID_Siswa', 'Nama_Siswa', 'Kelas', 'Nama_Lomba', 'Peringkat',
      'Tingkat', 'Bidang', 'Penyelenggara', 'Tanggal_Perolehan', 'Guru_Pembimbing',
      'Sertifikat_URL', 'Waktu_Dibuat'
    ],
    [SHEET_NAMES.DISIPLIN]: [
      'ID_Disiplin', 'ID_Siswa', 'Nama_Siswa', 'Kelas', 'Tanggal_Kejadian',
      'Jenis_Pelanggaran', 'Kategori', 'Poin', 'Lokasi', 'Guru_Pencatat',
      'Tindakan_Langsung', 'Status_Penanganan', 'Catatan_Konseling', 'Waktu_Dibuat'
    ],
    [SHEET_NAMES.BAKAT]: [
      'ID_Bakat', 'ID_Siswa', 'Nama_Siswa', 'Tanggal_Tes', 'Lembaga_Psikotes',
      'Skor_IQ', 'Holland_RIASEC', 'Gaya_Belajar', 'Minat_Karir',
      'Rekomendasi_Jurusan', 'Saran_BK', 'Konselor_BK', 'Waktu_Dibuat'
    ]
  };

  for (const [sName, cols] of Object.entries(headers)) {
    let sheet = ss.getSheetByName(sName);
    if (!sheet) {
      sheet = ss.insertSheet(sName);
      sheet.appendRow(cols);
      sheet.getRange(1, 1, 1, cols.length).setBackground('#0f2b5c').setFontColor('#ffffff').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
  }
}

/**
 * Format Response JSON dengan CORS
 */
function responseJSON(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
