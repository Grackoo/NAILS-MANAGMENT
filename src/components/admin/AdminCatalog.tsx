import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ServiceCategory, ServiceItem } from '../../types';

export const AdminCatalog: React.FC = () => {
  const { services, addService, deleteService, toggleServiceStatus, updateService } = useStudio();

  // Filters
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activos' | 'borradores'>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal Drawer state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSubtitle, setNewSubtitle] = useState<string>('');
  const [newPrice, setNewPrice] = useState<string>('45.00');
  const [newDuration, setNewDuration] = useState<string>('75');
  const [newCategory, setNewCategory] = useState<ServiceCategory>('acrilicas');
  const [newFormula, setNewFormula] = useState<string>('');
  const [publishImmediate, setPublishImmediate] = useState<boolean>(true);
  const [selectedImagePreset, setSelectedImagePreset] = useState<string>(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDSxyB-VQn-YcWYbQ-uj8d4upxMMa-fQHvxyBNlyW-r5XvM_c4MS5n_V_9X69J5ZUtTrjSWs1S_mfp0o5H0uFS9cxvX1aHzuBLLxXfeKi8_x2m7h2EkQZXQptrCMTEao-mSQcch-YixOYIFxMvKQcpHZr8U8IfWZSQ4giAXMnUik7mbIoeLLCqXVY1Y7SfFPooTemRuLC1UH-cbc5St2v3hzexUgeQks4ECcNerY_bdW1pSS0d8Vw'
  );

  // Available sample high-fashion nail images to pick from
  const sampleImages = [
    {
      label: 'Baby Boomer Glaze',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSxyB-VQn-YcWYbQ-uj8d4upxMMa-fQHvxyBNlyW-r5XvM_c4MS5n_V_9X69J5ZUtTrjSWs1S_mfp0o5H0uFS9cxvX1aHzuBLLxXfeKi8_x2m7h2EkQZXQptrCMTEao-mSQcch-YixOYIFxMvKQcpHZr8U8IfWZSQ4giAXMnUik7mbIoeLLCqXVY1Y7SfFPooTemRuLC1UH-cbc5St2v3hzexUgeQks4ECcNerY_bdW1pSS0d8Vw',
    },
    {
      label: 'Francés Perla Nácar',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy2S0qtNDV6BvTeDZmTz9mZ-EmvroLYmXyll5IxSkWNEudQZdik5RYHZPU7385RIAoHVp1gyWPKy1Y4DneVqqgJCARYR5fv1qsI93s6mCQadnT-I0Qis9Ec0E8o9wyKh7xH-_2_AAw_Yx3gunTSTOOONlVV7kK97LqKeJuVLBiXBmguJ53gLqi4OLEKJRQXW9Nsm5SXV_EntQzlesE3q0cX0GqH5Wyctv5I_gUraFwvyt_F0ZVlw',
    },
    {
      label: 'Glitter Gold 24K',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvch3E4pKHQMoZbyiscRigB2pWiJ-rXkeD6tszoYtyMwbTuH5nlrChaCsDvMXQ0_we3FP3T6E8KFZR9rDWQzSrsVxs4c16sY2BWbQlWhUwve2wI-ShSK3-CDbNY4oHVN00X76Qf8clSpvOb9agSf5LmkFqDO4Z9_9rPGnHhP45_TnQfvaIg6QKfp4_-ba3WTFXPjt_NSwOOwCfVNBaQ5gzqGP9YjplypAR2FelalkR9TtAnURDsw',
    },
    {
      label: 'Velvet Cat Eye 9D',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqIVb7tutzrP7h31xGJVeizZXwYMa2Wh_dUpbfJcmlt-Un8DVr3lDeWBK02jFHBo82lVbz6S0Dv0CMG6Pc-RgLn2q_YHqrA-UdyaypsxnMIcKevMZK2_b4PSLobnDTpG5Cv_j8HER8fOKesaeWCQThK-PZqmQuIxz587XFflIXNARC2fIlXKFXx3TrszVwDhlqCd84r1nfYuIeCAqE8wMja0LlFD4Z4GOT11avjaqDR1Ufuq-oXw',
    },
  ];

  // Filtering
  const filteredServices = services
    .filter((s) => {
      if (statusFilter === 'activos') return s.status === 'activo';
      if (statusFilter === 'borradores') return s.status === 'borrador';
      return true;
    })
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

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredServices.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Por favor ingrese el título del trabajo.');
      return;
    }

    const categoryLabels: Record<ServiceCategory, string> = {
      acrilicas: 'Acrílico Esculpido',
      rusa: 'Manicura Rusa',
      'soft-gel': 'Soft Gel',
      'nail-art': 'Nail Art 3D',
      spa: 'Spa & Pedicura',
    };

    addService({
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Técnica Signature de Atelier',
      category: newCategory,
      categoryLabel: categoryLabels[newCategory],
      durationMinutes: parseInt(newDuration) || 75,
      price: parseFloat(newPrice) || 45.0,
      image: selectedImagePreset,
      status: publishImmediate ? 'activo' : 'borrador',
      formulaNotes: newFormula.trim() || undefined,
    });

    // Reset and close
    setNewTitle('');
    setNewSubtitle('');
    setShowUploadModal(false);
  };

  return (
    <div className="flex flex-col w-full space-y-6">
      {/* Editorial Header & Strategic Suite */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="flex flex-col max-w-2xl">
          <div className="flex items-center gap-1.5 text-[#725b38] text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Atelier Haute Beauté • Curaduría</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a] tracking-tight">
            Catálogo de Diseños & Precios
          </h1>
          <p className="text-xs text-[#4c4640] leading-relaxed mt-1">
            Administra fotos de alta resolución en cabina, tarifas por set exclusivo, duración del protocolo y visibilidad pública en el portal de reservas directas.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => alert('Catálogo exportado en PDF / Lookbook Digital')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f2edea] text-[#1c1b1a] text-xs font-semibold border border-[#cec5bd]/40 shadow-xs transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-[#4c4640]">download</span>
            <span>Exportar Catálogo</span>
          </button>
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add_a_photo</span>
            <span>+ Subir Nuevo Trabajo</span>
          </button>
        </div>
      </section>

      {/* Metric Bento Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Servicios Disponibles
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#1c1b1a]">
              <span className="material-symbols-outlined text-[18px]">palette</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-[#1c1b1a]">{services.length}</span>
              <span className="text-xs text-[#725b38] font-semibold">sets creados</span>
            </div>
            <div className="text-[11px] text-[#4c4640] mt-1">
              <span>{services.filter((s) => s.status === 'activo').length} activos</span> •{' '}
              <span>{services.filter((s) => s.status === 'borrador').length} borradores</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Diseño Más Solicitado
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#fedeb2] text-[#584323] text-[9px] uppercase font-bold">
              Estrella
            </span>
          </div>
          <div>
            <h4 className="font-serif text-base font-bold text-[#1c1b1a] truncate">Baby Boomer Glaze</h4>
            <div className="flex items-center justify-between text-[11px] text-[#4c4640] mt-1">
              <span>78 reservas este mes</span>
              <span className="text-[#725b38] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +18%
              </span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Ingreso Estimado Catálogo
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#1c1b1a]">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-[#1c1b1a]">$4,850</span>
              <span className="text-xs text-[#4c4640]">MXN / mes</span>
            </div>
            <p className="text-[11px] text-[#4c4640] mt-1">
              Ticket promedio: <span className="font-bold text-[#1c1b1a]">$52.40 MXN</span>
            </p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#4c4640] tracking-wider">
              Visualizaciones del Mes
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f8f3f0] flex items-center justify-center text-[#725b38]">
              <span className="material-symbols-outlined text-[18px]">visibility</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-2xl font-bold text-[#1c1b1a]">1,840</span>
              <span className="text-xs text-[#4c4640]">visitas únicas</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#4c4640] mt-1">
              <span>Tasa de conversión</span>
              <span className="text-[#725b38] font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +14%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Status segmented pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f8f3f0] rounded-full border border-[#cec5bd]/30 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setStatusFilter('todos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'todos'
                ? 'bg-white text-[#1c1b1a] shadow-xs'
                : 'text-[#4c4640] hover:text-[#1c1b1a]'
            }`}
          >
            Todos ({services.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('activos')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'activos'
                ? 'bg-white text-[#1c1b1a] shadow-xs'
                : 'text-[#4c4640] hover:text-[#1c1b1a]'
            }`}
          >
            Activos ({services.filter((s) => s.status === 'activo').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('borradores')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
              statusFilter === 'borradores'
                ? 'bg-white text-[#1c1b1a] shadow-xs'
                : 'text-[#4c4640] hover:text-[#1c1b1a]'
            }`}
          >
            Borradores ({services.filter((s) => s.status === 'borrador').length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7d766f] text-[18px] pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por técnica, diseño o acabado..."
              className="w-full h-9 pl-9 pr-3 bg-[#f8f3f0] border border-[#cec5bd]/40 rounded-full text-xs text-[#1c1b1a] placeholder:text-[#7d766f] outline-none focus:bg-white focus:ring-1 focus:ring-[#725b38]"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 pl-3 pr-8 bg-[#f8f3f0] border border-[#cec5bd]/40 rounded-full text-xs text-[#1c1b1a] appearance-none outline-none cursor-pointer focus:ring-1 focus:ring-[#725b38]"
            >
              <option value="all">Todas las Técnicas</option>
              <option value="acrilicas">Acrílico Esculpido</option>
              <option value="rusa">Manicura Rusa / Dry</option>
              <option value="soft-gel">Soft Gel</option>
              <option value="nail-art">Nail Art 3D</option>
              <option value="spa">Spa & Pedicura</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-[#7d766f] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
              expand_more
            </span>
          </div>
        </div>
      </section>

      {/* Services Table List */}
      <section className="bg-white rounded-2xl border border-[#cec5bd]/40 shadow-xs overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="bg-[#f8f3f0] text-[#4c4640] text-[10px] font-bold uppercase tracking-wider border-b border-[#cec5bd]/30">
                <th className="w-12 py-3 pl-4 pr-1">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredServices.length && filteredServices.length > 0}
                    onChange={handleSelectAll}
                    className="accent-[#1e1b18] w-4 h-4 rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4 min-w-[260px]">Diseño / Tratamiento</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4">Duración</th>
                <th className="py-3 px-4 text-right">Tarifa Base</th>
                <th className="py-3 px-4 min-w-[160px]">Rendimiento (Mes)</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 pr-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2edea] text-xs">
              {filteredServices.map((service) => {
                const isSelected = selectedIds.includes(service.id);
                const isBorrador = service.status === 'borrador';

                return (
                  <tr
                    key={service.id}
                    className={`hover:bg-[#f8f3f0]/70 transition-colors ${
                      isBorrador ? 'opacity-80 hover:opacity-100' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3.5 pl-4 pr-1 align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(service.id)}
                        className="accent-[#1e1b18] w-4 h-4 rounded cursor-pointer"
                      />
                    </td>

                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#f2edea] shrink-0 border border-[#cec5bd]/30 shadow-xs">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                          {service.tag && (
                            <span className="absolute top-1 left-1 px-1 py-0.2 rounded-full bg-[#fedeb2] text-[#584323] text-[8px] font-bold uppercase tracking-wider">
                              {service.tag}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-serif text-sm font-semibold text-[#1c1b1a] truncate">
                            {service.title}
                          </span>
                          <span className="text-[11px] text-[#4c4640] truncate">{service.subtitle}</span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 align-middle">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#f2edea] text-[#1c1b1a] text-[10px] font-semibold">
                        {service.categoryLabel}
                      </span>
                    </td>

                    {/* Duration */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex items-center gap-1 text-[#4c4640]">
                        <span className="material-symbols-outlined text-[15px] text-[#725b38]">schedule</span>
                        <span>{service.durationMinutes} min</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 align-middle text-right">
                      <span className="font-serif text-sm font-bold text-[#1c1b1a]">
                        ${service.price.toFixed(2)}
                      </span>
                    </td>

                    {/* Performance Progress */}
                    <td className="py-3.5 px-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-[#1c1b1a]">{service.monthlyBookings} citas</span>
                          <span className="text-[#4c4640]">{service.monthlyViews} vistas</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-[#f2edea] overflow-hidden">
                          <div
                            className="h-full bg-[#725b38] rounded-full"
                            style={{
                              width: `${Math.min(100, Math.max(15, (service.monthlyBookings / 90) * 100))}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 align-middle text-center">
                      <button
                        type="button"
                        onClick={() => toggleServiceStatus(service.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          service.status === 'activo'
                            ? 'bg-[#fedeb2]/60 text-[#584323] hover:bg-[#fedeb2]'
                            : 'bg-[#f2edea] text-[#4c4640] hover:bg-[#e6e2df]'
                        }`}
                        title="Haz clic para alternar visibilidad"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            service.status === 'activo' ? 'bg-[#725b38]' : 'bg-[#7d766f]'
                          }`}
                        ></span>
                        <span>{service.status === 'activo' ? 'Activo' : 'Borrador'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pr-4 align-middle text-right">
                      <div className="inline-flex items-center gap-1 text-[#4c4640]">
                        <button
                          type="button"
                          onClick={() => toggleServiceStatus(service.id)}
                          className="p-1 rounded-full hover:bg-[#f2edea] hover:text-[#1c1b1a] transition-colors"
                          title={service.status === 'activo' ? 'Ocultar servicio' : 'Activar servicio'}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {service.status === 'activo' ? 'visibility' : 'visibility_off'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteService(service.id)}
                          className="p-1 rounded-full hover:bg-red-50 text-[#7d766f] hover:text-red-700 transition-colors"
                          title="Eliminar servicio"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Floating / Drawer Modal: "Subir Nuevo Trabajo" */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#fdf8f5] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[#cec5bd]/50 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#f2edea]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
                  Curaduría Atelier
                </span>
                <h2 className="font-serif text-xl font-bold text-[#1c1b1a]">Subir Nuevo Trabajo</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-[#f2edea] text-[#4c4640] hover:text-[#1c1b1a] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* Photo Selection Preview */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#4c4640] block">
                Fotografía del Set (Formato Alta Resolución)
              </label>

              {/* Main Preview with Image Preset Selector */}
              <div className="relative h-40 rounded-xl overflow-hidden bg-[#f2edea] border border-[#cec5bd]/40">
                <img
                  src={selectedImagePreset}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                  <span className="text-white text-xs font-semibold">Foto Seleccionada para Cabina</span>
                </div>
              </div>

              {/* Presets Grid */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {sampleImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImagePreset(img.url)}
                    className={`h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImagePreset === img.url
                        ? 'border-[#725b38] ring-2 ring-[#fedeb2]'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleCreateService} className="space-y-3 pt-1">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4c4640]">Título del Trabajo</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="ej. Acrílico Almendra Baby Boomer"
                  className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4c4640]">Subtítulo / Técnica Breve</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="ej. Manicura Rusa • Puntas Nácar Iridiscente"
                  className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4c4640]">Precio ($ MXN)</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#7d766f] text-xs font-semibold">$</span>
                    <input
                      type="number"
                      step="0.5"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="45.00"
                      className="w-full h-10 pl-7 pr-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-[#4c4640]">Duración Estimada</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      required
                      value={newDuration}
                      onChange={(e) => setNewDuration(e.target.value)}
                      placeholder="75"
                      className="w-full h-10 pl-3 pr-10 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
                    />
                    <span className="absolute right-3 text-[#7d766f] text-xs">min</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4c4640]">Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ServiceCategory)}
                  className="w-full h-10 px-3 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
                >
                  <option value="acrilicas">Acrílicas de Autor</option>
                  <option value="rusa">Manicura Rusa Restauradora</option>
                  <option value="soft-gel">Soft Gel & Tips</option>
                  <option value="nail-art">Nail Art 3D & Pedrería</option>
                  <option value="spa">Spa & Pedicura</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-[#4c4640]">Fórmula & Preparación (Opcional)</label>
                <textarea
                  rows={2}
                  value={newFormula}
                  onChange={(e) => setNewFormula(e.target.value)}
                  placeholder="Códigos de esmaltes, preparadores deshidratadores, tipo de base..."
                  className="w-full p-2.5 rounded-xl bg-white border border-[#cec5bd]/40 text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38] resize-none"
                />
              </div>

              {/* Instant Publish Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f3f0] border border-[#cec5bd]/30">
                <div>
                  <span className="text-xs font-semibold text-[#1c1b1a] block">
                    Publicar en el feed de clientas
                  </span>
                  <span className="text-[10px] text-[#4c4640]">
                    Será visible para agendamiento al instante
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={publishImmediate}
                  onChange={(e) => setPublishImmediate(e.target.checked)}
                  className="accent-[#725b38] w-5 h-5 cursor-pointer"
                />
              </div>

              {/* Modal Actions */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPublishImmediate(false);
                    handleCreateService({ preventDefault: () => {} } as React.FormEvent);
                  }}
                  className="h-11 rounded-full bg-[#f2edea] text-[#1c1b1a] text-xs font-bold uppercase tracking-wider hover:bg-[#ece7e4] transition-colors"
                >
                  Guardar Borrador
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-full bg-[#1e1b18] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#32302e] shadow-md transition-colors"
                >
                  Publicar Trabajo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
