import React, { useState, useMemo } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ReviewStatus, ServiceReview } from '../../types';

export const AdminReviewsModeration: React.FC = () => {
  const { reviews, updateReviewStatus, toggleFeatureReview, replyToReview, deleteReview } = useStudio();

  const [statusFilter, setStatusFilter] = useState<'todas' | ReviewStatus | 'destacadas'>('todas');
  const [specialistFilter, setSpecialistFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & reply state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [replyAuthor, setReplyAuthor] = useState<string>('Valerie M. (Directora)');
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (statusFilter === 'todas') return true;
        if (statusFilter === 'destacadas') return r.isFeatured;
        return r.status === statusFilter;
      })
      .filter((r) => {
        if (specialistFilter === 'all') return true;
        return r.specialistId === specialistFilter;
      })
      .filter((r) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          r.clientName.toLowerCase().includes(q) ||
          r.serviceTitle.toLowerCase().includes(q) ||
          r.comment.toLowerCase().includes(q)
        );
      });
  }, [reviews, statusFilter, specialistFilter, searchQuery]);

  // Aggregate stats
  const totalReviews = reviews.length;
  const pendingCount = reviews.filter((r) => r.status === 'pendiente').length;
  const approvedCount = reviews.filter((r) => r.status === 'aprobada').length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / totalReviews).toFixed(1) : '5.0';

  const fiveStarPercent = Math.round((reviews.filter((r) => r.rating === 5).length / Math.max(1, totalReviews)) * 100);
  const fourStarPercent = Math.round((reviews.filter((r) => r.rating === 4).length / Math.max(1, totalReviews)) * 100);

  const handleApprove = (id: string) => {
    updateReviewStatus(id, 'aprobada');
    setFeedbackToast('¡Reseña aprobada y publicada en el portal de clientas!');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleReject = (id: string) => {
    updateReviewStatus(id, 'rechazada');
    setFeedbackToast('Reseña rechazada y ocultada del portal público.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleToggleFeature = (id: string) => {
    toggleFeatureReview(id);
    setFeedbackToast('Estado de reseña destacada actualizado.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleSendReply = (reviewId: string) => {
    if (!replyText.trim()) return;
    replyToReview(reviewId, replyText.trim(), replyAuthor);
    setReplyingReviewId(null);
    setReplyText('');
    setFeedbackToast('Respuesta oficial del salón publicada en la reseña.');
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Header and Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#725b38] tracking-widest">
            <span className="material-symbols-outlined text-[16px] text-amber-500">verified</span>
            <span>Gestión de Reputación & Calidad</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
            Moderación de Reseñas & Fotos
          </h1>
          <p className="text-xs text-[#4c4640] mt-0.5">
            Supervisa las opiniones y fotografías de manicuras subidas por las clientas post-servicio.
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>{pendingCount} {pendingCount === 1 ? 'reseña pendiente' : 'reseñas pendientes'} de moderar</span>
          </div>
        )}
      </div>

      {/* Bento Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Rating Promedio */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Calificación Promedio
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">star</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-3xl font-bold text-[#1c1b1a]">{avgRating}</span>
              <span className="text-xs text-[#725b38] font-bold">/ 5.0</span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="material-symbols-outlined text-[15px] fill">star</span>
              ))}
            </div>
          </div>
        </div>

        {/* Reseñas Verificadas */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Total Reseñas
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] text-[#725b38] flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">rate_review</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#1c1b1a]">{totalReviews}</span>
            <span className="text-[11px] text-[#4c4640] block mt-0.5">{approvedCount} públicas en catálogo</span>
          </div>
        </div>

        {/* Pendientes de Moderación */}
        <div className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col justify-between transition-colors ${
          pendingCount > 0 ? 'bg-amber-50/60 border-amber-300' : 'bg-white border-[#cec5bd]/40'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
              Por Moderar
            </span>
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-amber-900">{pendingCount}</span>
            <span className="text-[11px] text-amber-800 block mt-0.5">Requieren revisión</span>
          </div>
        </div>

        {/* Tasa 5 Estrellas */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Satisfacción 5★
            </span>
            <div className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">thumb_up</span>
            </div>
          </div>
          <div>
            <span className="font-serif text-3xl font-bold text-[#1c1b1a]">{fiveStarPercent}%</span>
            <span className="text-[11px] text-green-700 font-semibold block mt-0.5">Excelente experiencia</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setStatusFilter('todas')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'todas' ? 'bg-[#1e1b18] text-white shadow-xs' : 'bg-[#f8f3f0] text-[#4c4640] hover:bg-[#f2edea]'
            }`}
          >
            Todas ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('pendiente')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'pendiente' ? 'bg-amber-600 text-white shadow-xs' : 'bg-[#f8f3f0] text-[#4c4640] hover:bg-[#f2edea]'
            }`}
          >
            Pendientes ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('aprobada')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'aprobada' ? 'bg-green-700 text-white shadow-xs' : 'bg-[#f8f3f0] text-[#4c4640] hover:bg-[#f2edea]'
            }`}
          >
            Aprobadas ({approvedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('destacadas')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'destacadas' ? 'bg-[#725b38] text-white shadow-xs' : 'bg-[#f8f3f0] text-[#4c4640] hover:bg-[#f2edea]'
            }`}
          >
            Destacadas
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('rechazada')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'rechazada' ? 'bg-red-700 text-white shadow-xs' : 'bg-[#f8f3f0] text-[#4c4640] hover:bg-[#f2edea]'
            }`}
          >
            Ocultas ({reviews.filter((r) => r.status === 'rechazada').length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <span className="material-symbols-outlined text-[18px] text-[#7d766f] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en comentarios o clienta..."
            className="w-full h-9 pl-9 pr-3 bg-[#f8f3f0] rounded-full text-xs text-[#1c1b1a] placeholder:text-[#7d766f] outline-none focus:ring-1 focus:ring-[#725b38]"
          />
        </div>
      </div>

      {/* Review Moderation Cards List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => {
          const isPending = review.status === 'pendiente';
          const isApproved = review.status === 'aprobada';
          const isRejected = review.status === 'rechazada';

          return (
            <article
              key={review.id}
              className={`bg-white rounded-2xl p-5 border shadow-xs space-y-4 transition-all ${
                isPending
                  ? 'border-amber-300 ring-1 ring-amber-200/60 bg-gradient-to-r from-amber-50/20 via-white to-white'
                  : 'border-[#cec5bd]/40'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {review.clientAvatar ? (
                    <img
                      src={review.clientAvatar}
                      alt={review.clientName}
                      className="w-11 h-11 rounded-full object-cover border border-[#cec5bd]/40 shrink-0 shadow-xs"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#f8f3f0] text-[#725b38] font-serif font-bold text-sm flex items-center justify-center border border-[#cec5bd]/40 shrink-0">
                      {review.clientName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-serif text-base font-bold text-[#1c1b1a]">
                        {review.clientName}
                      </h3>
                      {review.isVip && (
                        <span className="px-2 py-0.5 rounded-full bg-[#fedeb2] text-[#584323] text-[9px] font-bold uppercase tracking-wider">
                          VIP
                        </span>
                      )}
                      {review.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">star</span>
                          <span>Destacada</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#4c4640] mt-0.5">
                      <span>{review.serviceTitle}</span>
                      <span>•</span>
                      <span>Mesa de {review.specialistName}</span>
                      <span>•</span>
                      <span className="text-[#7d766f]">{review.dateStr}</span>
                    </div>
                  </div>
                </div>

                {/* Rating & Status Badge */}
                <div className="flex items-center sm:items-end flex-col gap-1">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((st) => (
                      <span
                        key={st}
                        className={`material-symbols-outlined text-[18px] ${
                          review.rating >= st ? 'text-amber-500 fill' : 'text-gray-300'
                        }`}
                      >
                        star
                      </span>
                    ))}
                    <span className="text-xs font-bold text-[#1c1b1a] ml-1 font-mono">
                      {review.rating}.0
                    </span>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      isApproved
                        ? 'bg-green-100 text-green-800'
                        : isPending
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isApproved ? 'Publicada' : isPending ? 'Pendiente Moderación' : 'Oculta'}
                  </span>
                </div>
              </div>

              {/* Aspect Ratings Strip */}
              {review.aspectRatings && (
                <div className="flex items-center gap-2 flex-wrap text-[11px] bg-[#f8f3f0] p-2.5 rounded-xl border border-[#cec5bd]/30">
                  <span className="text-[#725b38] font-bold uppercase text-[9px]">Puntajes:</span>
                  <span className="text-[#4c4640]">Técnica: <strong className="text-[#1c1b1a]">{review.aspectRatings.technique}★</strong></span>
                  <span>•</span>
                  <span className="text-[#4c4640]">Higiene: <strong className="text-[#1c1b1a]">{review.aspectRatings.hygiene}★</strong></span>
                  <span>•</span>
                  <span className="text-[#4c4640]">Trato: <strong className="text-[#1c1b1a]">{review.aspectRatings.service}★</strong></span>
                  <span>•</span>
                  <span className="text-[#4c4640]">Durabilidad: <strong className="text-[#1c1b1a]">{review.aspectRatings.durability}★</strong></span>
                </div>
              )}

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-[#1c1b1a] leading-relaxed italic bg-white">
                "{review.comment}"
              </p>

              {/* Manicure Photos Gallery */}
              {review.photos && review.photos.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
                    Fotos de Manicura Adjuntadas ({review.photos.length}) • Clic para ampliar
                  </span>
                  <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                    {review.photos.map((photoUrl, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setZoomedPhoto(photoUrl)}
                        className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#cec5bd]/40 shadow-xs shrink-0 group cursor-pointer"
                      >
                        <img
                          src={photoUrl}
                          alt="Manicura realizada"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                          <span className="material-symbols-outlined text-[20px]">zoom_in</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Salon Official Reply if present */}
              {review.adminReply && (
                <div className="bg-[#fdf8f5] p-3.5 rounded-2xl border border-[#fedeb2] space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#725b38] flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px]">reply</span>
                      <span>Respuesta de {review.adminReply.author}</span>
                    </span>
                    <span className="text-[10px] text-[#7d766f]">{review.adminReply.repliedAt}</span>
                  </div>
                  <p className="text-[#4c4640] leading-relaxed">
                    {review.adminReply.message}
                  </p>
                </div>
              )}

              {/* Reply Input Drawer if active */}
              {replyingReviewId === review.id && (
                <div className="bg-[#f8f3f0] p-4 rounded-2xl border border-[#cec5bd]/40 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1c1b1a]">
                      Responder a {review.clientName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setReplyingReviewId(null)}
                      className="text-[#7d766f] hover:text-[#1c1b1a]"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribe la respuesta oficial de L'Atelier Vernis (visible públicamente)..."
                    className="w-full p-3 bg-white rounded-xl border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38] resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={replyAuthor}
                      onChange={(e) => setReplyAuthor(e.target.value)}
                      className="h-8 px-3 rounded-lg bg-white border border-[#cec5bd]/40 text-[11px] text-[#4c4640] w-48"
                      title="Nombre del firmante"
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSendReply(review.id)}
                        className="px-4 py-1.5 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#32302e]"
                      >
                        Publicar Respuesta
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f2edea]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Approve */}
                  {!isApproved && (
                    <button
                      type="button"
                      onClick={() => handleApprove(review.id)}
                      className="px-3.5 py-1.5 rounded-full bg-green-700 hover:bg-green-800 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-xs transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">check</span>
                      <span>Aprobar Reseña</span>
                    </button>
                  )}

                  {/* Reject / Hide */}
                  {!isRejected && (
                    <button
                      type="button"
                      onClick={() => handleReject(review.id)}
                      className="px-3.5 py-1.5 rounded-full bg-[#f2edea] hover:bg-[#ece7e4] text-[#4c4640] text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility_off</span>
                      <span>Ocultar</span>
                    </button>
                  )}

                  {/* Feature */}
                  <button
                    type="button"
                    onClick={() => handleToggleFeature(review.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors ${
                      review.isFeatured
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-[#f8f3f0] hover:bg-[#f2edea] text-[#4c4640]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[15px] text-amber-500">
                      {review.isFeatured ? 'grade' : 'star_border'}
                    </span>
                    <span>{review.isFeatured ? 'Destacada' : 'Destacar'}</span>
                  </button>

                  {/* Reply Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setReplyingReviewId(review.id);
                      setReplyText(review.adminReply?.message || '');
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#f8f3f0] hover:bg-[#f2edea] text-[#1c1b1a] text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px] text-[#725b38]">reply</span>
                    <span>{review.adminReply ? 'Editar Respuesta' : 'Responder'}</span>
                  </button>
                </div>

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Eliminar definitivamente esta reseña?')) {
                      deleteReview(review.id);
                    }
                  }}
                  className="p-1.5 rounded-full text-[#7d766f] hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Eliminar reseña"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </article>
          );
        })}

        {filteredReviews.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#cec5bd]/40 space-y-2">
            <span className="material-symbols-outlined text-[36px] text-[#725b38]">filter_list_off</span>
            <h3 className="font-serif text-lg font-bold text-[#1c1b1a]">No se encontraron reseñas</h3>
            <p className="text-xs text-[#4c4640]">
              No hay opiniones que coincidan con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>

      {/* High-Resolution Photo Zoom Modal */}
      {zoomedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setZoomedPhoto(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <img src={zoomedPhoto} alt="Zoom Manicura" className="w-full h-full object-contain" />
            <button
              type="button"
              onClick={() => setZoomedPhoto(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-10 left-4 right-4 max-w-sm mx-auto z-50 bg-[#1e1b18] text-white p-3.5 rounded-2xl shadow-xl border border-[#fedeb2]/40 flex items-center gap-3 animate-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-[#fedeb2] text-[20px]">verified</span>
          <span className="text-xs font-medium">{feedbackToast}</span>
        </div>
      )}
    </div>
  );
};
