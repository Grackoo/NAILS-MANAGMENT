import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { ClientTab } from '../../types';

export const ClientBottomNav: React.FC = () => {
  const { clientTab, setClientTab, appointments } = useStudio();

  // Count active client appointments
  const activeCount = appointments.filter((a) => a.status === 'confirmada' || a.status === 'en_proceso').length;

  const navItems: { tab: ClientTab; label: string; icon: string; badge?: number }[] = [
    { tab: 'catalogo', label: 'Catálogo', icon: 'style' },
    { tab: 'agendar', label: 'Agendar', icon: 'calendar_add_on' },
    { tab: 'trabajos', label: 'Reseñas', icon: 'photo_camera' },
    { tab: 'puntos', label: 'Puntos', icon: 'stars' },
    { tab: 'agenda', label: 'Citas', icon: 'event_available', badge: activeCount },
    { tab: 'notificaciones', label: 'Avisos', icon: 'notifications' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fdf8f5]/95 backdrop-blur-xl border-t border-[#cec5bd]/40 shadow-[0_-4px_16px_rgba(45,39,36,0.06)]">
      <div className="flex justify-between sm:justify-around items-center h-16 max-w-lg mx-auto px-2 sm:px-4 pb-safe">
        {navItems.map((item) => {
          const isActive = clientTab === item.tab;
          return (
            <button
              key={item.tab}
              type="button"
              onClick={() => {
                setClientTab(item.tab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[44px] sm:min-w-[56px] py-1 transition-colors relative ${
                isActive ? 'text-[#725b38] font-bold' : 'text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              <div className="relative">
                <span
                  className={`material-symbols-outlined text-[22px] sm:text-[24px] transition-transform ${
                    isActive ? 'scale-110 font-medium' : ''
                  }`}
                >
                  {item.icon}
                </span>
                {item.badge !== undefined && item.badge > 0 && item.tab === 'agenda' && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#725b38] text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight leading-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#725b38] mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
