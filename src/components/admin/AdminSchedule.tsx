import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Appointment } from '../../types';
import { NewAppointmentModal } from '../modals/NewAppointmentModal';
import { ClientFormulaModal } from '../modals/ClientFormulaModal';
import { FreedSlotModal } from '../modals/FreedSlotModal';

export const AdminSchedule: React.FC = () => {
  const {
    appointments,
    approveAppointment,
    rejectAppointment,
    cancelAppointment,
    unblockSlot,
    setAdminTab,
    waitlist,
    freedSlotAlert,
    setFreedSlotAlert,
    triggerManualSlotFreedDemo,
  } = useStudio();

  // Internal tab switch (Citas Programadas vs Configuración de Salón)
  const [internalTab, setInternalTab] = useState<'citas' | 'configuracion'>('citas');
  const [statusFilter, setStatusFilter] = useState<string>('todas');
  const [specialistFilter, setSpecialistFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'tabla' | 'semanal' | 'cabinas'>('tabla');

  // Modals
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [selectedFormulaApt, setSelectedFormulaApt] = useState<Appointment | null>(null);

  // Compute live occupancy metrics
  const totalToday = appointments.filter((a) => a.shift !== 'bloqueo').length;
  const pendingCount = appointments.filter((a) => a.status === 'pendiente').length;
  const confirmedCount = appointments.filter((a) => a.status === 'confirmada').length;
  const inProgressCount = appointments.filter((a) => a.status === 'en_proceso').length;
  const blockedCount = appointments.filter((a) => a.status === 'bloqueado').length;

  const estimatedRevenue = appointments
    .filter((a) => a.status === 'confirmada' || a.status === 'en_proceso')
    .reduce((acc, curr) => acc + curr.price, 0);

  const collectedDeposits = appointments
    .filter((a) => a.status === 'confirmada' || a.status === 'en_proceso')
    .reduce((acc, curr) => acc + (curr.depositPaid || 0), 0);

  // Filtering
  const filteredAppointments = appointments.filter((apt) => {
    // Status
    if (statusFilter === 'confirmadas' && apt.status !== 'confirmada') return false;
    if (statusFilter === 'en_proceso' && apt.status !== 'en_proceso') return false;
    if (statusFilter === 'pendientes' && apt.status !== 'pendiente') return false;
    if (statusFilter === 'bloqueos' && apt.status !== 'bloqueado') return false;

    // Specialist
    if (specialistFilter !== 'all' && apt.specialistId !== specialistFilter && apt.shift !== 'bloqueo') {
      return false;
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        apt.clientName.toLowerCase().includes(q) ||
        apt.clientPhone.toLowerCase().includes(q) ||
        apt.serviceTitle.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Sub-header Internal Tab & Fast Actions Suite */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#4c4640] text-xs uppercase tracking-wider font-bold">
            <span className="w-2 h-2 rounded-full bg-[#725b38]"></span>
            <span>Atelier Console • Salón Central</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a] tracking-tight">
            Agenda & Citas Programadas
          </h1>
          <p className="text-xs text-[#4c4640] flex items-center gap-1.5 mt-0.5">
            <span className="material-symbols-outlined text-[16px] text-[#725b38]">calendar_month</span>
            <span className="font-semibold text-[#1c1b1a]">Martes, 19 de Noviembre 2024</span>
            <span className="text-[#cec5bd]">•</span>
            <span>Semana 47 • Modo Operativo en Vivo</span>
          </p>
        </div>

        {/* View Switcher & Fast Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Segmented View Switcher */}
          <div className="inline-flex p-1 bg-[#f2edea] rounded-full border border-[#cec5bd]/40">
            <button
              type="button"
              onClick={() => setViewMode('tabla')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'tabla' ? 'bg-white text-[#1c1b1a] shadow-xs' : 'text-[#4c4640]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_agenda</span>
              <span>Vista Tabla</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('semanal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'semanal' ? 'bg-white text-[#1c1b1a] shadow-xs' : 'text-[#4c4640]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">calendar_view_week</span>
              <span>Semanal</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cabinas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'cabinas' ? 'bg-white text-[#1c1b1a] shadow-xs' : 'text-[#4c4640]'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">meeting_room</span>
              <span>Cabinas</span>
            </button>
          </div>

          {/* Waitlist shortcut pill */}
          <button
            type="button"
            onClick={() => setAdminTab('waitlist')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#fedeb2]/50 hover:bg-[#fedeb2] text-[#584323] text-xs font-bold uppercase tracking-wider border border-[#fedeb2] shadow-xs transition-colors"
            title="Ver panel de lista de espera"
          >
            <span className="material-symbols-outlined text-[16px] text-[#725b38]">hourglass_top</span>
            <span>Espera ({waitlist.filter((w) => w.status === 'esperando').length})</span>
          </button>

          {/* Quick Demo Simulator */}
          <button
            type="button"
            onClick={triggerManualSlotFreedDemo}
            className="flex items-center gap-1 px-3 py-2 rounded-full bg-white hover:bg-[#f2edea] text-[#725b38] text-xs font-bold uppercase tracking-wider border border-[#cec5bd]/40 shadow-xs transition-all active:scale-95"
            title="Probar notificación automática al liberar un espacio"
          >
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Simular Hueco</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('horarios')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#f2edea] text-[#1c1b1a] text-xs font-bold uppercase tracking-wider border border-[#cec5bd]/40 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#725b38]">lock_clock</span>
            <span>Bloqueo</span>
          </button>

          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>+ Nueva Cita</span>
          </button>
        </div>
      </section>

      {/* Occupancy Metrics Strip */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider block">
                Ocupación Diaria
              </span>
              <span className="font-serif text-2xl font-bold text-[#1c1b1a] mt-1 block">
                {totalToday} Citas
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#1c1b1a]">
              <span className="material-symbols-outlined text-[20px]">event_available</span>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex items-center justify-between text-[11px] text-[#4c4640]">
              <span>Capacidad General</span>
              <span className="font-bold text-[#1c1b1a]">88%</span>
            </div>
            <div className="w-full bg-[#f2edea] h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-[#725b38] h-full rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider block">
                Solicitudes Web
              </span>
              <span className="font-serif text-2xl font-bold text-[#725b38] mt-1 block">
                {pendingCount} Pendientes
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#fedeb2]/60 flex items-center justify-center text-[#725b38]">
              <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
            </div>
          </div>
          <div className="pt-2 flex items-center gap-1.5 text-[11px] text-[#4c4640]">
            <span className="w-2 h-2 rounded-full bg-[#725b38] animate-pulse"></span>
            <span>Requiere confirmación</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider block">
                Facturación Estimada
              </span>
              <span className="font-serif text-2xl font-bold text-[#1c1b1a] mt-1 block">
                ${estimatedRevenue.toFixed(2)}{' '}
                <span className="text-[11px] font-sans font-normal text-[#4c4640]">USD</span>
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#1c1b1a]">
              <span className="material-symbols-outlined text-[20px]">payments</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-[#4c4640]">
            <span className="text-[#725b38] font-bold">${collectedDeposits.toFixed(2)}</span> en señas recaudadas
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider block">
                Equipo en Turno
              </span>
              <span className="font-serif text-2xl font-bold text-[#1c1b1a] mt-1 block">
                3 Activas
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#1c1b1a]">
              <span className="material-symbols-outlined text-[20px]">diversity_1</span>
            </div>
          </div>
          <div className="pt-2 text-[11px] text-[#4c4640] truncate">
            Valeria M., Camila R., Sofía L.
          </div>
        </div>
      </section>

      {/* Main Table Container */}
      <section className="bg-white rounded-2xl border border-[#cec5bd]/40 shadow-xs overflow-hidden flex flex-col">
        {/* Filters Toolbar */}
        <div className="p-4 bg-[#f8f3f0] border-b border-[#cec5bd]/40 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            <button
              type="button"
              onClick={() => setStatusFilter('todas')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                statusFilter === 'todas'
                  ? 'bg-[#1e1b18] text-white shadow-xs'
                  : 'bg-white text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Todas ({appointments.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('confirmadas')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                statusFilter === 'confirmadas'
                  ? 'bg-[#1e1b18] text-white shadow-xs'
                  : 'bg-white text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Confirmadas ({confirmedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('en_proceso')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                statusFilter === 'en_proceso'
                  ? 'bg-[#1e1b18] text-white shadow-xs'
                  : 'bg-white text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              En Cabina ({inProgressCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pendientes')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                statusFilter === 'pendientes'
                  ? 'bg-[#1e1b18] text-white shadow-xs'
                  : 'bg-white text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('bloqueos')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 transition-colors ${
                statusFilter === 'bloqueos'
                  ? 'bg-[#1e1b18] text-white shadow-xs'
                  : 'bg-white text-[#4c4640] hover:text-[#1c1b1a]'
              }`}
            >
              Bloqueos ({blockedCount})
            </button>
          </div>

          {/* Specialist Select & Search Bar */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            <div className="relative min-w-[190px]">
              <select
                value={specialistFilter}
                onChange={(e) => setSpecialistFilter(e.target.value)}
                className="w-full h-9 pl-3 pr-8 bg-white border border-[#cec5bd]/50 text-xs text-[#1c1b1a] font-medium rounded-full appearance-none outline-none cursor-pointer focus:ring-1 focus:ring-[#725b38]"
              >
                <option value="all">Todas las Especialistas</option>
                <option value="valeria">Valeria M. (Mesa 01)</option>
                <option value="camila">Camila R. (Mesa 03)</option>
                <option value="sofia">Sofía L. (Mesa 02)</option>
              </select>
              <span className="material-symbols-outlined text-[18px] text-[#7d766f] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>

            <div className="relative w-full sm:w-56">
              <span className="material-symbols-outlined text-[18px] text-[#7d766f] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por clienta o teléfono..."
                className="w-full h-9 pl-9 pr-3 bg-white border border-[#cec5bd]/50 text-xs text-[#1c1b1a] placeholder:text-[#7d766f] rounded-full outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table of Appointments */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-[#f2edea]/80 text-[#4c4640] text-[10px] font-bold uppercase tracking-wider border-b border-[#cec5bd]/30">
                <th className="py-3 px-4">Hora & Turno</th>
                <th className="py-3 px-4">Clienta</th>
                <th className="py-3 px-4">Servicio & Tono</th>
                <th className="py-3 px-4">Especialista / Mesa</th>
                <th className="py-3 px-4">Tarifa / Cobro</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right">Acciones Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2edea] text-xs">
              {filteredAppointments.map((apt) => {
                if (apt.shift === 'bloqueo') {
                  return (
                    <tr key={apt.id} className="bg-[#f2edea]/40 hover:bg-[#f2edea]/70 transition-colors">
                      <td className="py-3.5 px-4 align-middle">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#1c1b1a]">{apt.time}</span>
                          <span className="text-[10px] text-[#4c4640]">{apt.durationText}</span>
                          <span className="text-[9px] text-[#7d766f] uppercase font-bold mt-0.5">
                            Pausa Programada
                          </span>
                        </div>
                      </td>
                      <td colSpan={3} className="py-3.5 px-4 align-middle">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#e6e2df] flex items-center justify-center text-[#4c4640]">
                            <span className="material-symbols-outlined text-[18px]">restaurant</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-[#1c1b1a]">{apt.clientName}</span>
                              <span className="px-2 py-0.5 rounded-full bg-[#e6e2df] text-[9px] uppercase font-bold text-[#4c4640]">
                                Bloqueo Técnico
                              </span>
                            </div>
                            <span className="text-[11px] text-[#4c4640] block">{apt.blockReason}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle text-[#7d766f]">—</td>
                      <td className="py-3.5 px-4 align-middle text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#e6e2df] text-[#4c4640] text-[10px] font-semibold">
                          <span className="material-symbols-outlined text-[13px]">lock</span>
                          <span>Bloqueado</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 align-middle text-right">
                        <button
                          type="button"
                          onClick={() => unblockSlot(apt.id)}
                          className="px-3 py-1 rounded-full bg-white hover:bg-[#e6e2df] border border-[#cec5bd]/40 text-[#1c1b1a] text-[11px] font-semibold transition-colors"
                        >
                          Desbloquear
                        </button>
                      </td>
                    </tr>
                  );
                }

                const isEnProceso = apt.status === 'en_proceso';
                const isConfirmada = apt.status === 'confirmada';
                const isPendiente = apt.status === 'pendiente';

                return (
                  <tr
                    key={apt.id}
                    className={`hover:bg-[#f8f3f0] transition-colors ${
                      isEnProceso ? 'bg-[#fedeb2]/15' : isPendiente ? 'bg-[#fedeb2]/10' : ''
                    }`}
                  >
                    {/* Time & Shift */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-serif text-sm font-bold text-[#1c1b1a]">{apt.time}</span>
                        <span className="text-[10px] text-[#4c4640] flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          <span>{apt.durationText}</span>
                        </span>
                        <span className="text-[9px] text-[#725b38] uppercase font-bold mt-0.5">
                          {apt.shiftLabel}
                        </span>
                      </div>
                    </td>

                    {/* Client */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-2.5">
                        <div className="relative">
                          {apt.clientAvatar ? (
                            <img
                              src={apt.clientAvatar}
                              alt={apt.clientName}
                              className="w-9 h-9 rounded-full object-cover border border-[#cec5bd]/40"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-[#f2edea] flex items-center justify-center text-xs font-bold text-[#725b38]">
                              {apt.clientName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                            </div>
                          )}
                          {apt.isVip && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#725b38] rounded-full flex items-center justify-center text-[8px] text-white">
                              ★
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-[#1c1b1a]">{apt.clientName}</span>
                            {apt.isVip && (
                              <span className="px-1.5 py-0.2 rounded-full bg-[#1e1b18] text-[#fedeb2] text-[8px] font-bold uppercase tracking-wider">
                                VIP
                              </span>
                            )}
                            {apt.isFirstVisit && (
                              <span className="px-1.5 py-0.2 rounded-full bg-[#f2edea] text-[#4c4640] text-[8px] font-semibold">
                                1ª Visita
                              </span>
                            )}
                          </div>
                          <a
                            href={`https://wa.me/${apt.clientPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#4c4640] hover:text-[#725b38] flex items-center gap-1 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[13px] text-[#725b38]">chat</span>
                            <span>{apt.clientPhone}</span>
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Service & Tone */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-inner"
                          style={{ backgroundColor: apt.toneHex }}
                        ></div>
                        <div className="flex flex-col">
                          <span className="font-medium text-[#1c1b1a]">{apt.serviceTitle}</span>
                          <span className="text-[10px] text-[#4c4640]">{apt.toneName}</span>
                        </div>
                      </div>
                    </td>

                    {/* Specialist */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex flex-col">
                        <span className={`font-medium ${apt.specialistId === 'sin_asignar' ? 'italic text-[#725b38]' : 'text-[#1c1b1a]'}`}>
                          {apt.specialistName}
                        </span>
                        <span className="text-[10px] text-[#4c4640]">{apt.station}</span>
                      </div>
                    </td>

                    {/* Price & Deposit */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1c1b1a]">${apt.price.toFixed(2)}</span>
                        {apt.depositPaid ? (
                          <span className="text-[10px] text-[#725b38] font-semibold">
                            Seña: ${apt.depositPaid.toFixed(2)} (50%)
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#4c4640]">Pago en Salón</span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      {isConfirmada && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f2edea] text-[#1c1b1a] text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#725b38]"></span>
                          <span>Confirmada</span>
                        </span>
                      )}
                      {isEnProceso && (
                        <div className="inline-flex flex-col items-center gap-0.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fedeb2] text-[#584323] text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#725b38] animate-ping"></span>
                            <span>En Proceso</span>
                          </span>
                          <span className="text-[9px] text-[#725b38] font-semibold">
                            Min {apt.currentMinuteProgress || 40} / 75m
                          </span>
                        </div>
                      )}
                      {isPendiente && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fedeb2]/70 text-[#584323] text-[10px] font-bold uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[13px]">pending</span>
                          <span>Pendiente</span>
                        </span>
                      )}
                    </td>

                    {/* Quick Actions */}
                    <td className="py-3.5 px-4 align-middle text-right">
                      {isPendiente ? (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => approveAppointment(apt.id)}
                            className="px-3 py-1 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs"
                          >
                            Aprobar
                          </button>
                          <button
                            type="button"
                            onClick={() => rejectAppointment(apt.id)}
                            className="w-7 h-7 rounded-full bg-[#f2edea] text-[#4c4640] hover:text-red-700 hover:bg-red-50 flex items-center justify-center transition-colors"
                            title="Rechazar cita"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1">
                          <a
                            href={`https://wa.me/${apt.clientPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-7 h-7 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#4c4640] hover:text-[#1c1b1a] flex items-center justify-center transition-colors"
                            title="WhatsApp Directo"
                          >
                            <span className="material-symbols-outlined text-[15px] text-[#725b38]">chat</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => setSelectedFormulaApt(apt)}
                            className="w-7 h-7 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#4c4640] hover:text-[#1c1b1a] flex items-center justify-center transition-colors"
                            title="Ver Ficha Técnica"
                          >
                            <span className="material-symbols-outlined text-[15px]">assignment</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => cancelAppointment(apt.id)}
                            className="w-7 h-7 rounded-full bg-[#f2edea] hover:bg-red-50 text-[#4c4640] hover:text-red-700 flex items-center justify-center transition-colors"
                            title="Cancelar Cita"
                          >
                            <span className="material-symbols-outlined text-[15px]">close</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer & Pagination */}
        <div className="p-3.5 bg-[#f8f3f0] border-t border-[#cec5bd]/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4c4640]">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-[#725b38]">info</span>
            <span>
              Mostrando <strong className="text-[#1c1b1a]">{filteredAppointments.length}</strong> de{' '}
              <strong className="text-[#1c1b1a]">{appointments.length} citas programadas</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-3 py-1 rounded-full bg-white hover:bg-[#f2edea] border border-[#cec5bd]/40 text-[#1c1b1a] font-semibold flex items-center gap-1 shadow-xs"
              onClick={() => alert('Planilla de citas del día exportada en formato Excel / CSV')}
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Exportar Planilla</span>
            </button>
          </div>
        </div>
      </section>

      {/* New Appointment Modal */}
      {showNewModal && <NewAppointmentModal onClose={() => setShowNewModal(false)} />}

      {/* Client Formula Modal */}
      {selectedFormulaApt && (
        <ClientFormulaModal
          appointment={selectedFormulaApt}
          onClose={() => setSelectedFormulaApt(null)}
        />
      )}

      {/* Automated Waitlist Freed Slot Notification Modal */}
      {freedSlotAlert && (
        <FreedSlotModal
          event={freedSlotAlert}
          onClose={() => setFreedSlotAlert(null)}
          onOpenWaitlistView={() => {
            setFreedSlotAlert(null);
            setAdminTab('waitlist');
          }}
        />
      )}
    </div>
  );
};
