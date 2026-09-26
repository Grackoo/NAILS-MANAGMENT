import React from 'react';
import { Appointment } from '../../types';

interface ClientFormulaModalProps {
  appointment: Appointment;
  onClose: () => void;
}

export const ClientFormulaModal: React.FC<ClientFormulaModalProps> = ({ appointment, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fdf8f5] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#cec5bd]/50 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#fedeb2] flex items-center justify-center text-[#725b38]">
              <span className="material-symbols-outlined text-[22px]">assignment</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
                Ficha Técnica de Cabina
              </span>
              <h2 className="font-serif text-lg font-bold text-[#1c1b1a]">
                {appointment.clientName}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2edea] text-[#4c4640] hover:text-[#1c1b1a] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Treatment & Formula Specifications */}
        <div className="space-y-3">
          <div className="bg-white p-3.5 rounded-xl border border-[#cec5bd]/30 shadow-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#725b38]">Protocolo Actual</span>
            <div className="flex items-center justify-between">
              <span className="font-serif text-base font-semibold text-[#1c1b1a]">{appointment.serviceTitle}</span>
              <span className="text-sm font-bold text-[#1c1b1a]">${appointment.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 pt-1 text-xs text-[#4c4640]">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-inner"
                style={{ backgroundColor: appointment.toneHex || '#EAD8CB' }}
              ></span>
              <span className="font-medium text-[#1c1b1a]">{appointment.toneName}</span>
            </div>
          </div>

          {/* Technical Specs */}
          <div className="bg-white p-3.5 rounded-xl border border-[#cec5bd]/30 shadow-xs space-y-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-[#725b38]">Detalles Clínicos & Biomecánica</span>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-[#4c4640] block">Tipo de Cutícula</span>
                <span className="font-semibold text-[#1c1b1a]">Sensible / Tipo Ruso Fino</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4c4640] block">Forma Esculpida</span>
                <span className="font-semibold text-[#1c1b1a]">Almendra Natural (#3)</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4c4640] block">Especialista Asignada</span>
                <span className="font-semibold text-[#1c1b1a]">{appointment.specialistName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#4c4640] block">Puesto de Atención</span>
                <span className="font-semibold text-[#1c1b1a]">{appointment.station}</span>
              </div>
            </div>
          </div>

          {/* Technician Notes */}
          <div className="bg-[#f8f3f0] p-3.5 rounded-xl border border-[#cec5bd]/30 space-y-1 text-xs">
            <span className="text-[10px] uppercase font-bold text-[#4c4640]">Notas de la Especialista</span>
            <p className="text-[#1c1b1a] leading-relaxed italic">
              "{appointment.clientNotes || 'Limpieza suave con fresa de llama grano rojo a 15,000 RPM. Aplicación de aceite de cutícula con infusión de lavanda y vitamina E.'}"
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f2edea]">
          <a
            href={`https://wa.me/${appointment.clientPhone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#1c1b1a] text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#725b38]">chat</span>
            <span>Contactar WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1e1b18] text-white text-xs font-semibold hover:bg-[#32302e] transition-colors"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
};
