import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import "swiper/css";

const TitleLines = ({ title, className, id }) => {
  const lines = title.split("\n");

  return (
    <h3 id={id} className={className}>
      {lines.map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < lines.length - 1 && <br />}
        </React.Fragment>
      ))}
    </h3>
  );
};

const PackageModal = ({ pkg, onClose }) => {
  const { t } = useTranslation();
  const tEs = i18next.getFixedT("es");
  const [swiper, setSwiper] = useState(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  if (!pkg) return null;

  const gallery = pkg.gallery?.length ? pkg.gallery : [pkg.image, null, null];
  const whatsappMessage = `Hola! Me gustaría recibir información sobre el paquete ${tEs(pkg.titleKey)}`;
  const whatsappURL = `https://api.whatsapp.com/send?phone=5491133752356&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
      <button
        type="button"
        aria-label={t("global.back")}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-modal-title"
        className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t("global.back")}
          className="absolute top-4 right-4 z-10 text-neutral-800 text-xl p-2 hover:opacity-60 transition"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-6 md:p-10">
          <div className="relative">
            <Swiper
              onSwiper={setSwiper}
              spaceBetween={0}
              slidesPerView={1}
              className="w-full aspect-[4/5] bg-neutral-100 [&_.swiper-wrapper]:h-full [&_.swiper-slide]:h-full"
            >
              {gallery.map((src, index) => (
                <SwiperSlide key={`${pkg.titleKey}-${index}`}>
                  {src ? (
                    <img
                      src={src}
                      alt={pkg.title.replace("\n", " ")}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm tracking-wide">
                      {t("global.reference_photo")}
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => swiper?.slidePrev()}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/70 text-neutral-800 hover:bg-white transition"
                  aria-label={t("global.back")}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  type="button"
                  onClick={() => swiper?.slideNext()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/70 text-neutral-800 hover:bg-white transition"
                  aria-label={t("global.see_more")}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col">
            <TitleLines
              id="package-modal-title"
              title={pkg.title}
              className="text-2xl md:text-3xl tracking-tight mb-5"
            />

            {pkg.description && (
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-8">
                {pkg.description}
              </p>
            )}

            {pkg.details.length > 0 && (
              <div className="mb-10">
                <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">
                  {t("global.packages_description.includes")}
                </p>
                <ul className="space-y-3 text-sm text-neutral-800">
                  {pkg.details.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <FontAwesomeIcon
                        icon={item.icon}
                        className="mt-0.5 w-4 shrink-0 text-current"
                      />
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <a
              href={whatsappURL}
              rel="noopener noreferrer"
              target="_blank"
              className="mt-auto inline-flex items-center justify-center w-full rounded-full bg-black text-white text-sm tracking-wide py-3.5 px-6 hover:bg-neutral-800 transition"
            >
              {t("global.requestinfo")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageModal;
