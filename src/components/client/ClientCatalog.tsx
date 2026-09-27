import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ServiceCategory, ServiceItem } from '../../types';
import { AddReviewModal } from '../modals/AddReviewModal';

export const ClientCatalog: React.FC = () => {
  const { services, bookServiceQuick, setClientTab, loyaltyProfile, reviews } = useStudio();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewService, setPreviewService] = useState<ServiceItem | null>(null);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [catalogToast, setCatalogToast] = useState<string | null>(null);

  const approvedReviews = reviews.filter((r) => r.status === 'aprobada');

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'Todos los Sets' },
    { key: 'acrilicas', label: 'Acrílico Esculpido' },
    { key: 'rusa', label: 'Manicura Rusa' },
    { key: 'soft-gel', label: 'Soft Gel' },
    { key: 'nail-art', label: 'Nail Art 3D' },
    { key: 'spa', label: 'Spa & Pedicura' },
  ];

  // Active services
  const filteredServices = services
    .filter((s) => s.status === 'activo')
    .filter((s) => {
      if (selectedCategory === 'all') return true;
      return s.category === (selectedCategory as ServiceCategory);
    })
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.subtitle.toLowerCase().includes(q) ||
        s.categoryLabel.toLowerCase().includes(q)
      );
    });

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 max-w-md md:max-w-4xl mx-auto space-y-6 pb-28 pt-3">
      {/* Intro Header */}
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-[#725b38] font-bold">
          Haute Beauté • Curaduría Exclusiva
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
          Catálogo de Diseños & Servicios
        </h1>
        <p className="text-xs text-[#4c4640] leading-relaxed">
          Técnicas de manicura de autor inspiradas en la elegancia parisina. Elige tu ritual y reserva tu cita.
        </p>
      </div>

      {/* Points Privilège Quick Strip */}
      <div className="bg-gradient-to-r from-[#1e1b18] via-[#2c2724] to-[#1e1b18] text-white p-3 rounded-2xl border border-[#fedeb2]/30 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-[18px]">stars</span>
          <div>
            <span className="font-semibold block text-[#fedeb2]">
              Club Privilège: {loyaltyProfile.pointsBalance} pts acumulados
            </span>
            <span className="text-[10px] text-white/70">
              Acumula 10 pts por cada $1 MXN y canjea hasta $40 MXN de descuento
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setClientTab('puntos')}
          className="px-3 py-1 rounded-full bg-[#fedeb2] text-[#1e1b18] text-[10px] font-bold uppercase tracking-wider hover:bg-amber-200 transition-colors shrink-0"
        >
          Canjear
        </button>
      </div>

      {/* Search Input */}
      <div className="relative flex items-center w-full">
        <span className="material-symbols-outlined absolute left-3.5 text-[#7d766f] text-[20px]">
          search
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar diseño, acabado o técnica..."
          className="w-full h-11 pl-10 pr-4 rounded-full bg-white border border-[#cec5bd]/40 text-[#1c1b1a] placeholder:text-[#7d766f] text-xs font-medium shadow-xs focus:outline-none focus:ring-1 focus:ring-[#725b38]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-[#7d766f] hover:text-[#1c1b1a]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                isSelected
                  ? 'bg-[#1e1b18] text-white shadow-xs'
                  : 'bg-white text-[#4c4640] border border-[#cec5bd]/40 hover:bg-[#f2edea]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredServices.map((service) => (
          <article
            key={service.id}
            className="bg-white rounded-2xl p-4 border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between space-y-3 hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className="flex gap-3.5">
              {/* Thumbnail with Badge */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#f2edea] shrink-0 border border-[#cec5bd]/30 shadow-xs">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {service.tag && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[#725b38] font-bold text-[9px] uppercase tracking-wider shadow-xs">
                    {service.tag}
                  </span>
                )}
              </div>

              {/* Service Info */}
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-[#fedeb2] text-[#584323] text-[9px] uppercase font-bold tracking-wider">
                      {service.categoryLabel}
                    </span>
                    <span className="font-serif text-lg font-bold text-[#1c1b1a]">
                      ${service.price.toFixed(2)}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#1c1b1a] truncate group-hover:text-[#725b38] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-[#4c4640] line-clamp-2 mt-0.5">
                    {service.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#4c4640] pt-1">
                  <div className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#725b38]">schedule</span>
                    <span>{service.durationMinutes} min</span>
                  </div>
                  <span className="text-[#cec5bd]">•</span>
                  <div className="inline-flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-[#725b38]">visibility</span>
                    <span>{service.monthlyViews} vistas</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f2edea]">
              <button
                type="button"
                onClick={() => setPreviewService(service)}
                className="text-xs text-[#725b38] hover:text-[#1c1b1a] font-semibold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Ver Detalles</span>
              </button>

              <button
                type="button"
                onClick={() => bookServiceQuick(service)}
                className="h-9 px-4 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
              >
                <span>Agendar Cita</span>
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              </button>
            </div>
          </article>
        ))}

        {filteredServices.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl p-8 text-center border border-[#cec5bd]/40 space-y-2">
            <span className="material-symbols-outlined text-[32px] text-[#725b38]">search_off</span>
            <p className="text-sm font-semibold text-[#1c1b1a]">No encontramos servicios con esos filtros</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-xs text-[#725b38] font-bold underline"
            >
              Restablecer filtros
            </button>
          </div>
        )}
      </div>

      {/* Customer Reviews & Photos Teaser Banner */}
      <div className="bg-gradient-to-br from-[#1e1b18] via-[#2a2623] to-[#1e1b18] text-white rounded-3xl p-5 sm:p-6 border border-[#fedeb2]/30 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#fedeb2] tracking-widest">
              <span className="material-symbols-outlined text-[16px] text-amber-400">verified</span>
              <span>Opiniones Reales de Nuestras Clientas</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              ¿Quieres ver los acabados reales en cabina?
            </h3>
            <p className="text-xs text-white/80 max-w-xl">
              Explora las {approvedReviews.length} reseñas verificadas con fotos de manicura subidas directamente por nuestras clientas o califica tu cita para recibir +100 Puntos Vernis Privilège.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setClientTab('trabajos')}
              className="px-4 py-2.5 rounded-full bg-[#fedeb2] hover:bg-amber-200 text-[#1e1b18] text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              <span>Ver Fotos & Reseñas</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddReviewOpen(true)}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">rate_review</span>
              <span>Dejar Reseña</span>
            </button>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {previewService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fdf8f5] w-full max-w-md rounded-2xl p-5 shadow-2xl border border-[#cec5bd]/50 space-y-4">
            <div className="relative h-48 rounded-xl overflow-hidden">
              <img
                src={previewService.image}
                alt={previewService.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setPreviewService(null)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest">
                  {previewService.categoryLabel}
                </span>
                <span className="font-serif text-xl font-bold text-[#1c1b1a]">
                  ${previewService.price.toFixed(2)}
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#1c1b1a] mt-1">{previewService.title}</h2>
              <p className="text-xs text-[#4c4640] mt-1">{previewService.subtitle}</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-[#cec5bd]/30 text-xs space-y-1">
              <span className="text-[10px] uppercase font-bold text-[#725b38]">Protocolo & Duración</span>
              <div className="flex items-center justify-between text-[#1c1b1a] font-medium">
                <span>Tiempo en Cabina:</span>
                <span>{previewService.durationMinutes} minutos</span>
              </div>
              <div className="flex items-center justify-between text-[#1c1b1a] font-medium">
                <span>Especialistas recomendadas:</span>
                <span>Valeria M. / Camila R.</span>
              </div>
            </div>

            {previewService.formulaNotes && (
              <div className="bg-[#f8f3f0] p-3 rounded-xl border border-[#cec5bd]/30 text-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#725b38]">Fórmula Técnica Signature</span>
                <p className="text-[#4c4640] italic leading-relaxed">{previewService.formulaNotes}</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                const s = previewService;
                setPreviewService(null);
                bookServiceQuick(s);
              }}
              className="w-full h-11 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:bg-[#32302e] transition-colors"
            >
              <span>Reservar Este Tratamiento</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal Dejar Reseña */}
      {isAddReviewOpen && (
        <AddReviewModal
          onClose={() => setIsAddReviewOpen(false)}
          onSuccess={() => {
            setIsAddReviewOpen(false);
            setCatalogToast('¡Gracias por tu opinión y fotos! Tu reseña ha sido enviada para moderación.');
            setTimeout(() => setCatalogToast(null), 4000);
          }}
        />
      )}

      {/* Toast Feedback */}
      {catalogToast && (
        <div className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50 bg-[#1e1b18] text-white p-3.5 rounded-2xl shadow-xl border border-[#fedeb2]/40 flex items-center gap-3 animate-in slide-in-from-bottom">
          <span className="material-symbols-outlined text-amber-400 text-[20px]">verified</span>
          <span className="text-xs font-medium">{catalogToast}</span>
        </div>
      )}
    </div>
  );
};
