import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';

interface NewAppointmentModalProps {
  onClose: () => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ onClose }) => {
  const { services, specialists, addAppointment } = useStudio();

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'serv-1');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState(specialists[0]?.id || 'valeria');
  const [time, setTime] = useState('10:00 AM');
  const [dateStr, setDateStr] = useState('2024-11-19');
  const [isVip, setIsVip] = useState(false);
  const [notes, setNotes] = useState('');

  const selectedService = services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedSpecialist = specialists.find((s) => s.id === selectedSpecialistId) || specialists[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor ingrese el nombre y teléfono de la clienta.');
      return;
    }

    addAppointment({
      time,
      durationText: `${Math.floor(selectedService.durationMinutes / 60)}h ${selectedService.durationMinutes % 60}m`,
      durationMinutes: selectedService.durationMinutes,
      shift: time.includes('PM') ? 'tarde' : 'mañana',
      shiftLabel: time.includes('PM') ? 'Turno Tarde' : 'Turno Mañana',
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientNotes: notes.trim() || undefined,
      isVip,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      toneName: 'A definir en mesa',
      toneHex: '#EAD8CB',
      specialistId: selectedSpecialist.id,
      specialistName: selectedSpecialist.name,
      station: selectedSpecialist.station,
      price: selectedService.price,
      depositPaid: selectedService.price * 0.5,
      status: 'confirmada',
      dateStr,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#fdf8f5] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#cec5bd]/50 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
              Recepción Atelier
            </span>
            <h2 className="font-serif text-xl font-bold text-[#1c1b1a]">Nueva Cita Manual / Walk-in</h2>
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
                placeholder="Ej. Valentina Dupuis"
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
            <label className="text-[10px] uppercase font-bold text-[#4c4640]">Tratamiento Seleccionado</label>
            <select
              value={selectedServiceId}
              onChange={(e) => setSelectedServiceId(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} — ${s.price.toFixed(2)} ({s.durationMinutes} min)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640]">Especialista & Mesa</label>
              <select
                value={selectedSpecialistId}
                onChange={(e) => setSelectedSpecialistId(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              >
                {specialists.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} ({sp.station})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640]">Hora de Cita</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="10:00 AM"
                className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#f8f3f0] border border-[#cec5bd]/30">
            <span className="text-xs font-semibold text-[#1c1b1a]">Marcar como Clienta VIP</span>
            <input
              type="checkbox"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
              className="accent-[#725b38] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640]">Notas de Atención (Opcional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferencias de color, diseño previo, café de cortesía..."
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
              Agendar en el Sistema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
