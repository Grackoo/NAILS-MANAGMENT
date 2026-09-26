import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';

export const ClientNotificationSettings: React.FC = () => {
  const { clientNotificationPreferences, updateClientNotificationPreferences, setClientTab } = useStudio();

  const [phone, setPhone] = useState(clientNotificationPreferences.phone);
  const [emailAddress, setEmailAddress] = useState(clientNotificationPreferences.emailAddress);
  const [clientName, setClientName] = useState(clientNotificationPreferences.clientName);

  const [whatsapp, setWhatsapp] = useState(clientNotificationPreferences.whatsapp);
  const [sms, setSms] = useState(clientNotificationPreferences.sms);
  const [email, setEmail] = useState(clientNotificationPreferences.email);

  const [reminder24h, setReminder24h] = useState(clientNotificationPreferences.reminder24h);
  const [reminder2h, setReminder2h] = useState(clientNotificationPreferences.reminder2h);
  const [waitlistAlerts, setWaitlistAlerts] = useState(clientNotificationPreferences.waitlistAlerts);
  const [postTreatmentTips, setPostTreatmentTips] = useState(clientNotificationPreferences.postTreatmentTips);

  const [saveToast, setSaveToast] = useState(false);
  const [testAlertModal, setTestAlertModal] = useState<null | {
    channel: 'whatsapp' | 'sms' | 'email';
    title: string;
    message: string;
  }>(null);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateClientNotificationPreferences({
      phone,
      emailAddress,
      clientName,
      whatsapp,
      sms,
      email,
      reminder24h,
      reminder2h,
      waitlistAlerts,
      postTreatmentTips,
    });
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleTriggerTest = (channel: 'whatsapp' | 'sms' | 'email') => {
    let title = '';
    let message = '';

    if (channel === 'whatsapp') {
      title = "Notificación de Prueba • WhatsApp L'Atelier Vernis";
      message = `✨ Bonjour ${clientName || 'Elena'}, te recordamos tu cita de Acrílico Francés Perla mañana a las 11:00 AM con Valeria M. (Mesa 01). Para confirmar responde 1, para reagendar responde 2.`;
    } else if (channel === 'sms') {
      title = "Mensaje de Texto SMS (LAV-ALERT)";
      message = `L'Atelier Vernis: Cita confirmada mañana 11:00 AM. Ver ubicación y protocolo de cortesía en: https://latelier-vernis.com/c/lav-8821`;
    } else {
      title = "Correo Electrónico • L'Atelier Vernis Haute Beauté";
      message = `Estimada ${clientName || 'Elena Rostova'},\n\nAdjuntamos la confirmación formal y el archivo de calendario (.ics) para su sesión en cabina de Acrílico Francés Perla.\n\nEspecialista: Valeria M. (Senior Master)\nFecha: 19 Noviembre 2024 a las 11:00 AM\nUbicación: Salón Central L'Atelier Vernis`;
    }

    setTestAlertModal({ channel, title, message });
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 max-w-md md:max-w-2xl mx-auto space-y-5 pb-28 pt-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#725b38] font-bold">
            <span className="material-symbols-outlined text-[15px]">notifications</span>
            <span>Preferencias de Comunicación</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
            Canales de Notificación
          </h1>
          <p className="text-xs text-[#4c4640] leading-relaxed mt-1">
            Elige los canales por los que deseas recibir recordatorios de citas, alertas prioritarias de lista de espera y comprobantes oficiales.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setClientTab('agenda')}
          className="p-2 rounded-full bg-[#f2edea] text-[#4c4640] hover:text-[#1c1b1a] transition-colors shrink-0"
          title="Volver a mis citas"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>

      {/* Primary Channel Selectors */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase tracking-wider text-[#1c1b1a] font-bold block">
            Canales de Envío Activos
          </span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => {
                setWhatsapp(true);
                setSms(true);
                setEmail(true);
              }}
              className="text-[#725b38] font-bold hover:underline"
            >
              Activar Todos
            </button>
            <span className="text-[#cec5bd]">•</span>
            <button
              type="button"
              onClick={() => {
                setWhatsapp(true);
                setSms(false);
                setEmail(false);
              }}
              className="text-[#725b38] font-bold hover:underline"
            >
              Solo WhatsApp
            </button>
          </div>
        </div>

        {/* Channel 1: WhatsApp */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            whatsapp
              ? 'bg-white border-[#725b38]/50 shadow-xs ring-1 ring-[#fedeb2]'
              : 'bg-white/70 border-[#cec5bd]/40 opacity-80'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">chat</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base font-bold text-[#1c1b1a]">WhatsApp Directo</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#fedeb2] text-[#584323] text-[9px] font-bold uppercase tracking-wider">
                    Recomendado
                  </span>
                </div>
                <p className="text-xs text-[#4c4640] leading-relaxed">
                  Recordatorios dinámicos interactivos con botones para confirmar o reprogramar tu sesión, ubicación con mapa y fotos de tu diseño.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={whatsapp}
                onChange={(e) => setWhatsapp(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#e6e2df] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#25D366] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {whatsapp && (
            <div className="mt-3 pt-3 border-t border-[#f2edea] flex items-center justify-between">
              <span className="text-[11px] text-[#4c4640] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Se enviará a: <strong className="text-[#1c1b1a]">{phone}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleTriggerTest('whatsapp')}
                className="text-[11px] font-bold text-[#725b38] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">send</span>
                <span>Enviar Prueba</span>
              </button>
            </div>
          )}
        </div>

        {/* Channel 2: SMS */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            sms
              ? 'bg-white border-[#725b38]/50 shadow-xs ring-1 ring-[#fedeb2]'
              : 'bg-white/70 border-[#cec5bd]/40 opacity-80'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#725b38]/15 text-[#725b38] flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">sms</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base font-bold text-[#1c1b1a]">Mensajes de Texto (SMS)</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#f2edea] text-[#4c4640] text-[9px] font-bold uppercase tracking-wider">
                    Instantáneo
                  </span>
                </div>
                <p className="text-xs text-[#4c4640] leading-relaxed">
                  Avisos breves y de alta fiabilidad que llegan incluso sin conexión de datos móviles activa. Ideal para recordatorios de última hora.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={sms}
                onChange={(e) => setSms(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#e6e2df] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#725b38] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {sms && (
            <div className="mt-3 pt-3 border-t border-[#f2edea] flex items-center justify-between">
              <span className="text-[11px] text-[#4c4640] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Se enviará a: <strong className="text-[#1c1b1a]">{phone}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleTriggerTest('sms')}
                className="text-[11px] font-bold text-[#725b38] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">send</span>
                <span>Enviar Prueba</span>
              </button>
            </div>
          )}
        </div>

        {/* Channel 3: Correo Electrónico */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            email
              ? 'bg-white border-[#725b38]/50 shadow-xs ring-1 ring-[#fedeb2]'
              : 'bg-white/70 border-[#cec5bd]/40 opacity-80'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1e1b18]/10 text-[#1e1b18] flex items-center justify-center shrink-0 shadow-inner">
                <span className="material-symbols-outlined text-[24px]">mail</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base font-bold text-[#1c1b1a]">Correo Electrónico</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#f2edea] text-[#4c4640] text-[9px] font-bold uppercase tracking-wider">
                    Calendario .ICS
                  </span>
                </div>
                <p className="text-xs text-[#4c4640] leading-relaxed">
                  Comprobante digital formal en alta resolución, archivo sincronizable para Google Calendar / Apple Calendar y recomendaciones de cuidado.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={email}
                onChange={(e) => setEmail(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#e6e2df] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-[#1e1b18] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          {email && (
            <div className="mt-3 pt-3 border-t border-[#f2edea] flex items-center justify-between">
              <span className="text-[11px] text-[#4c4640] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Se enviará a: <strong className="text-[#1c1b1a]">{emailAddress}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleTriggerTest('email')}
                className="text-[11px] font-bold text-[#725b38] hover:underline flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">send</span>
                <span>Enviar Prueba</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Details Information */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#cec5bd]/40 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#1c1b1a] uppercase tracking-wider">
            Datos de Destino de las Notificaciones
          </span>
          <span className="text-[10px] text-[#725b38] font-bold">Datos Verificados</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640] block">Nombre Completo</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#7d766f] text-[18px]">person</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f8f3f0] text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640] block">Teléfono (WhatsApp & SMS)</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#7d766f] text-[18px]">phone</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f8f3f0] text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640] block">Correo Electrónico</label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-[#7d766f] text-[18px]">mail</span>
              <input
                type="email"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#f8f3f0] text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Anticipation & Alert Types */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#cec5bd]/40 shadow-xs space-y-3">
        <span className="text-xs font-bold text-[#1c1b1a] uppercase tracking-wider block">
          Tipos de Recordatorios & Frecuencia
        </span>

        <div className="space-y-2 pt-1">
          {/* 24 Hours Before */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3f0] cursor-pointer hover:bg-[#f2edea] transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#725b38] text-[20px]">alarm</span>
              <div>
                <span className="text-xs font-semibold text-[#1c1b1a] block">Recordatorio 24 horas previas</span>
                <span className="text-[10px] text-[#4c4640]">Para planificar tu día y confirmar asistencia</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminder24h}
              onChange={(e) => setReminder24h(e.target.checked)}
              className="accent-[#725b38] w-4.5 h-4.5 rounded cursor-pointer"
            />
          </label>

          {/* 2 Hours Before */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3f0] cursor-pointer hover:bg-[#f2edea] transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#725b38] text-[20px]">timer</span>
              <div>
                <span className="text-xs font-semibold text-[#1c1b1a] block">Aviso exprés 2 horas antes</span>
                <span className="text-[10px] text-[#4c4640]">Indicación de mesa asignada y tiempo de trayecto</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={reminder2h}
              onChange={(e) => setReminder2h(e.target.checked)}
              className="accent-[#725b38] w-4.5 h-4.5 rounded cursor-pointer"
            />
          </label>

          {/* Waitlist Alerts */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3f0] cursor-pointer hover:bg-[#f2edea] transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#725b38] text-[20px]">hourglass_top</span>
              <div>
                <span className="text-xs font-semibold text-[#1c1b1a] block">Alertas de Lista de Espera</span>
                <span className="text-[10px] text-[#4c4640]">Aviso inmediato si se libera un turno cancelado</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={waitlistAlerts}
              onChange={(e) => setWaitlistAlerts(e.target.checked)}
              className="accent-[#725b38] w-4.5 h-4.5 rounded cursor-pointer"
            />
          </label>

          {/* Post treatment tips */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3f0] cursor-pointer hover:bg-[#f2edea] transition-colors">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#725b38] text-[20px]">spa</span>
              <div>
                <span className="text-xs font-semibold text-[#1c1b1a] block">Recomendaciones Post-Tratamiento</span>
                <span className="text-[10px] text-[#4c4640]">Consejos para máxima duración de acrílico y esmaltado</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={postTreatmentTips}
              onChange={(e) => setPostTreatmentTips(e.target.checked)}
              className="accent-[#725b38] w-4.5 h-4.5 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => handleSave()}
          className="w-full h-12 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[18px]">check</span>
          <span>Guardar Preferencias de Notificación</span>
        </button>
      </div>

      {/* Save Toast Feedback */}
      {saveToast && (
        <div className="fixed bottom-24 left-4 right-4 max-w-sm mx-auto z-50 bg-[#1e1b18] text-white p-3.5 rounded-2xl shadow-xl border border-[#fedeb2]/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <span className="material-symbols-outlined text-[#fedeb2] text-[22px]">check_circle</span>
          <span className="text-xs font-medium">¡Preferencias de recordatorio guardadas correctamente!</span>
        </div>
      )}

      {/* Test Alert Simulator Modal */}
      {testAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fdf8f5] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#cec5bd]/50 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#725b38] text-[22px]">notifications_active</span>
                <h3 className="font-serif text-base font-bold text-[#1c1b1a]">Simulación de Aviso</h3>
              </div>
              <button
                type="button"
                onClick={() => setTestAlertModal(null)}
                className="w-7 h-7 rounded-full bg-[#f2edea] text-[#4c4640] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs space-y-2">
              <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
                {testAlertModal.title}
              </span>
              <div className="bg-[#f8f3f0] p-3.5 rounded-xl border border-[#cec5bd]/30 text-xs text-[#1c1b1a] whitespace-pre-line leading-relaxed font-sans">
                {testAlertModal.message}
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#7d766f] pt-1">
                <span>Canal: {testAlertModal.channel.toUpperCase()}</span>
                <span>Destino: {testAlertModal.channel === 'email' ? emailAddress : phone}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTestAlertModal(null)}
              className="w-full py-2.5 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
