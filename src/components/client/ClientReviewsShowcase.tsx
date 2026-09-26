import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { AddReviewModal } from '../modals/AddReviewModal';

export const ClientReviewsShowcase: React.FC = () => {
  const { reviews } = useStudio();
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | 'all'>('all');
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState<boolean>(false);
  const [zoomedPhoto, setZoomedPhoto] = useState<string | null>(null);

  // Client view only displays approved reviews (plus featured ones on top)
  const approvedReviews = reviews.filter((r) => r.status === 'aprobada');

  const filteredReviews = approvedReviews.filter((r) => {
    if (selectedRatingFilter === 'all') return true;
    return r.rating === selectedRatingFilter;
  });

  const avgRating =
    approvedReviews.length > 0
      ? (approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length).toFixed(1)
      : '5.0';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#cec5bd]/40 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f2edea]">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#725b38] tracking-widest">
            <span className="material-symbols-outlined text-[16px] text-amber-500">stars</span>
            <span>Experiencias Verificadas</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1b1a]">
            Reseñas & Fotos de Nuestras Clientas
          </h2>
          <p className="text-xs text-[#4c4640] mt-0.5">
            Descubre los resultados de manicuras y pedicuras capturados por quienes nos visitan.
          </p>
        </div>

        {/* CTA to leave review */}
        <button
          type="button"
          onClick={() => setIsAddReviewModalOpen(true)}
          className="self-start sm:self-center px-4 py-2 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all shrink-0 active:scale-95"
        >
          <span className="material-symbols-outlined text-[16px] text-[#fedeb2]">rate_review</span>
          <span>Calificar Servicio (+100 pts)</span>
        </button>
      </div>

      {/* Rating summary bar */}
      <div className="bg-[#f8f3f0] p-4 rounded-2xl border border-[#cec5bd]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="text-center px-3 py-1 bg-white rounded-xl border border-[#cec5bd]/30 shadow-2xs">
            <span className="font-serif text-2xl font-bold text-[#1c1b1a] block leading-none">{avgRating}</span>
            <span className="text-[10px] text-[#725b38] font-bold">de 5.0</span>
          </div>
          <div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="material-symbols-outlined text-[17px] fill">star</span>
              ))}
            </div>
            <span className="text-[11px] text-[#4c4640] block mt-0.5">
              Basado en <strong>{approvedReviews.length} opiniones verificadas</strong> con fotos
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase text-[#725b38]">Filtrar:</span>
          <button
            type="button"
            onClick={() => setSelectedRatingFilter('all')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              selectedRatingFilter === 'all'
                ? 'bg-[#1e1b18] text-white shadow-2xs'
                : 'bg-white text-[#4c4640] border border-[#cec5bd]/40'
            }`}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setSelectedRatingFilter(5)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              selectedRatingFilter === 5
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white text-[#4c4640] border border-[#cec5bd]/40'
            }`}
          >
            5 Estrellas
          </button>
          <button
            type="button"
            onClick={() => setSelectedRatingFilter(4)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
              selectedRatingFilter === 4
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-white text-[#4c4640] border border-[#cec5bd]/40'
            }`}
          >
            4 Estrellas
          </button>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReviews.map((review) => (
          <div
            key={review.id}
            className="p-4 rounded-2xl bg-[#fdf8f5] border border-[#cec5bd]/40 shadow-2xs flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  {review.clientAvatar ? (
                    <img
                      src={review.clientAvatar}
                      alt={review.clientName}
                      className="w-9 h-9 rounded-full object-cover border border-[#cec5bd]/40 shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#f2edea] text-[#725b38] font-serif font-bold text-xs flex items-center justify-center border border-[#cec5bd]/40 shrink-0">
                      {review.clientName.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif text-sm font-bold text-[#1c1b1a]">{review.clientName}</h4>
                      {review.isVip && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#fedeb2] text-[#584323] text-[8px] font-bold uppercase">
                          VIP
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#725b38] block font-medium">
                      {review.serviceTitle} • {review.specialistName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <span
                      key={st}
                      className={`material-symbols-outlined text-[15px] ${
                        review.rating >= st ? 'fill' : 'text-gray-300'
                      }`}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-xs text-[#1c1b1a] leading-relaxed mt-2.5 italic">
                "{review.comment}"
              </p>

              {/* Customer Photos */}
              {review.photos && review.photos.length > 0 && (
                <div className="flex items-center gap-2 mt-2.5 overflow-x-auto no-scrollbar">
                  {review.photos.map((pUrl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setZoomedPhoto(pUrl)}
                      className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#cec5bd]/40 shrink-0 group cursor-pointer"
                    >
                      <img src={pUrl} alt="Foto de clienta" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Salon reply if exists */}
            {review.adminReply && (
              <div className="bg-white p-2.5 rounded-xl border border-[#fedeb2] text-[11px] space-y-0.5">
                <span className="font-bold text-[#725b38] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">reply</span>
                  <span>{review.adminReply.author}</span>
                </span>
                <p className="text-[#4c4640] italic leading-tight">
                  {review.adminReply.message}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal to add review */}
      {isAddReviewModalOpen && (
        <AddReviewModal
          onClose={() => setIsAddReviewModalOpen(false)}
          onSuccess={() => setIsAddReviewModalOpen(false)}
        />
      )}

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
    </div>
  );
};
