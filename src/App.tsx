import React, { useState, useEffect, useCallback } from 'react';
import { User, Student, AcademicRecord, Achievement, DisciplineRecord, TalentAssessment, AuditLog } from './types';
import { storage } from './services/storage';
import { ExportService } from './services/export';
import { ToastProvider, useToast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentProfileView } from './components/StudentProfileView';
import { AcademicView } from './components/AcademicView';
import { AchievementsView } from './components/AchievementsView';
import { DisciplineView } from './components/DisciplineView';
import { TalentView } from './components/TalentView';
import { AnalyticsView } from './components/AnalyticsView';
import { AuditLogView } from './components/AuditLogView';
import { GasConfigModal } from './components/GasConfigModal';
import { ConfirmModal } from './components/ConfirmModal';

function MainApp() {
  const { showToast } = useToast();

  // App Global State
  const [currentUser, setCurrentUser] = useState<User>(storage.getCurrentUser());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGasModalOpen, setIsGasModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

  // Entities Data
  const [students, setStudents] = useState<Student[]>([]);
  const [academics, setAcademics] = useState<AcademicRecord[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [disciplines, setDisciplines] = useState<DisciplineRecord[]>([]);
  const [talents, setTalents] = useState<TalentAssessment[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Refresh All Entities from Storage
  const refreshData = useCallback(() => {
    setStudents(storage.getStudents());
    setAcademics(storage.getAcademicRecords());
    setAchievements(storage.getAchievements());
    setDisciplines(storage.getDisciplineRecords());
    setTalents(storage.getTalentAssessments());
    setAuditLogs(storage.getAuditLogs());
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // At-risk students count (poin >= 26)
  const atRiskCount = students.filter(s => storage.getStudentTotalDisciplinePoints(s.id) >= 26).length;

  const handleExportAll = () => {
    ExportService.exportToExcel(students, academics, achievements, disciplines, talents);
    showToast(
      'Database Berhasil Diekspor',
      `Seluruh data master (${students.length} siswa) berhasil diunduh ke format Excel (.xlsx).`,
      'success'
    );
  };

  const handleResetData = () => {
    storage.resetToDefault();
    refreshData();
    setIsResetConfirmOpen(false);
    showToast('Data Dipulihkan', 'Basis data percontohan SMA telah berhasil dimuat ulang.', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onUserChange={user => {
          setCurrentUser(user);
          showToast('Peran Diperbarui', `Beralih ke peran: ${user.name} (${user.roleTitle})`, 'info');
        }}
        onOpenGasModal={() => setIsGasModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          userRole={currentUser.role}
          studentCount={students.length}
          atRiskCount={atRiskCount}
          onExportAll={handleExportAll}
          onResetData={() => setIsResetConfirmOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              academicRecords={academics}
              achievements={achievements}
              disciplineRecords={disciplines}
              auditLogs={auditLogs}
              onNavigate={setActiveTab}
              onOpenAddStudent={() => {
                setActiveTab('students');
                setIsAddStudentModalOpen(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentProfileView
              students={students}
              onRefresh={refreshData}
              isAddModalOpen={isAddStudentModalOpen}
              onCloseAddModal={() => setIsAddStudentModalOpen(false)}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicView
              students={students}
              academicRecords={academics}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'achievements' && (
            <AchievementsView
              students={students}
              achievements={achievements}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'discipline' && (
            <DisciplineView
              students={students}
              disciplineRecords={disciplines}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'talent' && (
            <TalentView
              students={students}
              talentAssessments={talents}
              onRefresh={refreshData}
            />
          )}

          {activeTab === 'pathway' && (
            <AnalyticsView
              students={students}
              academicRecords={academics}
              achievements={achievements}
              talentAssessments={talents}
            />
          )}

          {activeTab === 'audit' && (
            <AuditLogView
              auditLogs={auditLogs}
              onRefresh={refreshData}
            />
          )}
        </main>
      </div>

      {/* GAS Config Modal */}
      <GasConfigModal
        isOpen={isGasModalOpen}
        onClose={() => setIsGasModalOpen(false)}
      />

      {/* Confirm Reset Data Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Muat Ulang Data Sampel?"
        message="Tindakan ini akan mengembalikan seluruh database ke kondisi awal data demo SMA (Siswa, Nilai Rapor, Prestasi, Kedisiplinan, dan Psikotes)."
        confirmText="Muat Ulang Sampel"
        isDangerous={false}
        onConfirm={handleResetData}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
