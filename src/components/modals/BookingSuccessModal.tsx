import React from 'react';
import { Appointment } from '../../types';
import { useStudio } from '../../context/StudioContext';

interface BookingSuccessModalProps {
  appointment: Appointment;
  onClose: () => void;
  onViewAgenda: () => void;
}

export const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({
  appointment,
  onClose,
  onViewAgenda,
}) => {
  const { clientNotificationPreferences, setClientTab } = useStudio();
  const whatsappUrl = `https://wa.me/34612345678?text=${encodeURIComponent(
    `Hola L'Atelier Vernis, he reservado mi cita para ${appointment.serviceTitle} el ${appointment.dateStr} a las ${appointment.time} a nombre de ${appointment.clientName}.`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#fdf8f5] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#cec5bd]/50 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#fedeb2] text-[#725b38] flex items-center justify-center mb-2 shadow-inner">
            <span className="material-symbols-outlined text-[32px] fill">check_circle</span>
          </div>
          <span className="text-[11px] uppercase tracking-widest text-[#725b38] font-bold">
            Reserva Confirmada
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1c1b1a] mt-1">
            ¡Te Esperamos en el Atelier!
          </h2>
          <p className="text-xs text-[#4c4640] mt-1">
            Hemos registrado tu cita en el cronograma oficial del salón.
          </p>
        </div>

        {/* Ticket Details Card */}
        <div className="bg-white rounded-xl p-4 border border-[#cec5bd]/40 shadow-xs space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#725b38] via-[#fedeb2] to-[#725b38]"></div>

          <div className="flex items-start justify-between gap-2 pt-1">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#725b38]">Tratamiento</span>
              <h3 className="font-serif text-base font-bold text-[#1c1b1a]">{appointment.serviceTitle}</h3>
              <p className="text-xs text-[#4c4640]">{appointment.toneName}</p>
            </div>
            <div className="text-right">
              <span className="text-base font-bold text-[#1c1b1a]">${appointment.price.toFixed(2)}</span>
              <p className="text-[10px] text-green-700 font-semibold">Reserva Activa</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f2edea] text-xs">
            <div>
              <span className="text-[10px] text-[#4c4640] uppercase block">Fecha & Horario</span>
              <span className="font-semibold text-[#1c1b1a]">{appointment.dateStr}, {appointment.time}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#4c4640] uppercase block">Especialista</span>
              <span className="font-semibold text-[#1c1b1a]">{appointment.specialistName}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#f2edea] text-xs">
            <span className="text-[10px] text-[#4c4640] uppercase block">Clienta</span>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#1c1b1a]">{appointment.clientName}</span>
              <span className="text-[#4c4640]">{appointment.clientPhone}</span>
            </div>
          </div>

          {/* Points Program Information */}
          <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[18px]">stars</span>
              <div>
                <span className="font-bold text-[#1c1b1a] block">Club Vernis Privilège</span>
                {appointment.pointsDiscountMXN && appointment.pointsDiscountMXN > 0 ? (
                  <span className="text-[10px] text-green-700 font-semibold">
                    Descuento: -${appointment.pointsDiscountMXN} MXN ({appointment.pointsRedeemed} pts canjeados)
                  </span>
                ) : (
                  <span className="text-[10px] text-[#725b38]">
                    Puntos acumulados con esta cita: +{appointment.pointsEarned || 550} pts
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setClientTab('puntos');
              }}
              className="text-[10px] uppercase font-bold text-[#725b38] hover:underline"
            >
              Ver Puntos
            </button>
          </div>

          <div className="bg-[#f8f3f0] p-2.5 rounded-lg flex items-center justify-between text-xs">
            <span className="text-[#725b38] font-bold">Código de Cita:</span>
            <span className="font-mono font-bold tracking-widest text-[#1c1b1a]">LAV-{appointment.id.slice(-6).toUpperCase()}</span>
          </div>
        </div>

        {/* Reminder Channels Note */}
        <div className="bg-[#fedeb2]/30 p-3 rounded-xl border border-[#fedeb2] space-y-2">
          <div className="flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[#725b38] text-[20px] shrink-0 mt-0.5">verified</span>
            <div className="space-y-1">
              <p className="text-xs text-[#584323] leading-relaxed">
                Tus avisos y recordatorios (24h y 2h antes) se despacharán a través de:
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {clientNotificationPreferences.whatsapp && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-green-700 text-[10px] font-bold border border-green-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    WhatsApp ({appointment.clientPhone})
                  </span>
                )}
                {clientNotificationPreferences.sms && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-amber-800 text-[10px] font-bold border border-amber-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    SMS
                  </span>
                )}
                {clientNotificationPreferences.email && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-blue-700 text-[10px] font-bold border border-blue-200 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Correo
                  </span>
                )}
                {!clientNotificationPreferences.whatsapp && !clientNotificationPreferences.sms && !clientNotificationPreferences.email && (
                  <span className="text-[10px] text-[#7d766f]">Ningún canal seleccionado actualmente</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-1 border-t border-[#fedeb2]/60 flex items-center justify-between text-[11px]">
            <span className="text-[#584323]">¿Deseas cambiar de canal?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                setClientTab('notificaciones');
              }}
              className="text-[#725b38] font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">notifications</span>
              <span>Ajustar Canales</span>
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-1">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-full bg-[#25D366] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm hover:opacity-95 transition-opacity"
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
            <span>Confirmar por WhatsApp</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onViewAgenda}
              className="h-10 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#32302e] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">calendar_month</span>
              <span>Ver en Agenda</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-full bg-[#f2edea] text-[#1c1b1a] text-xs font-bold uppercase tracking-wider flex items-center justify-center hover:bg-[#ece7e4] transition-colors"
            >
              <span>Aceptar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
