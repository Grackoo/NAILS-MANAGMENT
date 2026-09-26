import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { WaitlistPriority } from '../../types';

interface NewWaitlistModalProps {
  onClose: () => void;
  initialTimeSlot?: string;
  initialDate?: string;
}

export const NewWaitlistModal: React.FC<NewWaitlistModalProps> = ({
  onClose,
  initialTimeSlot,
  initialDate,
}) => {
  const { services, specialists, addToWaitlist } = useStudio();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'serv-1');
  const [preferredSpecialistId, setPreferredSpecialistId] = useState('any');
  const [preferredShift, setPreferredShift] = useState<'mañana' | 'tarde' | 'cualquiera'>('mañana');
  const [preferredDateStr, setPreferredDateStr] = useState(initialDate || '2024-11-19');
  const [targetTimeSlot, setTargetTimeSlot] = useState(initialTimeSlot || '');
  const [priority, setPriority] = useState<WaitlistPriority>('alta');
  const [notes, setNotes] = useState('');

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedSpecialist = specialists.find((s) => s.id === preferredSpecialistId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor ingrese el nombre y teléfono de la clienta.');
      return;
    }

    addToWaitlist({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      preferredSpecialistId,
      preferredSpecialistName: selectedSpecialist ? selectedSpecialist.name : 'Cualquier manicurista',
      preferredShift,
      preferredDateStr,
      targetTimeSlot: targetTimeSlot.trim() || undefined,
      priority,
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#fdf8f5] w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-[#cec5bd]/50 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
              Lista de Espera Signature
            </span>
            <h2 className="font-serif text-xl font-bold text-[#1c1b1a]">
              Añadir Clienta a Lista de Espera
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2edea] text-[#4c4640] hover:text-[#1c1b1a] flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640]">Nombre Clienta</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Claire Fontaine"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640]">Teléfono WhatsApp</label>
              <input
                type="tel"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+34 600 000 000"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640]">Tratamiento Deseado</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} (${s.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640]">Turno Preferido</label>
              <select
                value={preferredShift}
                onChange={(e) => setPreferredShift(e.target.value as any)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              >
                <option value="mañana">Turno Mañana (09:00 - 13:00)</option>
                <option value="tarde">Turno Tarde (15:00 - 19:30)</option>
                <option value="cualquiera">Cualquier Horario Disponible</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640]">Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as WaitlistPriority)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              >
                <option value="vip">VIP (Primer aviso inmediato)</option>
                <option value="alta">Alta (Prioridad estándar)</option>
                <option value="normal">Normal</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640]">Especialista Preferida</label>
              <select
                value={preferredSpecialistId}
                onChange={(e) => setPreferredSpecialistId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              >
                <option value="any">Cualquier Manicurista</option>
                {specialists.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} ({sp.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640]">Horario Específico (Opcional)</label>
              <input
                type="text"
                value={targetTimeSlot}
                onChange={(e) => setTargetTimeSlot(e.target.value)}
                placeholder="Ej. 11:00 AM o 04:30 PM"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640]">Notas de la Solicitud (Opcional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ej. Evento privado por la noche, busca turno urgente si alguien cancela."
              className="w-full p-2.5 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38] resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f2edea]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#4c4640] hover:text-[#1c1b1a]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#32302e] shadow-xs"
            >
              Registrar en Lista de Espera
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
