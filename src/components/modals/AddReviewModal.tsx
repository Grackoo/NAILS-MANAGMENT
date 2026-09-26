import React, { useState, useRef } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Appointment } from '../../types';

interface AddReviewModalProps {
  appointment?: Appointment;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  appointment,
  onClose,
  onSuccess,
}) => {
  const { services, specialists, addReview } = useStudio();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const [aspectRatings, setAspectRatings] = useState({
    technique: 5,
    hygiene: 5,
    service: 5,
    durability: 5,
  });

  const [serviceId, setServiceId] = useState<string>(
    appointment?.serviceId || services[0]?.id || 'serv-1'
  );
  const [specialistId, setSpecialistId] = useState<string>(
    appointment?.specialistId || specialists[0]?.id || 'valeria'
  );

  const [comment, setComment] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDFd7WnQW3h4L700oU9_b06pSvhGq5c20q0WkGg5h6x5q1c1-4t9v2r8e3m0w9_8v7x6y5z4a3b2c1d0e',
  ]);

  const [clientName, setClientName] = useState<string>(
    appointment?.clientName || 'Elena Rostova'
  );

  const samplePhotoPresets = [
    {
      title: 'Acrílico Francés',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsScb1PH9p0A1yCa_NtC4KHXUMuzR1Hm6gXPhRmFQUgvnWw01J5y33tKAVpC8vpneDmxxDVLg-xKXdv1P9MG5IWLRDB0o9UxheKZpde3pC_QI7Vp-dRfYAevI-cntSvEDVIHCt11FQtLef5jYP5xZaa2X9fNXf1l6VtfTTdUxrLUorKjb0LXmEUya6SmxrXTMHgcyONpJNqkPqfYxa4SvGueXc7nAp2lPHo8Py1Ctcwct2dY8XPw',
    },
    {
      title: 'Gold Flakes',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPECYzXt5va_ql4By6_DeOlXxY5kce9jZk9hvenogXweLqeREWkcbk2XmwdQqySR1sgEIMNPvz70feOLUPgkYrOrzN6HvOsUPUHMqDC75ZMpAVJdOk44_eM-gO0gNoX8oQDN8SAGe7CTh2oxTNuaaN5HW3ctGzbULiHe0rnwBezdgv6ljpc1umUBqD2yY6KBOIBBTjzxACdmMj9BrB34JDQaQGejvpf0wf0ympffIdaA3c50EnUg',
    },
    {
      title: 'Baby Boomer',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy2S0qtNDV6BvTeDZmTz9mZ-EmvroLYmXyll5IxSkWNEudQZdik5RYHZPU7385RIAoHVp1gyWPKy1Y4DneVqqgJCARYR5fv1qsI93s6mCQadnT-I0Qis9Ec0E8o9wyKh7xH-_2_AAw_Yx3gunTSTOOONlVV7kK97LqKeJuVLBiXBmguJ53gLqi4OLEKJRQXW9Nsm5SXV_EntQzlesE3q0cX0GqH5Wyctv5I_gUraFwvyt_F0ZVlw',
    },
  ];

  const ratingLabels: { [key: number]: string } = {
    1: 'Regular',
    2: 'Aceptable',
    3: 'Bueno',
    4: 'Muy Bueno',
    5: '¡Experiencia Excepcional!',
  };

  const selectedServiceObj = services.find((s) => s.id === serviceId) || services[0];
  const selectedSpecialistObj = specialists.find((s) => s.id === specialistId) || specialists[0];

  const handleFilesSelected = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);

    const validFiles = Array.from(fileList).filter((file) => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
      setUploadError('Por favor selecciona archivos de imagen válidos (JPG, PNG, WebP).');
      return;
    }

    validFiles.forEach((file) => {
      if (file.size > 8 * 1024 * 1024) {
        setUploadError('Una de las fotos supera 8MB. Te sugerimos subir una foto más ligera.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPhotos((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddPhotoPreset = (url: string) => {
    if (!photos.includes(url)) {
      setPhotos((prev) => [...prev, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert('Por favor escribe tu opinión para completar la reseña.');
      return;
    }

    addReview({
      clientName: clientName.trim(),
      clientAvatar:
        appointment?.clientAvatar ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCsScb1PH9p0A1yCa_NtC4KHXUMuzR1Hm6gXPhRmFQUgvnWw01J5y33tKAVpC8vpneDmxxDVLg-xKXdv1P9MG5IWLRDB0o9UxheKZpde3pC_QI7Vp-dRfYAevI-cntSvEDVIHCt11FQtLef5jYP5xZaa2X9fNXf1l6VtfTTdUxrLUorKjb0LXmEUya6SmxrXTMHgcyONpJNqkPqfYxa4SvGueXc7nAp2lPHo8Py1Ctcwct2dY8XPw',
      isVip: true,
      appointmentId: appointment?.id,
      serviceId,
      serviceTitle: selectedServiceObj.title,
      specialistId,
      specialistName: selectedSpecialistObj.name,
      rating,
      aspectRatings,
      comment: comment.trim(),
      photos,
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#fdf8f5] w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl border border-[#cec5bd]/50 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#f2edea]">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#725b38] tracking-widest">
              <span className="material-symbols-outlined text-[16px] text-amber-500">rate_review</span>
              <span>Calificación Post-Tratamiento</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1b1a]">
              Comparte tu Experiencia
            </h2>
            <p className="text-xs text-[#4c4640] mt-0.5">
              Tu opinión permite perfeccionar cada detalle del atelier y orienta a otras clientas.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f2edea] text-[#4c4640] hover:text-[#1c1b1a] flex items-center justify-center transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Loyalty Points Incentive Banner */}
        <div className="bg-gradient-to-r from-[#fedeb2]/40 to-[#725b38]/15 p-3 rounded-2xl border border-[#fedeb2] flex items-center gap-2.5 text-xs">
          <span className="material-symbols-outlined text-[#725b38] text-[22px] shrink-0">stars</span>
          <div>
            <span className="font-bold text-[#584323] block">
              +100 Puntos Vernis Privilège de Regalo
            </span>
            <span className="text-[11px] text-[#4c4640]">
              Al publicar tu reseña verificada con fotos de tu manicura terminada.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Star Rating Selector */}
          <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 text-center space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-[#1c1b1a] block">
              Calificación General de la Sesión
            </span>

            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 text-amber-400 hover:scale-115 transition-transform cursor-pointer"
                  >
                    <span
                      className={`material-symbols-outlined text-[34px] ${
                        isFilled ? 'fill text-amber-500' : 'text-gray-300'
                      }`}
                    >
                      star
                    </span>
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-semibold text-[#725b38] block">
              {ratingLabels[hoverRating || rating]}
            </span>
          </div>

          {/* Granular Aspect Ratings */}
          <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 space-y-3">
            <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
              Detalle por Aspectos Clave
            </span>

            <div className="grid grid-cols-2 gap-3 text-xs">
              {/* Aspect 1: Técnica */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#4c4640]">Técnica & Acabado</span>
                  <span className="font-bold text-[#1c1b1a]">{aspectRatings.technique}★</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAspectRatings((p) => ({ ...p, technique: st }))}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        aspectRatings.technique >= st ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Aspect 2: Higiene */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#4c4640]">Higiene & Autoclave</span>
                  <span className="font-bold text-[#1c1b1a]">{aspectRatings.hygiene}★</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAspectRatings((p) => ({ ...p, hygiene: st }))}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        aspectRatings.hygiene >= st ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Aspect 3: Trato */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#4c4640]">Atención de Especialista</span>
                  <span className="font-bold text-[#1c1b1a]">{aspectRatings.service}★</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAspectRatings((p) => ({ ...p, service: st }))}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        aspectRatings.service >= st ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Aspect 4: Durabilidad */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#4c4640]">Durabilidad de Uñas</span>
                  <span className="font-bold text-[#1c1b1a]">{aspectRatings.durability}★</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAspectRatings((p) => ({ ...p, durability: st }))}
                      className={`flex-1 h-2 rounded-full transition-all ${
                        aspectRatings.durability >= st ? 'bg-amber-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Service & Specialist Selector (if not prefilled) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640] block">Servicio Realizado</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#cec5bd]/40 rounded-xl text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} (${s.price})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#4c4640] block">Especialista</label>
              <select
                value={specialistId}
                onChange={(e) => setSpecialistId(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-[#cec5bd]/40 rounded-xl text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38]"
              >
                {specialists.map((sp) => (
                  <option key={sp.id} value={sp.id}>
                    {sp.name} ({sp.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Review Text Comments */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-[#4c4640] block">
              Tu Testimonio / Opinión de la Cita
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cuéntanos sobre el acabado, los destellos, el limado de cutículas o el trato recibido..."
              className="w-full p-3 bg-white border border-[#cec5bd]/40 rounded-xl text-xs text-[#1c1b1a] outline-none focus:ring-1 focus:ring-[#725b38] resize-none"
              required
            />
          </div>

          {/* Manicure Photo Upload & Gallery Attachment */}
          <div className="bg-white p-4 rounded-2xl border border-[#cec5bd]/40 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#725b38] tracking-widest block">
                  Fotos de tu Manicura Realizada ({photos.length})
                </span>
                <span className="text-[11px] text-[#4c4640]">
                  Sube fotos del resultado para mostrar el brillo, relieve y técnica.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[10px] font-bold">
                +100 Pts Vernis
              </span>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
            />

            {/* Drag & Drop Upload Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFilesSelected(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                isDragging
                  ? 'border-[#725b38] bg-[#fedeb2]/20'
                  : 'border-[#cec5bd]/70 hover:border-[#725b38] hover:bg-[#fdf8f5]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#f8f3f0] text-[#725b38] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">add_a_photo</span>
              </div>
              <span className="text-xs font-bold text-[#1c1b1a]">
                Haz clic para subir fotos o arrástralas aquí
              </span>
              <span className="text-[10px] text-[#7d766f]">
                Formatos: JPG, PNG, WebP (Cámara del móvil o carrete)
              </span>
            </div>

            {uploadError && (
              <p className="text-[11px] text-red-600 bg-red-50 p-2 rounded-xl border border-red-200">
                {uploadError}
              </p>
            )}

            {/* Attached Photos Preview */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {photos.map((url, idx) => (
                <div key={idx} className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-[#cec5bd]/50 shrink-0 group">
                  <img src={url} alt={`Uña ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/75 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-xs"
                    title="Eliminar foto"
                  >
                    <span className="material-symbols-outlined text-[13px]">close</span>
                  </button>
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded-full bg-black/60 text-[9px] text-white font-mono">
                    #{idx + 1}
                  </span>
                </div>
              ))}

              {photos.length === 0 && (
                <span className="text-xs text-[#7d766f] italic py-2">
                  No has adjuntado fotos todavía.
                </span>
              )}
            </div>

            {/* Quick Presets / Attach samples */}
            <div className="space-y-1.5 pt-2 border-t border-[#f2edea]">
              <span className="text-[10px] text-[#4c4640] block font-medium">
                O prueba añadiendo un set de muestra con un clic:
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {samplePhotoPresets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleAddPhotoPreset(preset.url)}
                    className="px-2.5 py-1 rounded-full bg-[#f8f3f0] hover:bg-[#fedeb2]/40 text-[#1c1b1a] text-[10px] font-semibold flex items-center gap-1 border border-[#cec5bd]/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[13px] text-[#725b38]">add_photo_alternate</span>
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f2edea]">
            <button
              type="submit"
              className="h-11 rounded-full bg-[#1e1b18] hover:bg-[#32302e] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span className="material-symbols-outlined text-[16px] text-[#fedeb2]">send</span>
              <span>Enviar Reseña (+100 pts)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-full bg-[#f2edea] text-[#1c1b1a] text-xs font-bold uppercase tracking-wider hover:bg-[#ece7e4] transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
