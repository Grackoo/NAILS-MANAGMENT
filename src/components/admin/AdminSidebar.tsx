import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { AdminTab } from '../../types';

export const AdminSidebar: React.FC = () => {
  const { adminTab, setAdminTab, setRole, waitlist, reviews } = useStudio();

  const waitingCount = waitlist.filter((w) => w.status === 'esperando').length;
  const pendingReviewsCount = reviews.filter((r) => r.status === 'pendiente').length;

  const navItems: { tab: AdminTab; label: string; icon: string; badge?: number }[] = [
    { tab: 'agenda', label: 'Agenda & Calendario', icon: 'calendar_today' },
    { tab: 'waitlist', label: 'Lista de Espera', icon: 'hourglass_top', badge: waitingCount },
    { tab: 'resenas', label: 'Moderación de Reseñas', icon: 'rate_review', badge: pendingReviewsCount },
    { tab: 'catalogo', label: 'Gestión de Catálogo', icon: 'spa' },
    { tab: 'clientas', label: 'Clientas VIP', icon: 'group' },
    { tab: 'horarios', label: 'Configuración de Horarios', icon: 'schedule' },
    { tab: 'reportes', label: 'Reportes / Métricas', icon: 'analytics' },
  ];

  return (
    <aside className="w-72 bg-[#f8f3f0] h-full flex flex-col justify-between p-4 border-r border-[#cec5bd]/40 shrink-0 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col gap-4">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-8 h-8 rounded-full bg-white border border-[#cec5bd]/50 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-xs">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1WeS18HwIlPLWqATMYOOUC8XMppEnqUK2a3JDlwQalzICr5dH5rwvQ6My-lA8fKJERMJRFqT_uj51y4UNzxMGRFkrjw184aaa5b1uloQmVMmTQrWA6nUpdybxo0Gf4WhdznZRTzOKoPDOkrR3e-tbXe28R_wdnZYC1RlWxs3DozGo4VaNvHAnWer5lUzkyGWTSrQRzgT-Dz7SQlRt71Eyu9q3l9EjeN-4XOWsM8BvcEuu_d33Ey8Bom"
              alt="L'Atelier Vernis Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-base font-semibold tracking-tight text-[#1c1b1a] leading-tight">
              L'Atelier Vernis
            </span>
            <span className="text-[10px] text-[#4c4640] uppercase tracking-widest font-bold">
              Haute Beauté
            </span>
          </div>
        </div>

        {/* Admin pill status */}
        <div className="flex items-center justify-between bg-[#f2edea] p-1 rounded-full border border-[#cec5bd]/30">
          <span className="px-3 py-1 rounded-full bg-white text-[11px] font-semibold text-[#1c1b1a] shadow-xs">
            Consola Admin
          </span>
          <button
            type="button"
            onClick={() => setRole('client')}
            className="px-3 py-1 rounded-full text-[11px] text-[#4c4640] hover:text-[#1c1b1a] font-medium transition-colors"
          >
            Vista Cliente &rarr;
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col gap-1 mt-2">
          {navItems.map((item) => {
            const isActive = adminTab === item.tab;
            return (
              <button
                key={item.tab}
                type="button"
                onClick={() => setAdminTab(item.tab)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#e6e2df] text-[#1c1b1a] shadow-xs ring-1 ring-black/5'
                    : 'text-[#4c4640] hover:bg-[#f2edea] hover:text-[#1c1b1a]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`material-symbols-outlined text-[18px] ${isActive ? 'text-[#725b38]' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#fedeb2] text-[#584323] text-[10px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Footer */}
      <div className="bg-white p-3 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkfiLIvIqRfOYokHU6lqoT-Lofmpg3bvelWvQX7dfzaMv-GWje3dJ2kv_scaMMCjdLV0dF84hJIekyLQN7blHomEfgCI7glXZInnkrYfYGpEwh_yY2OVxae99IDJk7XyYgaqRfe6SOJdJW0sahJBiFtIc-ojLfpKQKxgv2SHe8TC9Szr9bZJoe_X92GyimAwndUx2UgMH4v6cOtxZTU2AQ9Ef0IINl92y939q6ObFpQdq5_UUUpQ"
            alt="Valerie M."
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#725b38]/30"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#1c1b1a] leading-tight">Valerie M.</span>
            <span className="text-[10px] text-[#4c4640]">Directora del Estudio</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setAdminTab('horarios')}
            className="p-1.5 text-[#4c4640] hover:text-[#1c1b1a] rounded-full hover:bg-[#f2edea] transition-colors"
            title="Configuración de Salón"
          >
            <span className="material-symbols-outlined text-[18px]">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
