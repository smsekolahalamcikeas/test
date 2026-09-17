import React, { useState, useMemo } from 'react';
import { Student, AcademicRecord, Achievement, TalentAssessment } from '../types';
import {
  Compass,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  ChevronRight,
  BookOpen
} from 'lucide-react';

interface AnalyticsViewProps {
  students: Student[];
  academicRecords: AcademicRecord[];
  achievements: Achievement[];
  talentAssessments: TalentAssessment[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  students,
  academicRecords,
  achievements,
  talentAssessments
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    students[0]?.id || ''
  );

  const student = students.find(s => s.id === selectedStudentId);

  const studentAcademics = useMemo(
    () => academicRecords.filter(a => a.studentId === selectedStudentId),
    [academicRecords, selectedStudentId]
  );

  const studentAchievements = useMemo(
    () => achievements.filter(a => a.studentId === selectedStudentId),
    [achievements, selectedStudentId]
  );

  const studentTalent = useMemo(
    () => talentAssessments.find(t => t.studentId === selectedStudentId),
    [talentAssessments, selectedStudentId]
  );

  // Calculate composite readiness score
  const avgScore = useMemo(() => {
    if (studentAcademics.length === 0) return 85;
    const sum = studentAcademics.reduce((acc, c) => acc + c.rataRataNilai, 0);
    return Number((sum / studentAcademics.length).toFixed(1));
  }, [studentAcademics]);

  return (
    <div id="analytics-view" className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-indigo-900/40 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-indigo-800/60 text-amber-300 text-xs font-semibold mb-2 border border-indigo-700/50">
            <Sparkles className="w-3.5 h-3.5" /> Analitik Penjurusan & Studi Lanjut Perguruan Tinggi
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Pemetaan Jalur Kuliah & Peluang Kelulusan SNBP/SNBT
          </h2>
          <p className="text-blue-100/80 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
            Sintesis cerdas antara konsistensi nilai rapor semester, perolehan sertifikat prestasi kejuaraan, dan hasil tes psikotes bakat minat Holland RIASEC.
          </p>
        </div>
      </div>

      {/* Student Selector Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider shrink-0">
            Pilih Siswa:
          </span>
          <select
            value={selectedStudentId}
            onChange={e => setSelectedStudentId(e.target.value)}
            className="w-full sm:w-72 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
          >
            {students.map(s => (
              <option key={s.id} value={s.id}>
                {s.namaLengkap} ({s.kelas} - {s.jurusan})
              </option>
            ))}
          </select>
        </div>

        {student && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>NISN: <strong className="font-mono text-slate-800">{student.nisn}</strong></span>
            <span>&bull;</span>
            <span>Jalur Masuk: <strong className="text-slate-800">{student.jalurMasuk}</strong></span>
          </div>
        )}
      </div>

      {student ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Student Profiling Metrics */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-3 border-b pb-4">
                <img
                  src={student.fotoUrl || 'https://via.placeholder.com/60?text=Foto'}
                  alt={student.namaLengkap}
                  className="w-14 h-16 object-cover rounded-xl border ring-1 ring-slate-200"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{student.namaLengkap}</h3>
                  <p className="text-xs text-slate-500">{student.kelas} &bull; {student.jurusan}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Siswa Aktif
                  </span>
                </div>
              </div>

              {/* Rata-rata Rapor */}
              <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-900 block">Indeks Rata-rata Nilai Rapor</span>
                  <span className="text-xs text-slate-500">{studentAcademics.length} Semester Terinput</span>
                </div>
                <span className="text-2xl font-black text-blue-900 font-mono">{avgScore}</span>
              </div>

              {/* RIASEC & IQ */}
              <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-indigo-900 block">Holland Code & IQ</span>
                  <span className="text-xs text-slate-500">{studentTalent?.tipeHollandRiasec || 'Belum Tes RIASEC'}</span>
                </div>
                <span className="text-2xl font-black text-indigo-900 font-mono">
                  {studentTalent?.skorIq || '-'}
                </span>
              </div>

              {/* Piagam Prestasi */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-amber-900 block">Bobot Sertifikat Kejuaraan</span>
                  <span className="text-xs text-slate-500">{studentAchievements.length} Piagam Resmi Terverifikasi</span>
                </div>
                <span className="text-2xl font-black text-amber-700 font-mono">
                  {studentAchievements.length > 0 ? `+${studentAchievements.length * 15}%` : '0%'}
                </span>
              </div>
            </div>

            {/* Rekap Piagam untuk Portofolio SNBP */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                Piagam Portofolio SNBP Terdaftar
              </h4>
              {studentAchievements.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Belum ada piagam kejuaraan yang dilampirkan.</p>
              ) : (
                <div className="space-y-2">
                  {studentAchievements.map(ach => (
                    <div key={ach.id} className="p-2.5 bg-slate-50 rounded-xl border text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span>{ach.namaLomba}</span>
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                          {ach.peringkat}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Tingkat {ach.tingkat} &bull; {ach.bidang}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Center & Right 2 Columns: Rekomendasi Jurusan & Analisis Jalur */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Recommended Majors */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Rekomendasi Program Studi PTN Pilihan
                </h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Kesesuaian Profil Tinggi
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(studentTalent?.rekomendasiJurusanKuliah || [
                  'Teknik Informatika / Ilmu Komputer',
                  'Sains Data & Kecerdasan Buatan',
                  'Teknik Elektro / Robotika',
                  'Matematika Murni'
                ]).map((major, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-indigo-100 bg-indigo-50/30 hover:bg-indigo-50/60 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded">
                        Peluang: {95 - idx * 6}%
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{major}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sesuai dengan linieritas nilai mata pelajaran IPA/Matematika, tipe kepribadian {studentTalent?.tipeHollandRiasec || 'Investigatif'}, dan gaya belajar {studentTalent?.gayaBelajar || 'Visual'}.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Analisis Jalur Seleksi Masuk PTN */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Analisis Kesiapan Jalur Seleksi Perguruan Tinggi
              </h3>

              <div className="space-y-3">
                {/* 1. SNBP (Prestasi Rapor) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      1. Jalur SNBP (Seleksi Nasional Berdasarkan Prestasi)
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${avgScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {avgScore >= 85 ? 'Sangat Direkomendasikan' : 'Perlu Penguatan Nilai'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Kombinasi nilai rata-rata <strong>{avgScore}</strong> dengan dukungan {studentAchievements.length} piagam tingkat {studentAchievements[0]?.tingkat || 'provinsi/kota'} memberikan nilai tambah portofolio yang sangat signifikan pada pemeringkatan eligible sekolah.
                  </p>
                </div>

                {/* 2. SNBT (UTBK Tes Skolastik) */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      2. Jalur SNBT (Tes UTBK Skolastik & Penalaran Matematika)
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Kesiapan Tinggi
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tipe Holland RIASEC yang dominan pada penalaran analitis dan skor IQ {studentTalent?.skorIq || 120} menunjukkan daya adaptasi cepat pada soal-soal penalaran induktif dan literasi kuantitatif.
                  </p>
                </div>

                {/* 3. Jalur Mandiri Prestasi & Kemitraan */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      3. Jalur Mandiri Prestasi (PBUD / Prestasi Talenta)
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      Alternatif Kuat
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Siswa dapat mendaftar langsung pada jalur penerimaan bibit unggul berprestasi di universitas terkemuka seperti UI, ITB, UGM, ITS, dan Unpad dengan portofolio yang telah terverifikasi di SIDATA.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="font-semibold text-sm">Pilih siswa untuk menampilkan analitik studi lanjut.</p>
        </div>
      )}
    </div>
  );
};
