import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Appointment } from '../../types';
import { BookingSuccessModal } from '../modals/BookingSuccessModal';

export const BookingFlow: React.FC = () => {
  const {
    selectedService,
    services,
    setSelectedService,
    specialists,
    addAppointment,
    setClientTab,
    addToWaitlist,
    clientNotificationPreferences,
    updateClientNotificationPreferences,
    loyaltyProfile,
    availableRewardCoupons,
    activeAppliedCoupon,
    setActiveAppliedCoupon,
    redeemCoupon,
    addLoyaltyPoints,
    currentClient,
    appointments,
  } = useStudio();

  // Loyalty Points Discount State
  const [selectedDiscountMXN, setSelectedDiscountMXN] = useState<number>(
    activeAppliedCoupon ? activeAppliedCoupon.discountMXN : 0
  );

  // Dynamic Calendar Logic
  const [currentStartDate, setCurrentStartDate] = useState(() => new Date());
  
  const daysList = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(currentStartDate);
    d.setDate(d.getDate() + i);
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return {
      dayName: dayNames[d.getDay()],
      dayNum: d.getDate(),
      dateStr: d.toISOString().split('T')[0],
      monthName: d.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
    };
  });

  // Selected date and time state
  const [selectedDay, setSelectedDay] = useState<{ dayName: string; dayNum: number; dateStr: string; monthName: string }>(daysList[0]);

  const [selectedHour, setSelectedHour] = useState<string>('11:00 AM');
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string>('valeria');

  // Client form inputs
  const [clientName, setClientName] = useState<string>(currentClient?.name || '');
  const [clientPhone, setClientPhone] = useState<string>(currentClient?.phone || '');
  const [clientNotes, setClientNotes] = useState<string>('');

  // Modal & loading state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [isChangingService, setIsChangingService] = useState<boolean>(false);
  const [waitlistSuccessToast, setWaitlistSuccessToast] = useState<string | null>(null);
  const [showWaitlistPromptForSlot, setShowWaitlistPromptForSlot] = useState<string | null>(null);

  // Calendar navigation
  const handlePrevDays = () => {
    setCurrentStartDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 6);
      return d;
    });
  };

  const handleNextDays = () => {
    setCurrentStartDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 6);
      return d;
    });
  };

  // Time slots for morning and afternoon
  const morningSlots = [
    { time: '09:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '12:30 PM', available: false },
  ];

  const afternoonSlots = [
    { time: '03:00 PM', available: true },
    { time: '04:30 PM', available: true },
    { time: '06:00 PM', available: false },
  ];

  // Current specialist details
  const currentSpecialist =
    selectedSpecialistId === 'any'
      ? { name: 'Cualquier manicurista', role: 'Asignación Signature' }
      : specialists.find((s) => s.id === selectedSpecialistId) || specialists[0];

  const activeDiscount = activeAppliedCoupon ? activeAppliedCoupon.discountMXN : selectedDiscountMXN;
  const finalPrice = Math.max(0, selectedService.price - activeDiscount);
  const pointsEarned = Math.round(finalPrice * 10);

  const handleConfirmBooking = () => {
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor ingrese su nombre y teléfono para confirmar la reserva.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      let pointsCost = 0;
      if (activeAppliedCoupon) {
        pointsCost = activeAppliedCoupon.pointsCost;
        setActiveAppliedCoupon(null);
      } else if (selectedDiscountMXN > 0) {
        const matchingCoupon = availableRewardCoupons.find((c) => c.discountMXN === selectedDiscountMXN);
        if (matchingCoupon && loyaltyProfile.pointsBalance >= matchingCoupon.pointsCost) {
          pointsCost = matchingCoupon.pointsCost;
          redeemCoupon(matchingCoupon.id);
        }
      }

      // Award points for the session
      addLoyaltyPoints(
        pointsEarned,
        `Cita completada: ${selectedService.title} ($${finalPrice.toFixed(2)})`,
        selectedService.title
      );

      const newApt = addAppointment({
        time: selectedHour,
        durationText: `${Math.floor(selectedService.durationMinutes / 60)}h ${selectedService.durationMinutes % 60}m`,
        durationMinutes: selectedService.durationMinutes,
        shift: selectedHour.includes('PM') && parseInt(selectedHour) >= 6 ? 'cierre' : selectedHour.includes('PM') ? 'tarde' : 'mañana',
        shiftLabel: selectedHour.includes('PM') ? 'Turno Tarde' : 'Turno Mañana',
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientNotes: clientNotes.trim() || undefined,
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        toneName: 'Nude Cashmere #04',
        toneHex: '#EAD8CB',
        specialistId: selectedSpecialistId === 'any' ? 'valeria' : selectedSpecialistId,
        specialistName: currentSpecialist.name,
        station: 'Mesa 01 • Salón Principal',
        price: finalPrice,
        depositPaid: finalPrice * 0.5,
        status: 'confirmada',
        dateStr: selectedDay.dateStr,
        pointsEarned: pointsEarned,
        pointsRedeemed: pointsCost > 0 ? pointsCost : undefined,
        pointsDiscountMXN: activeDiscount > 0 ? activeDiscount : undefined,
      });

      setIsSubmitting(false);
      setCreatedAppointment(newApt);
      let waMessage = `¡Hola L'Atelier Vernis! He reservado una nueva cita:\n\n` +
        `📅 Fecha: ${selectedDay.dateStr}\n` +
        `⏰ Hora: ${selectedHour}\n` +
        `💅 Servicio: ${selectedService.title}\n` +
        `👤 Especialista: ${currentSpecialist.name}\n` +
        `🙋‍♀️ A nombre de: ${clientName.trim()}\n` +
        `📞 Teléfono: ${clientPhone.trim()}\n` +
        (clientNotes.trim() ? `📝 Notas: ${clientNotes.trim()}\n` : '') +
        `\n¡Gracias!`;

      if (isFirstBooking) {
        const rawPhone = clientPhone.replace('+52', '').trim();
        const generatedUser = clientPhone.trim();
        const generatedPwd = clientName.trim().split(' ')[0].toLowerCase() + rawPhone.slice(-4);
        const superLink = window.location.origin + `?autoLogin=` + encodeURIComponent(clientPhone.trim());
        waMessage += `\n\n🔑 *Mis Accesos al Portal VIP (Para mis próximas citas):*\n` +
          `Usuario: ${generatedUser}\n` +
          `Contraseña: ${generatedPwd}\n` +
          `Superlink de acceso directo: ${superLink}\n` +
          `(Este enlace me permitirá entrar directo sin poner contraseña, guárdenlo en mi registro por favor.)`;
      }
      
      const waUrl = `https://wa.me/527711960057?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');
    }, 600);

  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 max-w-md mx-auto space-y-5 pb-28 pt-3">
      {/* Step Tracker Progress Indicator */}
      <div className="w-full bg-[#f8f3f0] rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs">
        <div className="flex items-center justify-between relative">
          {/* Background Connecting Line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-[#cec5bd]/50 z-0"></div>

          {/* Step 1: Completed */}
          <div className="flex flex-col items-center relative z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#725b38] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <span className="text-[10px] text-[#725b38] font-bold tracking-tight">1. Servicio</span>
          </div>

          {/* Step 2: Active */}
          <div className="flex flex-col items-center relative z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#1e1b18] text-white flex items-center justify-center shadow-md ring-4 ring-[#fedeb2]">
              <span className="text-[11px] text-white font-bold">2</span>
            </div>
            <span className="text-[10px] text-[#1e1b18] font-bold tracking-tight">2. Horario</span>
          </div>

          {/* Step 3: Pending */}
          <div className="flex flex-col items-center relative z-10 space-y-1">
            <div className="w-8 h-8 rounded-full bg-[#e6e2df] text-[#4c4640] flex items-center justify-center">
              <span className="text-[11px] text-[#4c4640] font-medium">3</span>
            </div>
            <span className="text-[10px] text-[#4c4640] font-medium tracking-tight">3. Confirmar</span>
          </div>
        </div>
      </div>

      {/* Service Recap Card */}
      <div className="bg-white rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs flex items-start gap-3.5 relative overflow-hidden">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f2edea] shrink-0 border border-[#cec5bd]/30 shadow-xs">
          <img
            src={selectedService.image}
            alt={selectedService.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0 justify-between h-20">
          <div className="flex items-start justify-between gap-1">
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-[#725b38] font-semibold block">
                Tratamiento Seleccionado
              </span>
              <h2 className="font-serif text-base font-bold text-[#1c1b1a] truncate">
                {selectedService.title}
              </h2>
            </div>
            <span className="font-serif text-base text-[#1c1b1a] font-bold whitespace-nowrap">
              ${selectedService.price.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-[#4c4640]">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px] text-[#725b38]">schedule</span>
                <span>{Math.floor(selectedService.durationMinutes / 60)}h {selectedService.durationMinutes % 60}m</span>
              </div>
              <span className="text-[#cec5bd]">•</span>
              <div className="inline-flex items-center gap-1 truncate max-w-[100px]">
                <span className="material-symbols-outlined text-[15px] text-[#725b38]">spa</span>
                <span className="truncate">{currentSpecialist.name}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsChangingService(!isChangingService)}
              className="text-[10px] font-bold text-[#725b38] uppercase hover:underline"
            >
              {isChangingService ? 'Cerrar' : 'Cambiar'}
            </button>
          </div>
        </div>
      </div>

      {/* Optional dropdown to switch service */}
      {isChangingService && (
        <div className="bg-white rounded-2xl p-3 border border-[#cec5bd]/50 shadow-md space-y-2 animate-in fade-in">
          <span className="text-[10px] uppercase font-bold text-[#725b38] block px-1">
            Selecciona otro tratamiento del catálogo:
          </span>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
            {services
              .filter((s) => s.status === 'activo')
              .map((serv) => (
                <button
                  key={serv.id}
                  type="button"
                  onClick={() => {
                    setSelectedService(serv);
                    setIsChangingService(false);
                  }}
                  className={`flex items-center justify-between p-2 rounded-xl text-left transition-colors border ${
                    selectedService.id === serv.id
                      ? 'bg-[#fedeb2]/30 border-[#725b38]'
                      : 'bg-[#f8f3f0] border-transparent hover:bg-[#f2edea]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img src={serv.image} alt={serv.title} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <span className="text-xs font-semibold text-[#1c1b1a] block">{serv.title}</span>
                      <span className="text-[10px] text-[#4c4640]">{serv.durationMinutes} min</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#1c1b1a]">${serv.price.toFixed(2)}</span>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Specialist Selector Filter */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-[#1c1b1a]">Especialista Preferida</label>
          <span className="text-[10px] text-[#725b38] tracking-wide uppercase font-bold">
            Cuidado Signature
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 no-scrollbar -mx-4 px-4">
          {/* Specialist Chip 1: Any */}
          <button
            type="button"
            onClick={() => setSelectedSpecialistId('any')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full shrink-0 transition-all text-xs font-semibold ${
              selectedSpecialistId === 'any'
                ? 'bg-[#1e1b18] text-white shadow-md ring-2 ring-[#725b38]'
                : 'bg-white text-[#4c4640] border border-[#cec5bd]/40 hover:bg-[#f8f3f0]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                selectedSpecialistId === 'any' ? 'bg-white/20 text-white' : 'bg-[#f2edea] text-[#4c4640]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            </div>
            <span>Cualquier manicurista</span>
          </button>

          {/* Specialist Chips */}
          {specialists.map((spec) => {
            const isSelected = selectedSpecialistId === spec.id;
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setSelectedSpecialistId(spec.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0 transition-all ${
                  isSelected
                    ? 'bg-[#1e1b18] text-white shadow-md ring-2 ring-[#725b38]'
                    : 'bg-white text-[#4c4640] border border-[#cec5bd]/40 hover:bg-[#f8f3f0]'
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/40">
                  <img src={spec.photo} alt={spec.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col text-left">
                  <span
                    className={`text-xs font-semibold leading-none ${
                      isSelected ? 'text-white' : 'text-[#1c1b1a]'
                    }`}
                  >
                    {spec.name}
                  </span>
                  <span
                    className={`text-[9px] leading-tight ${
                      isSelected ? 'text-[#fedeb2]' : 'text-[#4c4640]'
                    }`}
                  >
                    {spec.role}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Calendar Day Selector */}
      <div className="bg-white rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs space-y-4">
        {/* Month and Navigation Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#725b38] text-[20px]">calendar_month</span>
            <h3 className="font-serif text-lg font-bold text-[#1c1b1a] capitalize">{daysList[0].monthName}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevDays}
              className="w-7 h-7 rounded-full bg-[#f8f3f0] hover:bg-[#f2edea] flex items-center justify-center text-[#1c1b1a] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <button
              type="button"
              onClick={handleNextDays}
              className="w-7 h-7 rounded-full bg-[#f8f3f0] hover:bg-[#f2edea] flex items-center justify-center text-[#1c1b1a] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Horizontal Interactive Days Strip */}
        <div className="grid grid-cols-6 gap-1.5 text-center">
          {daysList.map((d) => {
            const isSelected = selectedDay.dayNum === d.dayNum;
            return (
              <button
                key={d.dayNum}
                type="button"
                onClick={() => setSelectedDay(d)}
                className={`flex flex-col items-center py-2.5 px-1 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-[#1e1b18] text-white shadow-md ring-2 ring-[#725b38]'
                    : 'bg-[#f8f3f0] hover:bg-[#f2edea] text-[#1c1b1a]'
                }`}
              >
                <span
                  className={`text-[10px] uppercase font-bold ${
                    isSelected ? 'text-[#fedeb2]' : 'text-[#4c4640]'
                  }`}
                >
                  {d.dayName}
                </span>
                <span
                  className={`text-base font-bold mt-0.5 ${
                    isSelected ? 'text-white' : 'text-[#1c1b1a]'
                  }`}
                >
                  {d.dayNum}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1 ${
                    isSelected ? 'bg-[#fedeb2]' : 'bg-transparent'
                  }`}
                ></span>
              </button>
            );
          })}
        </div>

        {/* Time Availability Slots */}
        <div className="space-y-4 pt-1">
          {/* Turno Mañana */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#725b38]">wb_twilight</span>
              <span className="text-[11px] uppercase tracking-wider text-[#1c1b1a] font-bold">
                Turno Mañana
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {morningSlots.map((slot) => {
                const isSelected = selectedHour === slot.time;
                if (!slot.available) {
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setShowWaitlistPromptForSlot(slot.time)}
                      className="h-10 px-2 rounded-full bg-[#f2edea]/80 text-[#7d766f] text-xs font-semibold line-through flex items-center justify-center opacity-85 hover:opacity-100 hover:bg-[#fedeb2]/40 hover:text-[#725b38] transition-all relative group cursor-pointer"
                      title="Turno ocupado. Haz clic para unirte a la lista de espera"
                    >
                      <span>{slot.time}</span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#725b38] rounded-full text-white text-[8px] font-bold flex items-center justify-center not-italic group-hover:scale-110 transition-transform">
                        +
                      </span>
                    </button>
                  );
                }
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedHour(slot.time)}
                    className={`h-10 px-2 rounded-full text-xs transition-all font-semibold flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#1e1b18] text-white ring-2 ring-[#725b38] ring-offset-2 ring-offset-white shadow-sm font-bold'
                        : 'bg-[#f2edea] text-[#1c1b1a] hover:bg-[#fedeb2]/40'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Turno Tarde */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#725b38]">wb_sunny</span>
              <span className="text-[11px] uppercase tracking-wider text-[#1c1b1a] font-bold">
                Turno Tarde
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {afternoonSlots.map((slot) => {
                const isSelected = selectedHour === slot.time;
                if (!slot.available) {
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setShowWaitlistPromptForSlot(slot.time)}
                      className="h-10 px-2 rounded-full bg-[#f2edea]/80 text-[#7d766f] text-xs font-semibold line-through flex items-center justify-center opacity-85 hover:opacity-100 hover:bg-[#fedeb2]/40 hover:text-[#725b38] transition-all relative group cursor-pointer"
                      title="Turno ocupado. Haz clic para unirte a la lista de espera"
                    >
                      <span>{slot.time}</span>
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#725b38] rounded-full text-white text-[8px] font-bold flex items-center justify-center not-italic group-hover:scale-110 transition-transform">
                        +
                      </span>
                    </button>
                  );
                }
                return (
                  <button
                    key={slot.time}
                    type="button"
                    onClick={() => setSelectedHour(slot.time)}
                    className={`h-10 px-2 rounded-full text-xs transition-all font-semibold flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#1e1b18] text-white ring-2 ring-[#725b38] ring-offset-2 ring-offset-white shadow-sm font-bold'
                        : 'bg-[#f2edea] text-[#1c1b1a] hover:bg-[#fedeb2]/40'
                    }`}
                  >
                    {slot.time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Waitlist helper banner */}
          <div className="bg-[#f8f3f0] p-3 rounded-xl border border-[#cec5bd]/30 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#725b38] text-[18px]">hourglass_top</span>
              <span className="text-[#4c4640]">¿Horario no disponible? Únete a la lista prioritaria.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowWaitlistPromptForSlot(selectedHour)}
              className="text-[#725b38] font-bold hover:underline shrink-0 text-[11px] uppercase tracking-wider"
            >
              Lista de Espera
            </button>
          </div>
        </div>
      </div>

      {/* Client Details Quick Input */}
      <div className="bg-white rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base font-bold text-[#1c1b1a]">Datos de la Cita</h3>
          <span className="text-[10px] text-[#725b38] uppercase font-bold">Atención Personalizada</span>
        </div>

        <div className="space-y-3">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#4c4640] font-bold block" htmlFor="client-name">
              Nombre y Apellido
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#7d766f] text-[18px]">person</span>
              <input
                id="client-name"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Tu nombre completo"
                className="w-full h-11 pl-10 pr-3 rounded-full bg-[#f2edea] text-[#1c1b1a] placeholder:text-[#7d766f] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>

          {/* WhatsApp Phone */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#4c4640] font-bold block" htmlFor="client-phone">
              Teléfono WhatsApp (Confirmaciones)
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#7d766f] text-[18px]">chat</span>
              <input
                id="client-phone"
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full h-11 pl-10 pr-3 rounded-full bg-[#f2edea] text-[#1c1b1a] placeholder:text-[#7d766f] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-wider text-[#4c4640] font-bold block" htmlFor="client-notes">
              Notas Especiales (Opcional)
            </label>
            <textarea
              id="client-notes"
              rows={2}
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="Ej. Alergias, retiro de esmaltado previo, uñas frágiles..."
              className="w-full p-3 rounded-xl bg-[#f2edea] text-[#1c1b1a] placeholder:text-[#7d766f] text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#725b38] resize-none"
            />
          </div>
        </div>
      </div>

      {/* Reminder Notification Channels Selector */}
      <div className="bg-white rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#725b38] text-[18px]">notifications_active</span>
            <h3 className="font-serif text-base font-bold text-[#1c1b1a]">Canales de Recordatorio</h3>
          </div>
          <button
            type="button"
            onClick={() => setClientTab('notificaciones')}
            className="text-[10px] uppercase tracking-wider text-[#725b38] font-bold hover:underline"
          >
            Personalizar
          </button>
        </div>
        <p className="text-[11px] text-[#4c4640] leading-relaxed">
          Selecciona por dónde deseas recibir avisos de tu cita (24h y 2h antes):
        </p>
        <div className="grid grid-cols-3 gap-2">
          {/* WhatsApp */}
          <button
            type="button"
            onClick={() => updateClientNotificationPreferences({ whatsapp: !clientNotificationPreferences.whatsapp })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              clientNotificationPreferences.whatsapp
                ? 'bg-green-50 border-green-300 text-green-900 ring-1 ring-green-400/50'
                : 'bg-[#f8f3f0] border-transparent text-[#7d766f] opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-[#25D366]">chat</span>
            <span className="text-[11px] font-bold">WhatsApp</span>
            <span className="text-[9px] uppercase font-semibold">
              {clientNotificationPreferences.whatsapp ? 'Activo' : 'Inactivo'}
            </span>
          </button>

          {/* SMS */}
          <button
            type="button"
            onClick={() => updateClientNotificationPreferences({ sms: !clientNotificationPreferences.sms })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              clientNotificationPreferences.sms
                ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-400/50'
                : 'bg-[#f8f3f0] border-transparent text-[#7d766f] opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-[#725b38]">sms</span>
            <span className="text-[11px] font-bold">SMS</span>
            <span className="text-[9px] uppercase font-semibold">
              {clientNotificationPreferences.sms ? 'Activo' : 'Inactivo'}
            </span>
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={() => updateClientNotificationPreferences({ email: !clientNotificationPreferences.email })}
            className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
              clientNotificationPreferences.email
                ? 'bg-blue-50 border-blue-300 text-blue-900 ring-1 ring-blue-400/50'
                : 'bg-[#f8f3f0] border-transparent text-[#7d766f] opacity-60'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] text-blue-600">mail</span>
            <span className="text-[11px] font-bold">Correo</span>
            <span className="text-[9px] uppercase font-semibold">
              {clientNotificationPreferences.email ? 'Activo' : 'Inactivo'}
            </span>
          </button>
        </div>
      </div>

      {/* Club Vernis Privilège Loyalty Discount Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#fedeb2] shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#fedeb2] text-[#725b38] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">stars</span>
            </div>
            <div>
              <h3 className="font-serif text-base font-bold text-[#1c1b1a]">Club Vernis Privilège</h3>
              <span className="text-[10px] text-[#725b38] font-bold block">
                Tienes {loyaltyProfile.pointsBalance.toLocaleString()} pts disponibles
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setClientTab('puntos')}
            className="text-[10px] uppercase font-bold text-[#725b38] hover:underline flex items-center gap-1"
          >
            <span>Ver Club</span>
            <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
          </button>
        </div>

        {/* Applied Coupon Banner if user already redeemed */}
        {activeAppliedCoupon && (
          <div className="p-3 rounded-xl bg-[#fdf8f5] border border-[#725b38]/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-green-600 text-[18px]">verified</span>
              <div>
                <span className="font-bold text-[#1c1b1a] block">{activeAppliedCoupon.title}</span>
                <span className="text-[10px] text-green-700 font-semibold">
                  -${activeAppliedCoupon.discountMXN} MXN aplicado (Código: {activeAppliedCoupon.code})
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveAppliedCoupon(null);
                setSelectedDiscountMXN(0);
              }}
              className="text-[10px] text-[#7d766f] hover:text-red-600 font-semibold underline"
            >
              Quitar
            </button>
          </div>
        )}

        {/* Quick Discount Selection Pills */}
        {!activeAppliedCoupon && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-[#4c4640] block font-medium">
              Canjea tus puntos por un descuento instantáneo en este servicio:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
              {/* Option 0: No discount */}
              <button
                type="button"
                onClick={() => setSelectedDiscountMXN(0)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedDiscountMXN === 0
                    ? 'bg-[#1e1b18] text-white border-[#1e1b18] shadow-xs'
                    : 'bg-[#f8f3f0] hover:bg-[#f2edea] text-[#4c4640] border-[#cec5bd]/40'
                }`}
              >
                <span className="text-xs font-bold block">Sin canje</span>
                <span className="text-[9px] opacity-80 block">Guardar puntos</span>
              </button>

              {/* Option 1: 500 pts = $10 */}
              <button
                type="button"
                disabled={loyaltyProfile.pointsBalance < 500}
                onClick={() => setSelectedDiscountMXN(10)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedDiscountMXN === 10
                    ? 'bg-[#fedeb2] text-[#584323] border-[#725b38] shadow-xs font-bold ring-1 ring-[#725b38]'
                    : loyaltyProfile.pointsBalance >= 500
                    ? 'bg-white hover:bg-[#f8f3f0] text-[#1c1b1a] border-[#cec5bd]/50'
                    : 'bg-[#f8f3f0] text-gray-400 border-transparent opacity-60 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold block">-$10 MXN</span>
                <span className="text-[9px] block">500 pts</span>
              </button>

              {/* Option 2: 1000 pts = $25 */}
              <button
                type="button"
                disabled={loyaltyProfile.pointsBalance < 1000}
                onClick={() => setSelectedDiscountMXN(25)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedDiscountMXN === 25
                    ? 'bg-[#fedeb2] text-[#584323] border-[#725b38] shadow-xs font-bold ring-1 ring-[#725b38]'
                    : loyaltyProfile.pointsBalance >= 1000
                    ? 'bg-white hover:bg-[#f8f3f0] text-[#1c1b1a] border-[#cec5bd]/50'
                    : 'bg-[#f8f3f0] text-gray-400 border-transparent opacity-60 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold block">-$25 MXN</span>
                <span className="text-[9px] block">1,000 pts</span>
              </button>

              {/* Option 3: 1500 pts = $40 */}
              <button
                type="button"
                disabled={loyaltyProfile.pointsBalance < 1500}
                onClick={() => setSelectedDiscountMXN(40)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedDiscountMXN === 40
                    ? 'bg-[#fedeb2] text-[#584323] border-[#725b38] shadow-xs font-bold ring-1 ring-[#725b38]'
                    : loyaltyProfile.pointsBalance >= 1500
                    ? 'bg-white hover:bg-[#f8f3f0] text-[#1c1b1a] border-[#cec5bd]/50'
                    : 'bg-[#f8f3f0] text-gray-400 border-transparent opacity-60 cursor-not-allowed'
                }`}
              >
                <span className="text-xs font-bold block">-$40 MXN</span>
                <span className="text-[9px] block">1,500 pts</span>
              </button>
            </div>
          </div>
        )}

        {/* Pricing & Points Rewards Breakdown */}
        <div className="bg-[#f8f3f0] p-3 rounded-xl border border-[#cec5bd]/30 space-y-1 text-xs">
          <div className="flex items-center justify-between text-[#4c4640]">
            <span>Precio del tratamiento:</span>
            <span>${selectedService.price.toFixed(2)} MXN</span>
          </div>
          {activeDiscount > 0 && (
            <div className="flex items-center justify-between text-green-700 font-semibold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">stars</span>
                <span>Descuento Club Privilège:</span>
              </span>
              <span>-${activeDiscount.toFixed(2)} MXN</span>
            </div>
          )}
          <div className="flex items-center justify-between text-[#1c1b1a] font-bold pt-1 border-t border-[#cec5bd]/30">
            <span>Total a pagar en salón:</span>
            <span className="font-serif text-sm">${finalPrice.toFixed(2)} MXN</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#725b38] pt-0.5">
            <span>Puntos que acumularás:</span>
            <span className="font-semibold">+{pointsEarned} Pts Vernis</span>
          </div>
        </div>
      </div>

      {/* Studio Policy Micro Note */}
      <div className="bg-[#fedeb2]/35 rounded-xl p-3 border border-[#fedeb2] flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#725b38] text-[18px] shrink-0 mt-0.5">verified_user</span>
        <p className="text-xs text-[#584323] leading-relaxed">
          Garantía de cortesía: Puede reprogramar su cita hasta 12 horas previas a la sesión sin cargos adicionales.
        </p>
      </div>

      {/* Sticky Bottom Summary Drawer & Primary CTA */}
      <div className="fixed bottom-18 left-0 right-0 z-30 bg-[#fdf8f5]/95 backdrop-blur-md border-t border-[#cec5bd]/40 shadow-xl px-4 py-3">
        <div className="max-w-md mx-auto space-y-2">
          {/* Selected Info Line */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="material-symbols-outlined text-[16px] text-[#725b38]">event_seat</span>
              <span className="text-xs text-[#1c1b1a] font-semibold truncate capitalize">
                {selectedDay.dayName} {selectedDay.dayNum} {selectedDay.monthName.split(' ')[0].slice(0, 3)}, {selectedHour} • {currentSpecialist.name}
              </span>
            </div>
            <div className="text-right shrink-0">
              {activeDiscount > 0 ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 line-through">
                    ${selectedService.price.toFixed(2)}
                  </span>
                  <span className="font-serif text-base font-bold text-green-700">
                    ${finalPrice.toFixed(2)} MXN
                  </span>
                </div>
              ) : (
                <span className="font-serif text-base font-bold text-[#1c1b1a]">
                  ${selectedService.price.toFixed(2)} MXN
                </span>
              )}
            </div>
          </div>

          {/* Main Action Button */}
          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            className="w-full h-12 rounded-full bg-[#1e1b18] text-white text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-neutral-800 active:scale-[0.99] transition-all disabled:opacity-75"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Reservando Cita...</span>
              </>
            ) : (
              <>
                <span>Continuar y Confirmar Cita</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {createdAppointment && (
        <BookingSuccessModal
          appointment={createdAppointment}
          onClose={() => setCreatedAppointment(null)}
          onViewAgenda={() => {
            setCreatedAppointment(null);
            setClientTab('agenda');
          }}
        />
      )}

      {/* Waitlist Join Modal for Client */}
      {showWaitlistPromptForSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fdf8f5] w-full max-w-md rounded-3xl p-5 shadow-2xl border border-[#cec5bd]/50 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#725b38]">hourglass_top</span>
                <h3 className="font-serif text-lg font-bold text-[#1c1b1a]">Unirme a Lista de Espera</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWaitlistPromptForSlot(null)}
                className="w-7 h-7 rounded-full bg-[#f2edea] text-[#4c4640] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="bg-white p-3 rounded-2xl border border-[#cec5bd]/40 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#725b38]">Horario Solicitado</span>
              <p className="font-bold text-[#1c1b1a]">
                {selectedDay.dayName} {selectedDay.dayNum} Nov • {showWaitlistPromptForSlot}
              </p>
              <p className="text-[#4c4640]">{selectedService.title} con {currentSpecialist.name}</p>
            </div>

            <p className="text-xs text-[#4c4640] leading-relaxed">
              Si una clienta cancela o reprograma este horario, nuestro sistema te enviará una notificación instantánea a tu WhatsApp con reserva preferente.
            </p>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4c4640]">Tu Nombre</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4c4640]">Teléfono WhatsApp</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowWaitlistPromptForSlot(null)}
                className="flex-1 py-2.5 rounded-full bg-[#f2edea] text-xs font-semibold text-[#1c1b1a]"
              >
                Volver
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!clientName.trim() || !clientPhone.trim()) {
                    alert('Por favor completa tu nombre y WhatsApp');
                    return;
                  }
                  addToWaitlist({
                    clientName: clientName.trim(),
                    clientPhone: clientPhone.trim(),
                    serviceId: selectedService.id,
                    serviceTitle: selectedService.title,
                    preferredSpecialistId: selectedSpecialistId,
                    preferredSpecialistName: currentSpecialist.name,
                    preferredShift: showWaitlistPromptForSlot.includes('PM') ? 'tarde' : 'mañana',
                    preferredDateStr: selectedDay.dateStr,
                    targetTimeSlot: showWaitlistPromptForSlot,
                    priority: 'alta',
                    notes: `Solicitud de clienta en portal para el turno de las ${showWaitlistPromptForSlot}.`,
                  });
                  setShowWaitlistPromptForSlot(null);
                  setWaitlistSuccessToast(`¡Te hemos anotado en la lista de espera para las ${showWaitlistPromptForSlot}! Te avisaremos si se libera.`);
                  setTimeout(() => setWaitlistSuccessToast(null), 4000);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider shadow-xs hover:bg-[#32302e]"
              >
                Confirmar Alerta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Waitlist Toast Feedback */}
      {waitlistSuccessToast && (
        <div className="fixed bottom-24 left-4 right-4 max-w-sm mx-auto z-50 bg-[#1e1b18] text-white p-3.5 rounded-2xl shadow-xl border border-[#fedeb2]/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[#fedeb2] text-[22px]">check_circle</span>
          <span className="text-xs font-medium leading-tight">{waitlistSuccessToast}</span>
        </div>
      )}
    </div>
  );
};
