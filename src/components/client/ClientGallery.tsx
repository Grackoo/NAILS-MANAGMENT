import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ClientReviewsShowcase } from './ClientReviewsShowcase';

export const ClientGallery: React.FC = () => {
  const { services, bookServiceQuick, reviews } = useStudio();
  const [activeSection, setActiveSection] = useState<'galeria' | 'resenas'>('galeria');
  const [filterShape, setFilterShape] = useState<string>('all');

  const approvedReviewsCount = reviews.filter((r) => r.status === 'aprobada').length;

  const galleryItems = [
    {
      title: 'Acrílico Francés Perla',
      shape: 'Almendra',
      finish: 'Nácar & Glaze',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR5j2Yg93zGNeD0GjJHjjoy3PBN8Wv9Zft1WuqAgfeXo7SVOICrwpfi9rQlq-GVAIHrPbDH_L_qPpakS2w0DI37lrh-DDwhN2UuXqjOvkHLgYNpdQtod9XF_8g4CQsdwnb9nuLIZv9VZtgWUcgg-kH-0UQ89mn7pAPaLmUwobs1V9zxKuUaw928vu024x8hyGnAYlba389uF7oNJ5xdrtC-lz2wa7UqHFYJylf_Yp1HdkX87ZWpA',
      serviceId: 'serv-1',
    },
    {
      title: 'Baby Boomer Glaze',
      shape: 'Almendra Rusa',
      finish: 'Cromo Aurora',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSxyB-VQn-YcWYbQ-uj8d4upxMMa-fQHvxyBNlyW-r5XvM_c4MS5n_V_9X69J5ZUtTrjSWs1S_mfp0o5H0uFS9cxvX1aHzuBLLxXfeKi8_x2m7h2EkQZXQptrCMTEao-mSQcch-YixOYIFxMvKQcpHZr8U8IfWZSQ4giAXMnUik7mbIoeLLCqXVY1Y7SfFPooTemRuLC1UH-cbc5St2v3hzexUgeQks4ECcNerY_bdW1pSS0d8Vw',
      serviceId: 'serv-2',
    },
    {
      title: 'Ojo de Gato Terciopelo Rosa',
      shape: 'Cuadrada Soft',
      finish: '9D Magnético',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqIVb7tutzrP7h31xGJVeizZXwYMa2Wh_dUpbfJcmlt-Un8DVr3lDeWBK02jFHBo82lVbz6S0Dv0CMG6Pc-RgLn2q_YHqrA-UdyaypsxnMIcKevMZK2_b4PSLobnDTpG5Cv_j8HER8fOKesaeWCQThK-PZqmQuIxz587XFflIXNARC2fIlXKFXx3TrszVwDhlqCd84r1nfYuIeCAqE8wMja0LlFD4Z4GOT11avjaqDR1Ufuq-oXw',
      serviceId: 'serv-3',
    },
    {
      title: 'Diseño Festivo Glitter Gold',
      shape: 'Stiletto Suave',
      finish: 'Hoja de Oro 24K',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJSHJaWlDvQfmpjraNAB63RYhGC1TLL6eV9IL0Qi3Mq2SZJXlgmHBEOmkS86u5punTDH2anknHW1DwwZaBj83MYKJo5244iYpCorpdv1b3HPFObjC19IgUKyclMPMTd2y2OujSAq2-b3N9pJA1zpeq976pXGrOaL3F8YNvYOcsMKOsQpkQDONCydI2DSj70yWM6lCjkl0rUX45C0KhNhXGcHK3ytAFc7fdcqlzsztvs6pdXbsWLQ',
      serviceId: 'serv-4',
    },
    {
      title: 'Esmaltado Ruso Milimétrico',
      shape: 'Natural Cuadrada',
      finish: 'Nude Alabaster',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMtfOH6Ek3QPuOzUKbO9GUED0gxTTLPOyXILUFxDHGnCTv74TULgjICxSqUYvbd_t-LgwoW5eyWjkIqUzKqTeRmlRhtd9_spv5blg5jZQxU-5L9YiNOefPmzQyqIPY_jiqFLkc7ZaOlSDkKdCPNBmytb9HPH3CX9JS2u5-oFqL79JlMtGCScnHsnEneBrTOsYJwCE7RKK6RO3ZELcOEV2dXYckX-Mbgogh82d5gOYCX0iHQdrYPw',
      serviceId: 'serv-5',
    },
    {
      title: 'Gold Flakes & Minimalist Nude',
      shape: 'Ballerina',
      finish: 'Mate & Cristales',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPECYzXt5va_ql4By6_DeOlXxY5kce9jZk9hvenogXweLqeREWkcbk2XmwdQqySR1sgEIMNPvz70feOLUPgkYrOrzN6HvOsUPUHMqDC75ZMpAVJdOk44_eM-gO0gNoX8oQDN8SAGe7CTh2oxTNuaaN5HW3ctGzbULiHe0rnwBezdgv6ljpc1umUBqD2yY6KBOIBBTjzxACdmMj9BrB34JDQaQGejvpf0wf0ympffIdaA3c50EnUg',
      serviceId: 'serv-6',
    },
  ];

  const shapes = ['all', 'Almendra', 'Cuadrada Soft', 'Natural Cuadrada', 'Ballerina', 'Stiletto Suave'];

  const filteredGallery = galleryItems.filter((item) => {
    if (filterShape === 'all') return true;
    return item.shape === filterShape;
  });

  return (
    <div className="flex flex-col w-full px-4 sm:px-6 max-w-md md:max-w-4xl mx-auto space-y-6 pb-28 pt-3">
      {/* Editorial Header */}
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] uppercase tracking-widest text-[#725b38] font-bold">
          Portafolio Signature • Paris Atelier
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1b1a]">
          Galería & Opiniones de Clientas
        </h1>
        <p className="text-xs text-[#4c4640] leading-relaxed">
          Explora los acabados de autor de nuestras maestras y las fotografías reales subidas por nuestra comunidad.
        </p>
      </div>

      {/* Segmented Switcher */}
      <div className="flex items-center justify-center p-1 bg-[#f2edea] rounded-full border border-[#cec5bd]/40">
        <button
          type="button"
          onClick={() => setActiveSection('galeria')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeSection === 'galeria'
              ? 'bg-[#1e1b18] text-white shadow-sm'
              : 'text-[#4c4640] hover:text-[#1c1b1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">photo_library</span>
          <span>Colección Signature</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('resenas')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
            activeSection === 'resenas'
              ? 'bg-[#1e1b18] text-white shadow-sm'
              : 'text-[#4c4640] hover:text-[#1c1b1a]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px] text-amber-500">stars</span>
          <span>Reseñas & Fotos ({approvedReviewsCount})</span>
        </button>
      </div>

      {activeSection === 'resenas' ? (
        <ClientReviewsShowcase />
      ) : (
        <>
          {/* Atelier Atmosphere Visual Banner */}
          <div className="relative rounded-2xl overflow-hidden shadow-xs border border-[#cec5bd]/40">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0UaulzDU2TWEXFpf5Ncv_zlc2rqJytTZWR2wbvGnXKHad1Mk7uP38D6q70Z11FlvSwFeBAm8_4P0VKhkOJSSuw7GZXxRQuFejeyBLBcUzKNfB9S9lH7j7kq6y5Ci2PCaUnEyUA2CzG3xVHVozv7bNIKvu5pvP1QyRoEk_Tubvjbu9Xn_eY3S4W9Z9EXn0IVhTUUr-b7NwbV7NSk7jc4hAOHs13DHP9c2N0XGybfUEGHGiUdu_jg"
              alt="Atelier Paris"
              className="w-full h-40 sm:h-52 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
              <span className="text-[10px] uppercase tracking-widest text-[#fedeb2] font-bold">
                Espacio & Comodidad
              </span>
              <h3 className="font-serif text-lg font-bold">Estaciones Privadas de Esculpido</h3>
              <p className="text-xs text-white/80">Ambiente de relajación, café de cortesía y aromaterapia francesa.</p>
            </div>
          </div>

          {/* Shape filter chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-4 px-4">
            {shapes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilterShape(s)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  filterShape === s
                    ? 'bg-[#1e1b18] text-white shadow-xs'
                    : 'bg-white text-[#4c4640] border border-[#cec5bd]/40 hover:bg-[#f2edea]'
                }`}
              >
                {s === 'all' ? 'Todas las Formas' : s}
              </button>
            ))}
          </div>

          {/* Masonry-style Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {filteredGallery.map((item, index) => {
              const matchedService = services.find((s) => s.id === item.serviceId);
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden border border-[#cec5bd]/40 shadow-xs flex flex-col group hover:shadow-md transition-all"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-[#f2edea]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] uppercase font-bold tracking-wider inline-block">
                        {item.finish}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-serif text-sm font-bold text-[#1c1b1a] truncate">{item.title}</h4>
                      <p className="text-[11px] text-[#4c4640]">Forma: {item.shape}</p>
                    </div>

                    {matchedService && (
                      <button
                        type="button"
                        onClick={() => bookServiceQuick(matchedService)}
                        className="mt-2.5 w-full py-1.5 rounded-full bg-[#f8f3f0] hover:bg-[#1e1b18] hover:text-white text-[#1c1b1a] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 transition-colors"
                      >
                        <span>Pedir este set</span>
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
