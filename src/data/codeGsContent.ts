/**
 * Source Code Google Apps Script (Code.gs) Produksi
 * Siap pakai untuk backend Google Sheets & Google Drive
 */

export const CODE_GS_SCRIPT = `/**
 * =========================================================================
 * SIDATA - SISTEM INFORMASI DATABASE SISWA TERPADU SMA
 * BACKEND GOOGLE APPS SCRIPT (Code.gs)
 * =========================================================================
 * 
 * Pengembang: Tim Pengembang SIDATA SMA
 * Basis Data: Google Sheets (Spreadsheet)
 * Penyimpanan Berkas: Google Drive Folder
 * Zona Waktu: Asia/Jakarta (WIB)
 * 
 * PANDUAN DEPLOYMENT (LANGKAH DEMI LANGKAH):
 * 1. Buka Google Spreadsheet baru (beri nama misal "SIDATA_DATABASE_SMA").
 * 2. Klik menu "Ekstensi" > "Apps Script".
 * 3. Hapus semua kode default, lalu salin dan tempel (Paste) SELURUH isi file ini.
 * 4. Buat folder baru di Google Drive Anda untuk menampung file unggahan siswa,
 *    lalu salin ID Folder (karakter setelah 'folders/' di URL) dan masukkan ke
 *    variabel DRIVE_FOLDER_ID di bawah ini.
 * 5. Jalankan fungsi "setupInitialDatabase()" sekali saja dari editor Apps Script
 *    untuk membuat tab lembar kerja dan header kolom secara otomatis.
 * 6. Klik tombol biru "Terapkan" (Deploy) > "Penerapan Baru" (New Deployment).
 * 7. Pilih Jenis: "Aplikasi Web" (Web App).
 *    - Deskripsi: Versi Produksi SIDATA SMA v1.0
 *    - Jalankan sebagai: Saya (Email Anda)
 *    - Yang memiliki akses: Siapa saja (Anyone) -> PENTING agar web app bisa diakses oleh klien.
 * 8. Klik "Terapkan", berikan izin akses Google (Review Permissions > Advanced > Go to Untitled).
 * 9. Salin URL Aplikasi Web (berakhiran /exec) dan tempelkan ke konfigurasi SIDATA.
 * =========================================================================
 */

// KONFIGURASI UTAMA
// Masukkan ID Folder Google Drive untuk menyimpan dokumen siswa (KK, Akte, Ijazah, Foto)
var DRIVE_FOLDER_ID = "MASUKKAN_ID_FOLDER_GOOGLE_DRIVE_DISINI";

// Nama-nama Sheet di Spreadsheet
var SHEET_NAMES = {
  SISWA: "Siswa",
  AKADEMIK: "Akademik",
  PRESTASI: "Prestasi",
  KEDISIPLINAN: "Kedisiplinan",
  BAKAT_MINAT: "BakatMinat",
  AUDIT_LOG: "AuditLog"
};

/**
 * Mendapatkan timestamp zona waktu Asia/Jakarta (WIB)
 */
function getJakartaTimestamp() {
  return Utilities.formatDate(new Date(), "Asia/Jakarta", "yyyy-MM-dd HH:mm:ss") + " WIB";
}

/**
 * Handler GET HTTP: Mengambil data database dalam format JSON
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "getAll";

    if (action === "ping") {
      return createJsonResponse({ status: "success", message: "Koneksi Google Apps Script SIDATA Berhasil!", timestamp: getJakartaTimestamp() });
    }

    var result = {
      status: "success",
      timestamp: getJakartaTimestamp(),
      students: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.SISWA)),
      academic: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.AKADEMIK)),
      achievements: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.PRESTASI)),
      discipline: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.KEDISIPLINAN)),
      talent: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.BAKAT_MINAT)),
      audit: getSheetDataAsJson(ss.getSheetByName(SHEET_NAMES.AUDIT_LOG))
    };

    return createJsonResponse(result);
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

/**
 * Handler POST HTTP: Menerima aksi CRUD, upload file, dan audit log
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    // Kunci proses selama 30 detik untuk mencegah race condition
    lock.waitLock(30000);

    var payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }

    var action = payload.action;
    var data = payload.data;
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var response = { status: "success" };

    switch (action) {
      case "saveStudent":
        response.result = handleSaveRecord(ss.getSheetByName(SHEET_NAMES.SISWA), data, "id");
        break;

      case "deleteStudent":
        response.result = handleDeleteRecord(ss.getSheetByName(SHEET_NAMES.SISWA), data.id, "id");
        break;

      case "saveAcademic":
        response.result = handleSaveRecord(ss.getSheetByName(SHEET_NAMES.AKADEMIK), data, "id");
        break;

      case "deleteAcademic":
        response.result = handleDeleteRecord(ss.getSheetByName(SHEET_NAMES.AKADEMIK), data.id, "id");
        break;

      case "saveAchievement":
        response.result = handleSaveRecord(ss.getSheetByName(SHEET_NAMES.PRESTASI), data, "id");
        break;

      case "deleteAchievement":
        response.result = handleDeleteRecord(ss.getSheetByName(SHEET_NAMES.PRESTASI), data.id, "id");
        break;

      case "saveDiscipline":
        response.result = handleSaveRecord(ss.getSheetByName(SHEET_NAMES.KEDISIPLINAN), data, "id");
        break;

      case "deleteDiscipline":
        response.result = handleDeleteRecord(ss.getSheetByName(SHEET_NAMES.KEDISIPLINAN), data.id, "id");
        break;

      case "saveTalent":
        response.result = handleSaveRecord(ss.getSheetByName(SHEET_NAMES.BAKAT_MINAT), data, "id");
        break;

      case "deleteTalent":
        response.result = handleDeleteRecord(ss.getSheetByName(SHEET_NAMES.BAKAT_MINAT), data.id, "id");
        break;

      case "uploadFile":
        response.fileInfo = handleFileUpload(payload.fileName, payload.mimeType, payload.base64Data, payload.studentId);
        break;

      case "logAudit":
        appendAuditLog(ss.getSheetByName(SHEET_NAMES.AUDIT_LOG), data);
        break;

      default:
        throw new Error("Aksi tidak dikenali: " + action);
    }

    return createJsonResponse(response);
  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  } finally {
    lock.releaseLock();
  }
}

/**
 * Upload file base64 ke Google Drive Folder
 */
function handleFileUpload(fileName, mimeType, base64Data, studentId) {
  var folder;
  if (DRIVE_FOLDER_ID && DRIVE_FOLDER_ID !== "MASUKKAN_ID_FOLDER_GOOGLE_DRIVE_DISINI") {
    folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  } else {
    // Jika ID belum disetel, gunakan root Drive
    folder = DriveApp.getRootFolder();
  }

  var decoded = Utilities.base64Decode(base64Data);
  var blob = Utilities.newBlob(decoded, mimeType, (studentId ? studentId + "_" : "") + fileName);
  var file = folder.createFile(blob);
  
  // Set izin agar file bisa dilihat lewat link
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  return {
    fileId: file.getId(),
    fileName: file.getName(),
    fileUrl: file.getUrl(),
    downloadUrl: "https://drive.google.com/uc?export=view&id=" + file.getId(),
    uploadedAt: getJakartaTimestamp()
  };
}

/**
 * Simpan atau Update record pada sheet tertentu
 */
function handleSaveRecord(sheet, dataObj, primaryKey) {
  if (!sheet) throw new Error("Lembar sheet tidak ditemukan!");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idValue = dataObj[primaryKey];
  var lastRow = sheet.getLastRow();
  var foundRow = -1;

  if (lastRow > 1) {
    var idColIndex = headers.indexOf(primaryKey);
    if (idColIndex !== -1) {
      var allIds = sheet.getRange(2, idColIndex + 1, lastRow - 1, 1).getValues();
      for (var i = 0; i < allIds.length; i++) {
        if (String(allIds[i][0]) === String(idValue)) {
          foundRow = i + 2;
          break;
        }
      }
    }
  }

  // Siapkan row array sesuai urutan kolom header
  var rowValues = headers.map(function(header) {
    var val = dataObj[header];
    if (typeof val === "object" && val !== null) {
      return JSON.stringify(val);
    }
    return val !== undefined ? val : "";
  });

  if (foundRow !== -1) {
    sheet.getRange(foundRow, 1, 1, rowValues.length).setValues([rowValues]);
    return { action: "updated", row: foundRow, id: idValue };
  } else {
    sheet.appendRow(rowValues);
    return { action: "inserted", row: sheet.getLastRow(), id: idValue };
  }
}

/**
 * Hapus record pada sheet berdasarkan ID
 */
function handleDeleteRecord(sheet, idValue, primaryKey) {
  if (!sheet) throw new Error("Lembar sheet tidak ditemukan!");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idColIndex = headers.indexOf(primaryKey);
  if (idColIndex === -1) throw new Error("Kolom primary key tidak ditemukan!");

  var lastRow = sheet.getLastRow();
  if (lastRow <= 1) return { deleted: false, message: "Data kosong" };

  var allIds = sheet.getRange(2, idColIndex + 1, lastRow - 1, 1).getValues();
  for (var i = 0; i < allIds.length; i++) {
    if (String(allIds[i][0]) === String(idValue)) {
      sheet.deleteRow(i + 2);
      return { deleted: true, id: idValue };
    }
  }
  return { deleted: false, message: "ID tidak ditemukan" };
}

/**
 * Catat Audit Log
 */
function appendAuditLog(sheet, logData) {
  if (!sheet) return;
  sheet.appendRow([
    logData.id || ("LOG-" + Date.now()),
    getJakartaTimestamp(),
    logData.userId || "",
    logData.userName || "",
    logData.userRole || "",
    logData.action || "",
    logData.module || "",
    logData.description || "",
    logData.details || ""
  ]);
}

/**
 * Membaca data sheet dan mengonversi menjadi Array of Objects JSON
 */
function getSheetDataAsJson(sheet) {
  if (!sheet || sheet.getLastRow() <= 1) return [];
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rows = [];

  for (var i = 1; i < data.length; i++) {
    var rowObj = {};
    for (var j = 0; j < headers.length; j++) {
      var key = headers[j];
      var val = data[i][j];
      // Jika bernilai JSON (seperti array dokumen, nilai mapel, skor riasec) coba parse
      if (typeof val === "string" && (val.startsWith("[") || val.startsWith("{"))) {
        try {
          val = JSON.parse(val);
        } catch (e) {
          // Tetap string jika gagal
        }
      }
      rowObj[key] = val;
    }
    rows.push(rowObj);
  }
  return rows;
}

/**
 * Inisialisasi Struktur Tabel & Header Lembar Kerja Otomatis
 * Jalankan fungsi ini 1 kali dari editor Google Apps Script!
 */
function setupInitialDatabase() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var schema = [
    {
      name: SHEET_NAMES.SISWA,
      headers: [
        "id", "nisn", "nis", "namaLengkap", "nik", "tempatLahir", "tanggalLahir",
        "jenisKelamin", "agama", "alamat", "noTelepon", "email", "namaAyah",
        "pekerjaanAyah", "namaIbu", "pekerjaanIbu", "noTeleponOrtu", "penghasilanOrtu",
        "tahunMasuk", "angkatan", "kelas", "jurusan", "jalurMasuk", "asalSmp",
        "statusSiswa", "dokumen", "fotoUrl", "createdAt", "updatedAt"
      ]
    },
    {
      name: SHEET_NAMES.AKADEMIK,
      headers: [
        "id", "studentId", "studentName", "kelas", "semester", "tahunAjaran",
        "kurikulum", "mataPelajaran", "rataRataNilai", "rankingKelas",
        "catatanAkademik", "updatedAt"
      ]
    },
    {
      name: SHEET_NAMES.PRESTASI,
      headers: [
        "id", "studentId", "studentName", "kelas", "namaLomba", "bidang",
        "kategori", "tingkat", "peringkat", "penyelenggara", "tanggalPerolehan",
        "tahun", "keterangan", "filePiagamUrl", "filePiagamName", "createdAt"
      ]
    },
    {
      name: SHEET_NAMES.KEDISIPLINAN,
      headers: [
        "id", "studentId", "studentName", "kelas", "tanggalKejadian",
        "jenisPelanggaran", "kategori", "poin", "lokasi", "guruPencatat",
        "tindakanLangsung", "statusPenanganan", "catatanKonseling", "createdAt"
      ]
    },
    {
      name: SHEET_NAMES.BAKAT_MINAT,
      headers: [
        "id", "studentId", "studentName", "kelas", "tanggalTes",
        "lembagaPsikologi", "skorIQ", "kategoriIQ", "riasecScores",
        "minatUtama", "gayaBelajar", "ekstrakurikuler", "rekomendasiJurusanKuliah",
        "potensiKarier", "catatanGuruBK", "updatedAt"
      ]
    },
    {
      name: SHEET_NAMES.AUDIT_LOG,
      headers: [
        "id", "timestamp", "userId", "userName", "userRole",
        "action", "module", "description", "details"
      ]
    }
  ];

  schema.forEach(function(item) {
    var sheet = ss.getSheetByName(item.name);
    if (!sheet) {
      sheet = ss.insertSheet(item.name);
    }
    // Jika belum ada header
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(item.headers);
      var headerRange = sheet.getRange(1, 1, 1, item.headers.length);
      headerRange.setBackground("#0f2b5c");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }
  });

  Logger.log("Inisialisasi Tabel SIDATA selesai dengan sukses!");
}

/**
 * Utilitas untuk mengembalikan output JSON dengan header CORS lengkap
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
