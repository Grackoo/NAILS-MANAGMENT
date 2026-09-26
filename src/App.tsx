import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { Header } from './components/Header';
import { ClientBottomNav } from './components/client/ClientBottomNav';
import { BookingFlow } from './components/client/BookingFlow';
import { ClientCatalog } from './components/client/ClientCatalog';
import { ClientGallery } from './components/client/ClientGallery';
import { ClientMyAppointments } from './components/client/ClientMyAppointments';
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminSchedule } from './components/admin/AdminSchedule';
import { AdminCatalog } from './components/admin/AdminCatalog';
import { AdminClients } from './components/admin/AdminClients';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminReports } from './components/admin/AdminReports';
import { AdminWaitlist } from './components/admin/AdminWaitlist';
import { AdminReviewsModeration } from './components/admin/AdminReviewsModeration';
import { ClientNotificationSettings } from './components/client/ClientNotificationSettings';
import { ClientLoyaltyProgram } from './components/client/ClientLoyaltyProgram';
import { LoginScreen } from './components/auth/LoginScreen';

const AppContent: React.FC = () => {
  const { isAuthenticated, role, clientTab, adminTab, setAdminTab, viewportMode, waitlist, freedSlotAlert, setFreedSlotAlert, reviews } = useStudio();

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Count pending reviews for badge
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pendiente').length;

  // Render client subviews
  const renderClientView = () => {
    switch (clientTab) {
      case 'catalogo':
        return <ClientCatalog />;
      case 'agendar':
        return <BookingFlow />;
      case 'trabajos':
        return <ClientGallery />;
      case 'agenda':
        return <ClientMyAppointments />;
      case 'notificaciones':
        return <ClientNotificationSettings />;
      case 'puntos':
        return <ClientLoyaltyProgram />;
      default:
        return <BookingFlow />;
    }
  };

  // Render admin subviews
  const renderAdminView = () => {
    switch (adminTab) {
      case 'agenda':
        return <AdminSchedule />;
      case 'waitlist':
        return <AdminWaitlist />;
      case 'catalogo':
        return <AdminCatalog />;
      case 'clientas':
        return <AdminClients />;
      case 'horarios':
        return <AdminSettings />;
      case 'reportes':
        return <AdminReports />;
      case 'resenas':
        return <AdminReviewsModeration />;
      default:
        return <AdminSchedule />;
    }
  };

  // Wrap inside mobile device frame if viewportMode === 'mobile_preview'
  if (viewportMode === 'mobile_preview') {
    return (
      <div className="min-h-screen bg-[#ece7e4] flex flex-col items-center justify-start p-2 sm:p-6 overflow-x-hidden">
        {/* Helper bar to exit or switch */}
        <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs text-[#4c4640]">
          <span className="font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#725b38]"></span>
            Simulación Vista Móvil
          </span>
          <span className="text-[11px] text-[#7d766f]">iPhone 15 Pro • 393 × 852</span>
        </div>

        {/* Smartphone mockup frame */}
        <div className="w-full max-w-[420px] bg-[#1e1b18] p-2.5 sm:p-3 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] border-4 border-[#32302e] relative overflow-hidden">
          {/* Dynamic Island / Speaker notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-50 flex items-center justify-end pr-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-950/60 ring-1 ring-white/10"></div>
          </div>

          {/* Internal Screen Area */}
          <div className="bg-[#fdf8f5] w-full min-h-[780px] max-h-[85vh] overflow-y-auto rounded-[36px] relative shadow-inner flex flex-col pt-3">
            <Header />

            {/* Mobile Admin tab pills when in admin mode */}
            {role === 'admin' && (
              <div className="px-4 pt-2">
                <div className="flex items-center gap-1 p-1 bg-[#f2edea] rounded-full overflow-x-auto no-scrollbar border border-[#cec5bd]/40">
                  <button
                    type="button"
                    onClick={() => setAdminTab('agenda')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      adminTab === 'agenda' ? 'bg-[#1e1b18] text-white' : 'text-[#4c4640]'
                    }`}
                  >
                    Agenda
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('waitlist')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      adminTab === 'waitlist' ? 'bg-[#1e1b18] text-white' : 'text-[#4c4640]'
                    }`}
                  >
                    Espera ({waitlist.filter((w) => w.status === 'esperando').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('resenas')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1 ${
                      adminTab === 'resenas' ? 'bg-[#1e1b18] text-white' : 'text-[#4c4640]'
                    }`}
                  >
                    <span>Reseñas</span>
                    {pendingReviewsCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                        {pendingReviewsCount}
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('catalogo')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      adminTab === 'catalogo' ? 'bg-[#1e1b18] text-white' : 'text-[#4c4640]'
                    }`}
                  >
                    Catálogo
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('horarios')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      adminTab === 'horarios' ? 'bg-[#1e1b18] text-white' : 'text-[#4c4640]'
                    }`}
                  >
                    Horarios
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('clientas')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      adminTab === 'clientas' ? 'bg-[#1e1b18] text-white' : 'text-[#4c4640]'
                    }`}
                  >
                    Clientas
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminTab('reportes')}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      adminTab === 'reportes' ? 'bg-[#1e1b18] text-white' : 'text-[#4c4640]'
                    }`}
                  >
                    Métricas
                  </button>
                </div>
              </div>
            )}

            <main className="flex-1 w-full pt-1">
              {role === 'client' ? renderClientView() : <div className="px-4 py-2">{renderAdminView()}</div>}
            </main>

            {role === 'client' && <ClientBottomNav />}
          </div>
        </div>
      </div>
    );
  }

  // Desktop or standard responsive layout
  return (
    <div className="min-h-screen bg-[#fdf8f5] flex flex-col text-[#1c1b1a]">
      {/* Top Header */}
      <Header />

      {/* Main Content Body */}
      {role === 'admin' ? (
        <div className="flex-1 flex w-full">
          {/* Sidebar on md+ screens */}
          <div className="hidden lg:block shrink-0 sticky top-[73px] h-[calc(100vh-73px)]">
            <AdminSidebar />
          </div>

          {/* Main admin workspace */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {/* Mobile nav for admin on smaller screens */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center gap-1.5 p-1 bg-[#f2edea] rounded-full overflow-x-auto no-scrollbar border border-[#cec5bd]/40">
                <button
                  type="button"
                  onClick={() => setAdminTab('agenda')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    adminTab === 'agenda' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640]'
                  }`}
                >
                  Agenda
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('waitlist')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    adminTab === 'waitlist' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640]'
                  }`}
                >
                  Lista de Espera ({waitlist.filter((w) => w.status === 'esperando').length})
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('resenas')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                    adminTab === 'resenas' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640]'
                  }`}
                >
                  <span>Reseñas</span>
                  {pendingReviewsCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                      {pendingReviewsCount}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('catalogo')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    adminTab === 'catalogo' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640]'
                  }`}
                >
                  Catálogo
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('clientas')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    adminTab === 'clientas' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640]'
                  }`}
                >
                  Clientas
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('horarios')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    adminTab === 'horarios' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640]'
                  }`}
                >
                  Horarios
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('reportes')}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                    adminTab === 'reportes' ? 'bg-[#1e1b18] text-white shadow-xs' : 'text-[#4c4640]'
                  }`}
                >
                  Métricas
                </button>
              </div>
            </div>

            {renderAdminView()}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col w-full">
          <main className="flex-1 w-full">{renderClientView()}</main>
          <ClientBottomNav />
        </div>
      )}
      {/* Global Automated Waitlist Freed Slot Notification Modal */}
      {freedSlotAlert && (
        <FreedSlotModal
          event={freedSlotAlert}
          onClose={() => setFreedSlotAlert(null)}
          onOpenWaitlistView={() => {
            setFreedSlotAlert(null);
            setAdminTab('waitlist');
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <AppContent />
    </StudioProvider>
  );
}
