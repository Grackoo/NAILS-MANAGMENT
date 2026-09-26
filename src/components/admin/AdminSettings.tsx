import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';

export const AdminSettings: React.FC = () => {
  const { studioConfig, updateStudioConfig } = useStudio();
  const [openingHour, setOpeningHour] = useState(studioConfig.openingHour);
  const [closingHour, setClosingHour] = useState(studioConfig.closingHour);
  const [cleaningMinutes, setCleaningMinutes] = useState(studioConfig.cleanupProtocolMinutes);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleDay = (dayId: string) => {
    const updated = studioConfig.workDays.map((d) =>
      d.id === dayId ? { ...d, isOpen: !d.isOpen } : d
    );
    updateStudioConfig({ workDays: updated });
  };

  const handleSave = () => {
    updateStudioConfig({
      openingHour,
      closingHour,
      cleanupProtocolMinutes: Number(cleaningMinutes),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const openDaysCount = studioConfig.workDays.filter((d) => d.isOpen).length;

  return (
    <div className="flex flex-col w-full max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
          Configuración Operativa
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
          Horarios de Salón & Protocolos
        </h1>
        <p className="text-xs text-[#4c4640] mt-0.5">
          Configura los días laborales activos para reserva en línea y el protocolo de bioseguridad entre turnos.
        </p>
      </div>

      {/* Workdays Configuration Card */}
      <div className="bg-white p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1c1b1a]">Días Laborales Activos</h2>
            <p className="text-xs text-[#4c4640]">Habilita o deshabilita días en el motor de reservas directas.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#fedeb2] text-[#584323] text-xs font-bold">
            {openDaysCount} Días Abierto
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          {studioConfig.workDays.map((day) => (
            <label
              key={day.id}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                day.isOpen
                  ? 'bg-[#f8f3f0] border-[#cec5bd]/40'
                  : 'bg-[#f2edea]/50 border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    day.isOpen ? 'bg-white text-[#1c1b1a] shadow-xs' : 'bg-[#e6e2df] text-[#4c4640]'
                  }`}
                >
                  {day.shortLabel}
                </span>
                <div>
                  <span className="text-xs font-semibold text-[#1c1b1a] block">{day.label}</span>
                  {day.specialNote && (
                    <span className="text-[10px] text-[#725b38] font-bold block">{day.specialNote}</span>
                  )}
                </div>
              </div>
              <input
                type="checkbox"
                checked={day.isOpen}
                onChange={() => toggleDay(day.id)}
                className="accent-[#1e1b18] w-5 h-5 rounded cursor-pointer"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Operating Hours Range */}
      <div className="bg-white p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs space-y-4">
        <div>
          <h2 className="font-serif text-base font-bold text-[#1c1b1a]">Rango de Atención Habitual</h2>
          <p className="text-xs text-[#4c4640]">Franja horaria para el primer y último turno del día.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640]">Hora Apertura</label>
            <div className="flex items-center bg-[#f8f3f0] border border-[#cec5bd]/40 px-3.5 py-2.5 rounded-xl">
              <span className="material-symbols-outlined text-[#725b38] text-[20px] mr-2">alarm</span>
              <input
                type="text"
                value={openingHour}
                onChange={(e) => setOpeningHour(e.target.value)}
                className="bg-transparent font-serif text-base font-bold text-[#1c1b1a] w-full focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640]">Hora Cierre</label>
            <div className="flex items-center bg-[#f8f3f0] border border-[#cec5bd]/40 px-3.5 py-2.5 rounded-xl">
              <span className="material-symbols-outlined text-[#725b38] text-[20px] mr-2">nest_clock_farsight_analog</span>
              <input
                type="text"
                value={closingHour}
                onChange={(e) => setClosingHour(e.target.value)}
                className="bg-transparent font-serif text-base font-bold text-[#1c1b1a] w-full focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cleaning Protocol Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-xs border border-[#cec5bd]/40 mt-2">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0UaulzDU2TWEXFpf5Ncv_zlc2rqJytTZWR2wbvGnXKHad1Mk7uP38D6q70Z11FlvSwFeBAm8_4P0VKhkOJSSuw7GZXxRQuFejeyBLBcUzKNfB9S9lH7j7kq6y5Ci2PCaUnEyUA2CzG3xVHVozv7bNIKvu5pvP1QyRoEk_Tubvjbu9Xn_eY3S4W9Z9EXn0IVhTUUr-b7NwbV7NSk7jc4hAOHs13DHP9c2N0XGybfUEGHGiUdu_jg"
            alt="Atelier Paris"
            className="w-full h-36 object-cover"
          />
          <div className="absolute inset-0 bg-[#1e1b18]/60 backdrop-blur-xs flex items-center justify-between p-5 text-white">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#fedeb2] font-bold block">
                Protocolo de Bioseguridad & Esterilización
              </span>
              <p className="font-serif text-xl font-bold mt-0.5">
                {cleaningMinutes} min entre cada servicio
              </p>
              <p className="text-xs text-white/80 mt-0.5">
                Desinfección de fresas con autoclave médico y cambio de apoyamanos.
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[28px]">sanitizer</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#cec5bd]/40">
        <span className="text-xs text-[#4c4640]">
          {savedSuccess ? '¡Cambios guardados con éxito!' : 'Los cambios se aplican de inmediato en la vista cliente.'}
        </span>
        <button
          type="button"
          onClick={handleSave}
          className="px-6 py-2.5 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95"
        >
          Guardar Configuración
        </button>
      </div>
    </div>
  );
};
