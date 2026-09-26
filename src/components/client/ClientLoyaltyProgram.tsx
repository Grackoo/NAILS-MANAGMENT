import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { LoyaltyRewardCoupon } from '../../types';

export const ClientLoyaltyProgram: React.FC = () => {
  const {
    loyaltyProfile,
    availableRewardCoupons,
    redeemCoupon,
    setClientTab,
    activeAppliedCoupon,
    setActiveAppliedCoupon,
  } = useStudio();

  const [redeemSuccessModal, setRedeemSuccessModal] = useState<LoyaltyRewardCoupon | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Next tier calculation
  const nextTierPoints = 2500;
  const currentTierPoints = loyaltyProfile.pointsBalance;
  const pointsRemaining = Math.max(0, nextTierPoints - currentTierPoints);
  const tierProgressPercent = Math.min(100, Math.round((currentTierPoints / nextTierPoints) * 100));

  const handleRedeem = (couponId: string) => {
    setErrorMessage(null);
    const result = redeemCoupon(couponId);
    if (result.success && result.coupon) {
      setRedeemSuccessModal(result.coupon);
    } else {
      setErrorMessage(result.message);
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 max-w-md md:max-w-2xl mx-auto space-y-6 pb-28 pt-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#725b38] font-bold">
            <span className="material-symbols-outlined text-[16px] text-amber-500">stars</span>
            <span>Club Vernis Privilège</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
            Programa de Puntos & Fidelidad
          </h1>
          <p className="text-xs text-[#4c4640] leading-relaxed mt-1">
            Acumula 10 puntos por cada $1 USD en tus citas y canjéalos por descuentos inmediatos en tus próximos tratamientos.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setClientTab('agendar')}
          className="p-2 rounded-full bg-[#f2edea] text-[#4c4640] hover:text-[#1c1b1a] transition-colors shrink-0"
          title="Agendar Cita"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
        </button>
      </div>

      {/* Luxury Digital VIP Pass Card */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-7 bg-gradient-to-br from-[#1e1b18] via-[#2c2724] to-[#121110] text-white shadow-2xl border border-[#fedeb2]/30 space-y-5">
        {/* Shimmer Ambient Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#fedeb2]/15 via-transparent to-transparent pointer-events-none rounded-full blur-2xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-radial from-[#725b38]/20 via-transparent to-transparent pointer-events-none rounded-full blur-xl"></div>

        {/* Card Top Row: Brand & Tier Badge */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-[#fedeb2]/40 flex items-center justify-center p-1.5 shadow-inner">
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1WeS18HwIlPLWqATMYOOUC8XMppEnqUK2a3JDlwQalzICr5dH5rwvQ6My-lA8fKJERMJRFqT_uj51y4UNzxMGRFkrjw184aaa5b1uloQmVMmTQrWA6nUpdybxo0Gf4WhdznZRTzOKoPDOkrR3e-tbXe28R_wdnZYC1RlWxs3DozGo4VaNvHAnWer5lUzkyGWTSrQRzgT-Dz7SQlRt71Eyu9q3l9EjeN-4XOWsM8BvcEuu_d33Ey8Bom"
                alt="L'Atelier Vernis Logo"
                className="w-full h-full object-contain brightness-150"
              />
            </div>
            <div>
              <span className="font-serif text-sm tracking-wider font-semibold block text-[#fdf8f5]">
                L'Atelier Vernis
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#fedeb2] font-bold block">
                Privilège Member
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#fedeb2]/20 to-[#725b38]/30 border border-[#fedeb2]/50 backdrop-blur-md">
            <span className="material-symbols-outlined text-[#fedeb2] text-[15px]">workspace_premium</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#fedeb2]">
              {loyaltyProfile.tier === 'privilege' ? 'Atelier Privilège' : loyaltyProfile.tier === 'elegance' ? 'VIP Élégance' : 'Membre Bronze'}
            </span>
          </div>
        </div>

        {/* Card Middle: Points Balance Display */}
        <div className="relative z-10 pt-1">
          <span className="text-[10px] uppercase tracking-widest text-white/60 block font-medium">
            Saldo de Puntos Disponibles
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-white via-[#fedeb2] to-amber-200 bg-clip-text text-transparent">
              {loyaltyProfile.pointsBalance.toLocaleString()}
            </span>
            <span className="text-sm font-semibold text-[#fedeb2] uppercase tracking-wider">
              Pts Vernis
            </span>
          </div>
          <p className="text-[11px] text-white/70 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            Equivalente a hasta <strong className="text-white font-bold">~$45 USD</strong> en descuentos de manicura de autor.
          </p>
        </div>

        {/* Card Bottom: Progress to Next Tier */}
        <div className="relative z-10 pt-2 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-white/80 font-medium">
              Próximo Nivel: <strong className="text-[#fedeb2]">Atelier Privilège</strong>
            </span>
            <span className="text-white/60 text-[10px]">
              {pointsRemaining > 0 ? `Faltan ${pointsRemaining} pts` : '¡Nivel Máximo Alcanzado!'}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="bg-gradient-to-r from-[#725b38] via-[#fedeb2] to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${tierProgressPercent}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-white/50 pt-0.5">
            <span>Socia: {loyaltyProfile.clientName}</span>
            <span>Membresía: {loyaltyProfile.membershipNumber}</span>
          </div>
        </div>
      </div>

      {/* Error alert toast */}
      {errorMessage && (
        <div className="bg-red-50 text-red-900 border border-red-200 p-3 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[18px] text-red-600">error</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Active Voucher Ready for Booking Notice */}
      {activeAppliedCoupon && (
        <div className="bg-white rounded-2xl p-4 border border-[#725b38]/40 shadow-xs ring-1 ring-[#fedeb2] flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fedeb2] text-[#725b38] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">loyalty</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1c1b1a]">{activeAppliedCoupon.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[9px] font-bold uppercase">
                  Cupón Listo
                </span>
              </div>
              <p className="text-[11px] text-[#4c4640]">
                Descuento de <strong className="text-[#1c1b1a]">${activeAppliedCoupon.discountUsd} USD</strong> asignado para tu próxima cita.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setClientTab('agendar')}
            className="px-3.5 py-1.5 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider shrink-0 hover:bg-[#32302e] transition-colors"
          >
            Usar Ahora
          </button>
        </div>
      )}

      {/* Rewards Catalog Section */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
              Catálogo de Recompensas
            </span>
            <h2 className="font-serif text-lg font-bold text-[#1c1b1a]">
              Canjea tus Puntos por Descuentos
            </h2>
          </div>
          <span className="text-xs font-bold text-[#725b38] bg-[#f8f3f0] px-2.5 py-1 rounded-full border border-[#cec5bd]/40">
            {loyaltyProfile.pointsBalance} pts libres
          </span>
        </div>

        {/* Coupons Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {availableRewardCoupons.map((coupon) => {
            const canAfford = loyaltyProfile.pointsBalance >= coupon.pointsCost;
            const isCurrentlySelected = activeAppliedCoupon?.pointsCost === coupon.pointsCost;

            return (
              <div
                key={coupon.id}
                className={`bg-white rounded-2xl p-4.5 border transition-all flex flex-col justify-between space-y-3 relative overflow-hidden ${
                  canAfford
                    ? 'border-[#cec5bd]/50 shadow-xs hover:border-[#725b38]/60 hover:shadow-md'
                    : 'border-[#cec5bd]/30 opacity-75'
                }`}
              >
                {/* Decorative Top Accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    canAfford ? 'bg-gradient-to-r from-[#725b38] via-[#fedeb2] to-[#725b38]' : 'bg-[#e6e2df]'
                  }`}
                ></div>

                <div>
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#f8f3f0] text-[#725b38] text-[10px] font-bold uppercase tracking-wider border border-[#cec5bd]/40">
                      {coupon.pointsCost} Puntos
                    </span>
                    <span className="font-serif text-xl font-bold text-[#1c1b1a]">
                      -${coupon.discountUsd} USD
                    </span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#1c1b1a] mt-2">
                    {coupon.title}
                  </h3>
                  <p className="text-xs text-[#4c4640] leading-relaxed mt-0.5">
                    {coupon.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f2edea] flex items-center justify-between">
                  <span className="text-[10px] text-[#7d766f] font-mono">
                    Código: {coupon.code}
                  </span>

                  {canAfford ? (
                    <button
                      type="button"
                      onClick={() => handleRedeem(coupon.id)}
                      className="px-3.5 py-1.5 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 active:scale-95 shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#fedeb2]">redeem</span>
                      <span>Canjear</span>
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-[#7d766f] bg-[#f2edea] px-2.5 py-1 rounded-full">
                      Faltan {coupon.pointsCost - loyaltyProfile.pointsBalance} pts
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Points Transactions History */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cec5bd]/40 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
              Extracto de Fidelidad
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#1c1b1a]">
              Historial de Movimientos de Puntos
            </h3>
          </div>
          <span className="text-[11px] text-[#7d766f]">
            Total histórico: <strong>{loyaltyProfile.totalPointsEarned} pts</strong>
          </span>
        </div>

        <div className="space-y-2.5">
          {loyaltyProfile.transactions.map((tx) => {
            const isEarned = tx.points > 0;
            return (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3f0] border border-[#cec5bd]/30 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      isEarned ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isEarned ? 'add' : 'redeem'}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#1c1b1a] block leading-tight">
                      {tx.description}
                    </span>
                    <span className="text-[10px] text-[#7d766f]">{tx.dateStr}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-bold font-mono text-xs ${
                      isEarned ? 'text-green-700' : 'text-amber-800'
                    }`}
                  >
                    {isEarned ? `+${tx.points}` : tx.points} pts
                  </span>
                  {tx.discountAppliedUsd && (
                    <span className="block text-[10px] text-[#725b38] font-bold">
                      -${tx.discountAppliedUsd} USD
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How to Earn More Points Card */}
      <section className="bg-gradient-to-br from-[#f8f3f0] to-[#f2edea] rounded-3xl p-5 border border-[#cec5bd]/50 space-y-3">
        <div className="flex items-center gap-2 text-[#725b38]">
          <span className="material-symbols-outlined text-[20px]">lightbulb</span>
          <h3 className="font-serif text-sm font-bold text-[#1c1b1a] uppercase tracking-wider">
            ¿Cómo acumular más puntos en L'Atelier Vernis?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-[#4c4640]">
          <div className="bg-white/80 p-3 rounded-2xl border border-[#cec5bd]/30 space-y-1">
            <span className="text-sm font-bold text-[#725b38] block">10 Pts / $1 USD</span>
            <p className="text-[11px] leading-relaxed">
              Acumula automáticamente en cada manicura, pedicura o diseño 3D.
            </p>
          </div>
          <div className="bg-white/80 p-3 rounded-2xl border border-[#cec5bd]/30 space-y-1">
            <span className="text-sm font-bold text-[#725b38] block">+250 Puntos</span>
            <p className="text-[11px] leading-relaxed">
              Por cada amiga recomendada que reserve su primera cita en cabina.
            </p>
          </div>
          <div className="bg-white/80 p-3 rounded-2xl border border-[#cec5bd]/30 space-y-1">
            <span className="text-sm font-bold text-[#725b38] block">+100 Puntos</span>
            <p className="text-[11px] leading-relaxed">
              Al compartir una foto de tu set de uñas en Instagram etiquetando el salón.
            </p>
          </div>
        </div>
      </section>

      {/* Primary Action Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setClientTab('agendar')}
          className="w-full h-12 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_add_on</span>
          <span>Reservar Cita y Utilizar Puntos</span>
        </button>
      </div>

      {/* Success Redeem Modal */}
      {redeemSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fdf8f5] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#cec5bd]/50 space-y-4">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-[#fedeb2] text-[#725b38] flex items-center justify-center shadow-inner">
                <span className="material-symbols-outlined text-[30px]">celebration</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest">
                ¡Canje Confirmado!
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1c1b1a]">
                Descuento de ${redeemSuccessModal.discountUsd} USD Listo
              </h3>
              <p className="text-xs text-[#4c4640] leading-relaxed">
                Has canjeado {redeemSuccessModal.pointsCost} puntos por el cupón <strong>{redeemSuccessModal.title}</strong>. Se aplicará automáticamente al reservar tu próximo servicio.
              </p>
            </div>

            {/* Voucher ticket display */}
            <div className="bg-white p-4 rounded-2xl border border-[#725b38]/40 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#725b38]">Código Privilège</span>
                <span className="font-mono text-base font-bold text-[#1c1b1a] block">{redeemSuccessModal.code}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold">
                -${redeemSuccessModal.discountUsd} USD
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRedeemSuccessModal(null);
                  setClientTab('agendar');
                }}
                className="h-11 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm"
              >
                <span>Ir a Reservar</span>
              </button>
              <button
                type="button"
                onClick={() => setRedeemSuccessModal(null)}
                className="h-11 rounded-full bg-[#f2edea] text-[#1c1b1a] text-xs font-bold uppercase tracking-wider flex items-center justify-center hover:bg-[#ece7e4]"
              >
                <span>Cerrar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
