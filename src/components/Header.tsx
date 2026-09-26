import React from 'react';
import { useStudio } from '../context/StudioContext';
import { Role } from '../types';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    viewportMode,
    setViewportMode,
    clientTab,
    setClientTab,
    adminTab,
    clientNotificationPreferences,
    loyaltyProfile,
  } = useStudio();

  const getSubTitle = () => {
    if (role === 'client') {
      if (clientTab === 'agendar') return 'Agendar Cita';
      if (clientTab === 'catalogo') return 'Catálogo de Servicios';
      if (clientTab === 'trabajos') return 'Galería de Trabajos';
      if (clientTab === 'notificaciones') return 'Recordatorios & Avisos';
      if (clientTab === 'puntos') return 'Club Vernis Privilège';
      return 'Mis Citas & Agenda';
    } else {
      if (adminTab === 'agenda') return 'Agenda y Horarios';
      if (adminTab === 'waitlist') return 'Lista de Espera';
      if (adminTab === 'resenas') return 'Moderación de Reseñas & Fotos';
      if (adminTab === 'catalogo') return 'Gestión de Catálogo';
      if (adminTab === 'clientas') return 'Directorio Clientas VIP';
      if (adminTab === 'reportes') return 'Dashboard de Rendimiento';
      return 'Configuración de Salón';
    }
  };

  return (
    <header className="sticky top-0 w-full z-40 bg-[#fdf8f5]/90 backdrop-blur-xl border-b border-[#cec5bd]/40 shadow-[0_1px_8px_rgba(45,39,36,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col py-2.5 gap-2">
          {/* Main Top Row */}
          <div className="flex items-center justify-between gap-2">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#f8f3f0] border border-[#cec5bd]/60 flex items-center justify-center p-1 overflow-hidden shrink-0 shadow-xs">
                <img
                  src="https://lh3.googleusercontent.com/aida/AEtjO1WeS18HwIlPLWqATMYOOUC8XMppEnqUK2a3JDlwQalzICr5dH5rwvQ6My-lA8fKJERMJRFqT_uj51y4UNzxMGRFkrjw184aaa5b1uloQmVMmTQrWA6nUpdybxo0Gf4WhdznZRTzOKoPDOkrR3e-tbXe28R_wdnZYC1RlWxs3DozGo4VaNvHAnWer5lUzkyGWTSrQRzgT-Dz7SQlRt71Eyu9q3l9EjeN-4XOWsM8BvcEuu_d33Ey8Bom"
                  alt="L'Atelier Vernis Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-[#1c1b1a] leading-none">
                  L'Atelier Vernis
                </span>
                <span className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#725b38] mt-0.5">
                  Haute Beauté
                </span>
              </div>
            </div>

            {/* Middle: Screen Context Info */}
            <div className="hidden md:flex items-center gap-2 bg-[#f2edea] px-3 py-1 rounded-full text-xs text-[#4c4640]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#725b38] animate-pulse"></span>
              <span className="font-semibold text-[#1c1b1a]">{getSubTitle()}</span>
              <span className="text-[#cec5bd]">•</span>
              <span>París &bull; Salón Central</span>
            </div>

            {/* Right Tools: Viewport Toggle & Profile Avatar */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Device Viewport Preview Toggle (Mobile Frame vs Desktop) */}
              <div className="hidden sm:inline-flex items-center p-0.5 rounded-full bg-[#f2edea] border border-[#cec5bd]/50 text-xs">
                <button
                  type="button"
                  onClick={() => setViewportMode('responsive')}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                    viewportMode === 'responsive'
                      ? 'bg-white text-[#1c1b1a] shadow-xs'
                      : 'text-[#4c4640] hover:text-[#1c1b1a]'
                  }`}
                  title="Diseño Adaptativo Fluido"
                >
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">devices</span>
                    <span>Fluido</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('mobile_preview')}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                    viewportMode === 'mobile_preview'
                      ? 'bg-white text-[#1c1b1a] shadow-xs'
                      : 'text-[#4c4640] hover:text-[#1c1b1a]'
                  }`}
                  title="Simular Pantalla Móvil de la App"
                >
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">smartphone</span>
                    <span>Móvil</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode('desktop_preview')}
                  className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                    viewportMode === 'desktop_preview'
                      ? 'bg-white text-[#1c1b1a] shadow-xs'
                      : 'text-[#4c4640] hover:text-[#1c1b1a]'
                  }`}
                  title="Simular Consola de Escritorio"
                >
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">desktop_mac</span>
                    <span>Escritorio</span>
                  </span>
                </button>
              </div>

              {/* Loyalty Points Pill Button */}
              {role === 'client' && (
                <button
                  type="button"
                  onClick={() => setClientTab('puntos')}
                  className={`h-9 px-2.5 sm:px-3 rounded-full flex items-center gap-1.5 transition-all border text-xs font-semibold ${
                    clientTab === 'puntos'
                      ? 'bg-[#1e1b18] text-[#fedeb2] border-[#fedeb2]/40 shadow-xs ring-1 ring-[#fedeb2]/30'
                      : 'bg-[#f8f3f0] hover:bg-[#fedeb2]/30 text-[#725b38] border-[#cec5bd]/40'
                  }`}
                  title="Club Vernis Privilège: Ver puntos y canjear descuentos"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-500">stars</span>
                  <span>{loyaltyProfile.pointsBalance.toLocaleString()} pts</span>
                </button>
              )}

              {/* Notification Preferences Quick Icon for Client Mode */}
              {role === 'client' && (
                <button
                  type="button"
                  onClick={() => setClientTab('notificaciones')}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all relative border ${
                    clientTab === 'notificaciones'
                      ? 'bg-[#1e1b18] text-[#fedeb2] border-[#1e1b18] shadow-sm'
                      : 'bg-[#f8f3f0] hover:bg-[#f2edea] text-[#4c4640] border-[#cec5bd]/40'
                  }`}
                  title="Configurar recordatorios por WhatsApp, SMS o Correo"
                >
                  <span className="material-symbols-outlined text-[19px]">notifications</span>
                  {(clientNotificationPreferences.whatsapp || clientNotificationPreferences.sms || clientNotificationPreferences.email) && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white"></span>
                  )}
                </button>
              )}

              {/* Profile Avatar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRole(role === 'client' ? 'admin' : 'client')}
                  className="w-9 h-9 rounded-full ring-2 ring-[#725b38]/40 p-0.5 hover:ring-[#725b38] transition-all overflow-hidden flex items-center justify-center shrink-0 shadow-xs"
                  title="Cambiar perfil"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkfiLIvIqRfOYokHU6lqoT-Lofmpg3bvelWvQX7dfzaMv-GWje3dJ2kv_scaMMCjdLV0dF84hJIekyLQN7blHomEfgCI7glXZInnkrYfYGpEwh_yY2OVxae99IDJk7XyYgaqRfe6SOJdJW0sahJBiFtIc-ojLfpKQKxgv2SHe8TC9Szr9bZJoe_X92GyimAwndUx2UgMH4v6cOtxZTU2AQ9Ef0IINl92y939q6ObFpQdq5_UUUpQ"
                    alt="Valerie M."
                    className="w-full h-full rounded-full object-cover"
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Sub Row: Mode Segmented Switcher (Vista Cliente vs Administración) */}
          <div className="flex items-center justify-center w-full pt-0.5">
            <div className="inline-flex items-center p-1 rounded-full bg-[#f2edea] border border-[#cec5bd]/40 shadow-inner">
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`min-h-[32px] px-5 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  role === 'client'
                    ? 'bg-[#1e1b18] text-white shadow-sm ring-1 ring-black/10'
                    : 'text-[#4c4640] hover:text-[#1c1b1a]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span>Vista Cliente</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`min-h-[32px] px-5 py-1 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  role === 'admin'
                    ? 'bg-[#1e1b18] text-white shadow-sm ring-1 ring-black/10'
                    : 'text-[#4c4640] hover:text-[#1c1b1a]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                <span>Administración</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
