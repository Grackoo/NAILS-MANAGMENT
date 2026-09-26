import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { FreedSlotEvent, WaitlistEntry } from '../../types';

interface FreedSlotModalProps {
  event: FreedSlotEvent;
  onClose: () => void;
  onOpenWaitlistView: () => void;
}

export const FreedSlotModal: React.FC<FreedSlotModalProps> = ({
  event,
  onClose,
  onOpenWaitlistView,
}) => {
  const { assignSlotToWaitlistClient, updateWaitlistStatus, autoNotifyWaitlist } = useStudio();
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const candidates: WaitlistEntry[] = event.matchedCandidates || [];

  const handleNotifyWhatsApp = (candidate: WaitlistEntry) => {
    const text = `Hola ${candidate.clientName}, ¡buenas noticias de L'Atelier Vernis! ✨ Se acaba de liberar un espacio hoy a las ${event.time} con ${event.specialistName} para ${candidate.serviceTitle}. Como estás en nuestra lista de espera preferente, tienes prioridad para confirmarlo. ¿Deseas que te lo reservemos?`;
    const url = `https://wa.me/${candidate.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
    updateWaitlistStatus(candidate.id, 'notificada', `Notificada manualmente por WhatsApp para slot de las ${event.time}.`);
    setNotificationToast(`Mensaje enviado por WhatsApp a ${candidate.clientName}`);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  const handleAssignDirect = (candidate: WaitlistEntry) => {
    assignSlotToWaitlistClient(candidate.id, event);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fdf8f5] w-full max-w-xl rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#cec5bd]/60 flex flex-col space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header with Luxury Champagne Glow */}
        <div className="flex items-start justify-between pb-3 border-b border-[#f2edea]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#fedeb2] text-[#725b38] flex items-center justify-center shrink-0 shadow-inner ring-4 ring-[#fedeb2]/40">
              <span className="material-symbols-outlined text-[26px]">notifications_active</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#725b38]">
                  Motor de Lista de Espera Inteligente
                </span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1b1a]">
                ¡Espacio Liberado en Calendario!
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2edea] text-[#4c4640] hover:text-[#1c1b1a] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Freed Slot Snapshot Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#725b38]">Turno Cancelado</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-serif text-lg font-bold text-[#1c1b1a]">{event.time}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#f2edea] text-[10px] text-[#4c4640] font-semibold">
                  {event.dateStr}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#fedeb2] text-[#584323] text-[10px] font-bold uppercase">
                  {event.shift === 'mañana' ? 'Turno Mañana' : 'Turno Tarde'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-serif text-base font-bold text-[#1c1b1a]">${event.price.toFixed(2)}</span>
              <span className="text-[10px] text-green-700 font-bold block">Espacio Disponible</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f2edea] text-xs">
            <div>
              <span className="text-[10px] text-[#4c4640] block">Especialista & Mesa:</span>
              <span className="font-semibold text-[#1c1b1a]">{event.specialistName}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#4c4640] block">Cancelado por:</span>
              <span className="font-semibold text-[#1c1b1a] line-through text-[#7d766f]">
                {event.canceledClientName}
              </span>
            </div>
          </div>
        </div>

        {/* Automated Dispatch Status Banner */}
        {autoNotifyWaitlist ? (
          <div className="bg-[#fedeb2]/40 p-3.5 rounded-2xl border border-[#fedeb2] flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#725b38] text-[20px] shrink-0 mt-0.5">
              bolt
            </span>
            <div className="text-xs text-[#584323] leading-relaxed">
              <span className="font-bold block">
                Notificación Automática Activada por Sistema
              </span>
              El atelier ha identificado a las clientas en lista de espera y enviado la alerta con 15 minutos de reserva prioritaria.
            </div>
          </div>
        ) : (
          <div className="bg-[#f2edea] p-3.5 rounded-2xl border border-[#cec5bd]/40 flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#725b38] text-[20px] shrink-0 mt-0.5">
              tune
            </span>
            <div className="text-xs text-[#4c4640] leading-relaxed">
              <span className="font-bold text-[#1c1b1a] block">
                Modo Notificación Manual
              </span>
              Selecciona a continuación a qué clienta deseas avisar o asignar de inmediato.
            </div>
          </div>
        )}

        {/* Toast Feedback */}
        {notificationToast && (
          <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <span className="material-symbols-outlined text-[16px] text-green-700">check_circle</span>
            <span>{notificationToast}</span>
          </div>
        )}

        {/* Matching Candidate List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#1c1b1a] uppercase tracking-wider">
              Clientas Candidatas ({candidates.length} en espera)
            </span>
            <span className="text-[10px] text-[#725b38] font-bold">Ordenadas por Prioridad</span>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {candidates.map((cand, idx) => {
              const isNotified = cand.status === 'notificada';
              const isVip = cand.priority === 'vip';

              return (
                <div
                  key={cand.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    idx === 0
                      ? 'bg-white border-[#725b38]/50 shadow-xs ring-1 ring-[#fedeb2]'
                      : 'bg-white border-[#cec5bd]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center font-bold text-xs text-[#725b38]">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-xs text-[#1c1b1a]">{cand.clientName}</h4>
                          {isVip && (
                            <span className="px-2 py-0.2 rounded-full bg-[#1e1b18] text-[#fedeb2] text-[9px] font-bold uppercase">
                              VIP
                            </span>
                          )}
                          <span className="text-[10px] text-[#725b38] font-semibold">
                            {cand.clientPhone}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#4c4640] mt-0.5">
                          Busca: <strong>{cand.serviceTitle}</strong> • Turno: {cand.preferredShift}
                        </p>
                      </div>
                    </div>

                    {isNotified && (
                      <span className="px-2 py-0.5 rounded-full bg-[#fedeb2] text-[#584323] text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                        Avisada
                      </span>
                    )}
                  </div>

                  {cand.notes && (
                    <p className="text-[10px] text-[#7d766f] italic mt-1.5 pl-10">"{cand.notes}"</p>
                  )}

                  {/* Actions per candidate */}
                  <div className="flex items-center gap-2 pt-2.5 mt-2 border-t border-[#f2edea] pl-10">
                    <button
                      type="button"
                      onClick={() => handleAssignDirect(cand)}
                      className="px-3.5 py-1.5 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-[11px] font-bold uppercase tracking-wider shadow-xs transition-transform active:scale-95 flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">event_available</span>
                      <span>Asignar Turno Ahora</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleNotifyWhatsApp(cand)}
                      className="px-3 py-1.5 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#1c1b1a] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px] text-green-600">chat</span>
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {candidates.length === 0 && (
              <div className="bg-white rounded-2xl p-6 text-center border border-[#cec5bd]/40 text-xs text-[#4c4640]">
                No hay clientas registradas en lista de espera para este turno específico.
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f2edea]">
          <button
            type="button"
            onClick={onOpenWaitlistView}
            className="text-xs font-bold text-[#725b38] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">list_alt</span>
            <span>Ver Panel Completo de Lista de Espera</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#f2edea] text-[#1c1b1a] hover:bg-[#ece7e4] text-xs font-semibold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
