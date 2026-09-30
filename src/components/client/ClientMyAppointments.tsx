import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Appointment } from '../../types';
import { ClientFormulaModal } from '../modals/ClientFormulaModal';
import { AddReviewModal } from '../modals/AddReviewModal';
import { ClientReviewsShowcase } from './ClientReviewsShowcase';

export const ClientMyAppointments: React.FC = () => {
  const { appointments, setClientTab, clientNotificationPreferences, loyaltyProfile, currentClient } = useStudio();
  const [selectedFormulaApt, setSelectedFormulaApt] = useState<Appointment | null>(null);
  const [reviewingAppointment, setReviewingAppointment] = useState<Appointment | null>(null);
  const [isGeneralReviewOpen, setIsGeneralReviewOpen] = useState(false);
  const [reviewToast, setReviewToast] = useState<string | null>(null);

  // Client visible appointments (filter out system technical blocks and match current client)
  const clientAppointments = appointments.filter((a) => {
    if (a.shift === 'bloqueo') return false;
    if (currentClient) {
      // Match by phone since it's the unique identifier used at login
      return a.clientPhone === currentClient.phone || a.clientName.toLowerCase() === currentClient.name.toLowerCase();
    }
    return true; // fallback for preview modes if no client
  });

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 max-w-md md:max-w-2xl mx-auto space-y-5 pb-28 pt-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#725b38] font-bold">
            Portal Personal
          </span>
          <h1 className="font-serif text-2xl font-bold text-[#1c1b1a]">Mis Citas & Reservas</h1>
        </div>
        <button
          type="button"
          onClick={() => setClientTab('agendar')}
          className="px-3.5 py-1.5 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Nueva Cita</span>
        </button>
      </div>

      {/* Notification Preferences Banner Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#fedeb2]/40 text-[#725b38] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1c1b1a]">Recordatorios de Citas</span>
              <span className="text-[10px] text-[#725b38] font-semibold uppercase tracking-wider bg-[#f8f3f0] px-2 py-0.5 rounded-full">
                Canales
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#4c4640]">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                  clientNotificationPreferences.whatsapp
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-400 line-through'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                WhatsApp
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                  clientNotificationPreferences.sms
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-gray-100 text-gray-400 line-through'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                SMS
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
                  clientNotificationPreferences.email
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-400 line-through'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Correo
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setClientTab('notificaciones')}
          className="self-start sm:self-center px-3 py-1.5 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#1c1b1a] text-xs font-bold transition-colors flex items-center gap-1 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px] text-[#725b38]">tune</span>
          <span>Configurar Canales</span>
        </button>
      </div>

      {/* Club Vernis Privilège Loyalty Points Card */}
      <div className="bg-gradient-to-r from-[#1e1b18] via-[#2a2522] to-[#1e1b18] text-white rounded-2xl p-4 sm:p-4.5 border border-[#fedeb2]/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-radial from-[#fedeb2]/10 to-transparent pointer-events-none"></div>

        <div className="flex items-start gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fedeb2]/30 to-[#725b38]/40 border border-[#fedeb2]/40 text-[#fedeb2] flex items-center justify-center shrink-0 shadow-inner">
            <span className="material-symbols-outlined text-[22px]">stars</span>
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-serif text-sm font-bold text-white">Club Vernis Privilège</span>
              <span className="px-2 py-0.5 rounded-full bg-[#fedeb2]/20 border border-[#fedeb2]/40 text-[#fedeb2] text-[9px] font-bold uppercase tracking-wider">
                {loyaltyProfile.tier === 'privilege' ? 'Atelier Privilège' : loyaltyProfile.tier === 'elegance' ? 'VIP Élégance' : 'Membre'}
              </span>
            </div>
            <p className="text-xs text-white/80">
              Tienes <strong className="text-[#fedeb2] font-mono text-sm font-bold">{loyaltyProfile.pointsBalance.toLocaleString()} pts</strong> acumulados (~$40 MXN de descuento disponibles).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setClientTab('puntos')}
          className="self-start sm:self-center px-4 py-2 rounded-full bg-[#fedeb2] hover:bg-amber-200 text-[#1e1b18] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shrink-0 shadow-sm relative z-10"
        >
          <span className="material-symbols-outlined text-[16px]">redeem</span>
          <span>Canjear Descuentos</span>
        </button>
      </div>

      {/* Appointment Cards List */}
      <div className="space-y-4">
        {clientAppointments.map((apt) => {
          const isEnProceso = apt.status === 'en_proceso';
          const isConfirmada = apt.status === 'confirmada';
          const isPendiente = apt.status === 'pendiente';

          return (
            <article
              key={apt.id}
              className="bg-white rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs flex flex-col space-y-3 relative overflow-hidden"
            >
              {/* Status color indicator stripe */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  isConfirmada
                    ? 'bg-[#725b38]'
                    : isEnProceso
                    ? 'bg-[#fedeb2]'
                    : 'bg-[#cec5bd]'
                }`}
              ></div>

              <div className="flex items-start justify-between pl-1">
                <div className="flex items-center gap-2.5">
                  <div className="flex flex-col items-center justify-center bg-[#f2edea] px-3 py-1.5 rounded-xl">
                    <span className="text-xs font-bold text-[#1c1b1a]">{apt.time}</span>
                    <span className="text-[10px] text-[#4c4640] uppercase font-semibold">
                      {apt.shift === 'mañana' ? 'Mañana' : 'Tarde'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#1c1b1a]">{apt.serviceTitle}</h3>
                    <p className="text-xs text-[#4c4640]">{apt.dateStr} • ${apt.price.toFixed(2)} MXN</p>
                  </div>
                </div>

                {/* Status Badges */}
                {isConfirmada && (
                  <span className="px-2.5 py-1 rounded-full bg-[#f2edea] text-[#1c1b1a] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#725b38]"></span>
                    Confirmada
                  </span>
                )}
                {isEnProceso && (
                  <span className="px-2.5 py-1 rounded-full bg-[#fedeb2] text-[#584323] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#725b38] animate-ping"></span>
                    En Cabina ({apt.currentMinuteProgress || 40}m)
                  </span>
                )}
                {isPendiente && (
                  <span className="px-2.5 py-1 rounded-full bg-[#f2edea] text-[#725b38] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">hourglass_top</span>
                    Pendiente
                  </span>
                )}
              </div>

              {/* Specialist & Table assigned */}
              <div className="bg-[#f8f3f0] p-2.5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#725b38]">spa</span>
                  <div>
                    <span className="text-[#4c4640] block text-[10px]">Especialista:</span>
                    <span className="font-semibold text-[#1c1b1a]">{apt.specialistName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[#4c4640] block text-[10px]">Ubicación:</span>
                  <span className="font-semibold text-[#1c1b1a]">{apt.station}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f2edea]">
                <button
                  type="button"
                  onClick={() => setReviewingAppointment(apt)}
                  className="py-2 px-3 rounded-full bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-[#584323] border border-amber-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
                  title="Califica tu experiencia y sube fotos del resultado para ganar 100 puntos"
                >
                  <span className="material-symbols-outlined text-[16px] text-amber-600">rate_review</span>
                  <span>Calificar & Subir Fotos (+100 pts)</span>
                </button>

                <a
                  href={`https://wa.me/34612345678?text=${encodeURIComponent(
                    `Hola L'Atelier Vernis, tengo una consulta sobre mi cita de ${apt.serviceTitle} el ${apt.dateStr}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#1c1b1a] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-[#725b38]">chat</span>
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedFormulaApt(apt)}
                  className="py-2 px-3.5 rounded-full bg-[#1e1b18] text-white text-xs font-semibold hover:bg-[#32302e] transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">assignment</span>
                  <span>Ficha</span>
                </button>
              </div>
            </article>
          );
        })}

        {clientAppointments.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-[#cec5bd]/40 space-y-3">
            <span className="material-symbols-outlined text-[36px] text-[#725b38]">calendar_add_on</span>
            <h3 className="font-serif text-lg font-bold text-[#1c1b1a]">No tienes citas pendientes</h3>
            <p className="text-xs text-[#4c4640]">
              Elige tu diseño favorito en el catálogo y reserva tu próxima sesión de alta estética.
            </p>
            <button
              type="button"
              onClick={() => setClientTab('agendar')}
              className="px-5 py-2.5 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider"
            >
              Agendar Cita Ahora
            </button>
          </div>
        )}
      </div>

      {/* Post-Service Reviews & Manicure Photos Showcase */}
      <div className="pt-4">
        <ClientReviewsShowcase />
      </div>

      {/* Modal Ficha Técnica */}
      {selectedFormulaApt && (
        <ClientFormulaModal
          appointment={selectedFormulaApt}
          onClose={() => setSelectedFormulaApt(null)}
        />
      )}

      {/* Modal Calificar Cita Específica */}
      {reviewingAppointment && (
        <AddReviewModal
          appointment={reviewingAppointment}
          onClose={() => setReviewingAppointment(null)}
          onSuccess={() => {
            setReviewingAppointment(null);
            setReviewToast('¡Reseña y fotos enviadas con éxito! Has recibido +100 Puntos Vernis Privilège. Tu opinión entrará a moderación en breve.');
            setTimeout(() => setReviewToast(null), 5000);
          }}
        />
      )}

      {/* Toast feedback */}
      {reviewToast && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto z-50 bg-[#1e1b18] text-white p-3.5 rounded-2xl shadow-2xl border border-[#fedeb2]/40 flex items-center gap-3 animate-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-amber-400 text-[22px] shrink-0">verified</span>
          <span className="text-xs font-medium leading-tight">{reviewToast}</span>
        </div>
      )}
    </div>
  );
};
