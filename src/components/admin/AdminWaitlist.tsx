import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { WaitlistEntry } from '../../types';
import { NewWaitlistModal } from '../modals/NewWaitlistModal';

export const AdminWaitlist: React.FC = () => {
  const {
    waitlist,
    removeFromWaitlist,
    updateWaitlistStatus,
    autoNotifyWaitlist,
    setAutoNotifyWaitlist,
    triggerManualSlotFreedDemo,
  } = useStudio();

  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedEntryForDetails, setSelectedEntryForDetails] = useState<WaitlistEntry | null>(null);

  // Compute metrics
  const waitingCount = waitlist.filter((w) => w.status === 'esperando').length;
  const notifiedCount = waitlist.filter((w) => w.status === 'notificada').length;
  const assignedCount = waitlist.filter((w) => w.status === 'asignada').length;

  const filteredWaitlist = waitlist.filter((item) => {
    if (statusFilter === 'esperando' && item.status !== 'esperando') return false;
    if (statusFilter === 'notificada' && item.status !== 'notificada') return false;
    if (statusFilter === 'asignada' && item.status !== 'asignada') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        item.clientName.toLowerCase().includes(q) ||
        item.clientPhone.toLowerCase().includes(q) ||
        item.serviceTitle.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleSendWhatsAppManual = (entry: WaitlistEntry) => {
    const text = `Hola ${entry.clientName}, ¡saludos desde L'Atelier Vernis! ✨ Tenemos novedades respecto a tu solicitud en lista de espera para ${entry.serviceTitle}. Por favor confírmanos si sigues disponible para agendar tu sesión.`;
    const url = `https://wa.me/${entry.clientPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

    window.open(url, '_blank');
    updateWaitlistStatus(entry.id, 'notificada', 'Aviso manual enviado por WhatsApp.');
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header & Quick Action Buttons */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#725b38] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">hourglass_top</span>
            <span>Atelier Smart Reallocation Engine</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a] tracking-tight">
            Lista de Espera & Reasignación Automática
          </h1>
          <p className="text-xs text-[#4c4640] leading-relaxed mt-1">
            Cuando una clienta cancela o reprograma una cita, el sistema detecta de forma instantánea el espacio liberado y notifica por WhatsApp/SMS a las clientas registradas según prioridad.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Demo Simulator Trigger */}
          <button
            type="button"
            onClick={triggerManualSlotFreedDemo}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#fedeb2] hover:bg-[#fcd59f] text-[#584323] text-xs font-bold uppercase tracking-wider shadow-xs transition-transform active:scale-95"
            title="Simula la cancelación de una cita para ver el motor de notificación en vivo"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Simular Cancelación & Alerta</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            <span>+ Añadir a Lista de Espera</span>
          </button>
        </div>
      </section>

      {/* Metrics Bento Strip */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              En Espera Activa
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#725b38]">
              <span className="material-symbols-outlined text-[18px]">group</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-[#1c1b1a]">{waitingCount}</span>
              <span className="text-xs text-[#725b38] font-semibold">clientas</span>
            </div>
            <p className="text-[11px] text-[#4c4640] mt-1">
              {waitlist.filter((w) => w.priority === 'vip').length} con membresía VIP
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Notificadas Hoy
            </span>
            <div className="w-8 h-8 rounded-full bg-[#fedeb2]/60 flex items-center justify-center text-[#725b38]">
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-[#1c1b1a]">{notifiedCount}</span>
              <span className="text-xs text-green-700 font-semibold">alertas enviadas</span>
            </div>
            <p className="text-[11px] text-[#4c4640] mt-1">WhatsApp & SMS integrados</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Reasignadas con Éxito
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#1c1b1a]">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-[#1c1b1a]">{assignedCount}</span>
              <span className="text-xs text-[#725b38] font-semibold">turnos cubiertos</span>
            </div>
            <p className="text-[11px] text-[#4c4640] mt-1">Cero tiempo muerto en cabina</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Tasa de Recuperación
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-green-700">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-[#1c1b1a]">92.4%</span>
              <span className="text-xs text-green-700 font-bold">Excelente</span>
            </div>
            <p className="text-[11px] text-[#4c4640] mt-1">Tiempo medio de respuesta: 14 min</p>
          </div>
        </div>
      </section>

      {/* Automation Configuration Bar */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#fedeb2]/40 text-[#725b38] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">smart_toy</span>
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-[#1c1b1a]">
              Disparo Automático de Alertas al Cancelar
            </h3>
            <p className="text-xs text-[#4c4640] mt-0.5">
              Cuando se cancela una cita, enviar WhatsApp inmediato a la primera clienta en cola con 15 minutos de reserva prioritaria.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-bold text-[#1c1b1a]">
            {autoNotifyWaitlist ? 'Automático Activo' : 'Manual'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoNotifyWaitlist}
              onChange={(e) => setAutoNotifyWaitlist(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#e6e2df] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#725b38] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-[#f8f3f0] rounded-full border border-[#cec5bd]/30 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setStatusFilter('todas')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'todas'
                ? 'bg-white text-[#1c1b1a] shadow-xs'
                : 'text-[#4c4640] hover:text-[#1c1b1a]'
            }`}
          >
            Todas ({waitlist.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('esperando')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'esperando'
                ? 'bg-white text-[#1c1b1a] shadow-xs'
                : 'text-[#4c4640] hover:text-[#1c1b1a]'
            }`}
          >
            En Espera ({waitingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('notificada')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'notificada'
                ? 'bg-white text-[#1c1b1a] shadow-xs'
                : 'text-[#4c4640] hover:text-[#1c1b1a]'
            }`}
          >
            Notificadas ({notifiedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('asignada')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'asignada'
                ? 'bg-white text-[#1c1b1a] shadow-xs'
                : 'text-[#4c4640] hover:text-[#1c1b1a]'
            }`}
          >
            Asignadas ({assignedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7d766f] text-[18px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por clienta, teléfono o servicio..."
            className="w-full h-9 pl-9 pr-3 bg-[#f8f3f0] border border-[#cec5bd]/40 rounded-full text-xs text-[#1c1b1a] placeholder:text-[#7d766f] outline-none focus:bg-white focus:ring-1 focus:ring-[#725b38]"
          />
        </div>
      </section>

      {/* Waitlist Table */}
      <section className="bg-white rounded-2xl border border-[#cec5bd]/40 shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#f8f3f0] text-[#4c4640] text-[10px] font-bold uppercase tracking-wider border-b border-[#cec5bd]/30">
                <th className="py-3 px-4">Prioridad & Clienta</th>
                <th className="py-3 px-4">Servicio Solicitado</th>
                <th className="py-3 px-4">Turno Preferido</th>
                <th className="py-3 px-4">Especialista</th>
                <th className="py-3 px-4">Registrada</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2edea] text-xs">
              {filteredWaitlist.map((item) => {
                const isVip = item.priority === 'vip';
                const isAlta = item.priority === 'alta';
                const isEsperando = item.status === 'esperando';
                const isNotificada = item.status === 'notificada';
                const isAsignada = item.status === 'asignada';

                return (
                  <tr key={item.id} className="hover:bg-[#f8f3f0]/70 transition-colors">
                    {/* Priority & Client */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                            isVip
                              ? 'bg-[#1e1b18] text-[#fedeb2]'
                              : isAlta
                              ? 'bg-[#fedeb2] text-[#584323]'
                              : 'bg-[#f2edea] text-[#4c4640]'
                          }`}
                        >
                          {item.priority}
                        </span>
                        <div>
                          <span className="font-semibold text-[#1c1b1a] block">{item.clientName}</span>
                          <a
                            href={`https://wa.me/${item.clientPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#4c4640] hover:text-[#725b38] flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[13px] text-[#725b38]">
                              chat
                            </span>
                            <span>{item.clientPhone}</span>
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Desired Service */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="font-medium text-[#1c1b1a] block">{item.serviceTitle}</span>
                      {item.targetTimeSlot && (
                        <span className="text-[10px] text-[#725b38] font-bold">
                          Slot preferido: {item.targetTimeSlot}
                        </span>
                      )}
                    </td>

                    {/* Preferred Shift */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="capitalize font-medium text-[#1c1b1a]">
                        {item.preferredShift === 'cualquiera' ? 'Cualquier horario' : `Turno ${item.preferredShift}`}
                      </span>
                      <span className="text-[10px] text-[#4c4640] block">{item.preferredDateStr}</span>
                    </td>

                    {/* Specialist */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="text-[#1c1b1a] font-medium">
                        {item.preferredSpecialistName || 'Cualquier manicurista'}
                      </span>
                    </td>

                    {/* Registration Time */}
                    <td className="py-3.5 px-4 align-middle text-[#4c4640]">
                      <span>{item.createdAt}</span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      {isEsperando && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f2edea] text-[#1c1b1a] text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#725b38]"></span>
                          <span>Esperando</span>
                        </span>
                      )}
                      {isNotificada && (
                        <div className="inline-flex flex-col items-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fedeb2] text-[#584323] text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
                            <span>Notificada</span>
                          </span>
                          <span className="text-[9px] text-[#725b38] mt-0.5">
                            {item.notifiedAt || 'Hoy'}
                          </span>
                        </div>
                      )}
                      {isAsignada && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[13px]">check</span>
                          <span>Asignada</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-middle text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSendWhatsAppManual(item)}
                          className="px-3 py-1 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#1c1b1a] text-[11px] font-semibold flex items-center gap-1 transition-colors"
                          title="Enviar aviso por WhatsApp"
                        >
                          <span className="material-symbols-outlined text-[14px] text-green-600">chat</span>
                          <span>Avisar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedEntryForDetails(item)}
                          className="p-1.5 rounded-full hover:bg-[#f2edea] text-[#4c4640] hover:text-[#1c1b1a] transition-colors"
                          title="Ver detalles de solicitud"
                        >
                          <span className="material-symbols-outlined text-[16px]">info</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromWaitlist(item.id)}
                          className="p-1.5 rounded-full hover:bg-red-50 text-[#7d766f] hover:text-red-700 transition-colors"
                          title="Eliminar de la lista de espera"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredWaitlist.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#4c4640] text-xs">
                    No hay solicitudes registradas con los filtros seleccionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedEntryForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fdf8f5] w-full max-w-md rounded-2xl p-5 shadow-2xl border border-[#cec5bd]/50 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
              <h3 className="font-serif text-base font-bold text-[#1c1b1a]">Detalle de Solicitud</h3>
              <button
                type="button"
                onClick={() => setSelectedEntryForDetails(null)}
                className="w-7 h-7 rounded-full bg-[#f2edea] text-[#4c4640] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-white p-3 rounded-xl border border-[#cec5bd]/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#725b38]">Clienta</span>
                <p className="font-bold text-[#1c1b1a]">{selectedEntryForDetails.clientName}</p>
                <p className="text-[#4c4640]">{selectedEntryForDetails.clientPhone}</p>
                <span className="px-2 py-0.5 rounded-full bg-[#fedeb2] text-[#584323] text-[9px] uppercase font-bold inline-block mt-1">
                  Prioridad {selectedEntryForDetails.priority}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#cec5bd]/40 space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#725b38]">Solicitud</span>
                <p className="font-semibold text-[#1c1b1a]">{selectedEntryForDetails.serviceTitle}</p>
                <p className="text-[#4c4640]">
                  Turno {selectedEntryForDetails.preferredShift} ({selectedEntryForDetails.preferredDateStr})
                </p>
                {selectedEntryForDetails.notes && (
                  <p className="text-[#7d766f] italic pt-1 border-t border-[#f2edea]">
                    "{selectedEntryForDetails.notes}"
                  </p>
                )}
              </div>

              {selectedEntryForDetails.notificationMessage && (
                <div className="bg-[#f8f3f0] p-3 rounded-xl border border-[#cec5bd]/40 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-green-700">
                    Último Mensaje Enviado
                  </span>
                  <p className="text-[#1c1b1a] leading-relaxed">
                    {selectedEntryForDetails.notificationMessage}
                  </p>
                  <span className="text-[10px] text-[#7d766f]">
                    Enviado: {selectedEntryForDetails.notifiedAt}
                  </span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedEntryForDetails(null)}
              className="w-full py-2 rounded-full bg-[#1e1b18] text-white text-xs font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* New Waitlist Entry Modal */}
      {showAddModal && <NewWaitlistModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
