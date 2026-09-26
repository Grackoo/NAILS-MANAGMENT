import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';

export const AdminClients: React.FC = () => {
  const { clients, adjustClientPoints } = useStudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [pointsBonusModal, setPointsBonusModal] = useState<{ clientId: string; clientName: string } | null>(null);
  const [bonusAmount, setBonusAmount] = useState<number>(150);
  const [bonusReason, setBonusReason] = useState<string>('Bono de fidelidad y cortesía del Atelier');
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  const handleApplyBonus = () => {
    if (!pointsBonusModal) return;
    adjustClientPoints(pointsBonusModal.clientId, bonusAmount, bonusReason);
    setActionSuccessToast(`Se abonaron +${bonusAmount} pts a ${pointsBonusModal.clientName}`);
    setPointsBonusModal(null);
    setTimeout(() => setActionSuccessToast(null), 3500);
  };

  const filteredClients = clients.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.favoriteTechnique.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
            Directorio Signature
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
            Clientas VIP & Historial
          </h1>
          <p className="text-xs text-[#4c4640] mt-0.5">
            Registro de preferencias, fórmulas personalizadas y frecuencia de visita.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined text-[18px] text-[#7d766f] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre o teléfono..."
            className="w-full h-10 pl-9 pr-3 bg-white border border-[#cec5bd]/40 rounded-full text-xs text-[#1c1b1a] placeholder:text-[#7d766f] outline-none focus:ring-1 focus:ring-[#725b38]"
          />
        </div>
      </div>

      {/* Grid of Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="bg-white p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative overflow-hidden"
          >
            {client.isVip && (
              <div className="absolute top-0 right-0 bg-[#fedeb2] text-[#584323] px-3 py-0.5 rounded-bl-xl text-[9px] uppercase font-bold tracking-wider">
                Clienta VIP
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              {client.avatar ? (
                <img
                  src={client.avatar}
                  alt={client.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#cec5bd]/40 shadow-xs"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#f8f3f0] flex items-center justify-center font-serif text-base font-bold text-[#725b38] border border-[#cec5bd]/40 shadow-xs">
                  {client.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <h3 className="font-serif text-base font-bold text-[#1c1b1a] truncate">{client.name}</h3>
                <span className="text-xs text-[#4c4640]">{client.phone}</span>
                <span className="text-[10px] text-[#725b38] font-semibold mt-0.5">
                  {client.totalVisits} visitas registradas
                </span>
              </div>
            </div>

            <div className="bg-[#f8f3f0] p-3 rounded-xl border border-[#cec5bd]/30 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#4c4640] uppercase font-bold">Técnica Habitual:</span>
                <span className="font-semibold text-[#1c1b1a]">{client.favoriteTechnique}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#4c4640] uppercase font-bold">Tono Favorito:</span>
                <span className="font-semibold text-[#725b38]">{client.favoriteColor}</span>
              </div>
              {/* Club Vernis Privilège Points & Tier */}
              <div className="flex items-center justify-between pt-1 border-t border-[#cec5bd]/20">
                <span className="text-[10px] text-[#725b38] uppercase font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">stars</span>
                  <span>Club Privilège:</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#1c1b1a] font-mono">
                    {client.pointsBalance ?? 450} pts
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full bg-[#fedeb2] text-[#584323] text-[9px] font-bold uppercase">
                    {client.loyaltyTier === 'privilege'
                      ? 'Privilège'
                      : client.loyaltyTier === 'elegance'
                      ? 'Élégance'
                      : 'Membre'}
                  </span>
                </div>
              </div>
              <div className="pt-1 border-t border-[#cec5bd]/20">
                <span className="text-[10px] text-[#4c4640] italic block">"{client.notes}"</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/${client.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 h-9 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#1c1b1a] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px] text-[#725b38]">chat</span>
                <span>WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setPointsBonusModal({ clientId: client.id, clientName: client.name })}
                className="h-9 px-3 rounded-full bg-[#fedeb2] hover:bg-amber-200 text-[#584323] text-xs font-bold transition-colors flex items-center gap-1"
                title="Abonar puntos de fidelidad a esta clienta"
              >
                <span className="material-symbols-outlined text-[15px]">stars</span>
                <span>+ Puntos</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Loyalty Points Bonus Modal */}
      {pointsBonusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fdf8f5] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#cec5bd]/50 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[22px]">stars</span>
                <h3 className="font-serif text-base font-bold text-[#1c1b1a]">Abonar Puntos Privilège</h3>
              </div>
              <button
                type="button"
                onClick={() => setPointsBonusModal(null)}
                className="w-7 h-7 rounded-full bg-[#f2edea] text-[#4c4640] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#4c4640]">
              Asignar puntos de cortesía, cumpleaños o recomendación a <strong className="text-[#1c1b1a]">{pointsBonusModal.clientName}</strong>.
            </p>

            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#cec5bd]/40">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4c4640] block">Cantidad de Puntos a Abonar</label>
                <div className="grid grid-cols-3 gap-2">
                  {[100, 150, 250, 500].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setBonusAmount(pts)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        bonusAmount === pts
                          ? 'bg-[#1e1b18] text-white border-[#1e1b18] shadow-xs'
                          : 'bg-[#f8f3f0] hover:bg-[#f2edea] text-[#1c1b1a] border-[#cec5bd]/40'
                      }`}
                    >
                      +{pts} pts
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[10px] uppercase font-bold text-[#4c4640] block">Motivo / Concepto del Bono</label>
                <input
                  type="text"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  className="w-full h-10 px-3 bg-[#f8f3f0] rounded-xl text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleApplyBonus}
                className="h-11 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px] text-[#fedeb2]">check</span>
                <span>Confirmar Abono</span>
              </button>
              <button
                type="button"
                onClick={() => setPointsBonusModal(null)}
                className="h-11 rounded-full bg-[#f2edea] text-[#4c4640] text-xs font-bold uppercase tracking-wider"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Toast Feedback */}
      {actionSuccessToast && (
        <div className="fixed bottom-10 left-4 right-4 max-w-sm mx-auto z-50 bg-[#1e1b18] text-white p-3.5 rounded-2xl shadow-xl border border-[#fedeb2]/40 flex items-center gap-3 animate-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-[#fedeb2] text-[20px]">stars</span>
          <span className="text-xs font-medium">{actionSuccessToast}</span>
        </div>
      )}
    </div>
  );
};
