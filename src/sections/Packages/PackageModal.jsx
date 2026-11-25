import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import "swiper/css";
import "swiper/css/pagination";

const TitleLines = ({ title, className, id }) => {
  const lines = String(title || "").split("\n");

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

const PackageModal = ({ pkg, packages = [], onChangePackage, onClose }) => {
  const { t, i18n } = useTranslation();
  const dialogRef = useRef(null);
  const goRef = useRef(() => {});
  const galleryEdge = useRef({ beginning: false, end: false });
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const english = String(i18n.language || "").toLowerCase().startsWith("en");
  const index = Math.max(0, packages.findIndex((item) => item.id === pkg.id));
  const total = packages.length;

  const goToPackage = (delta) => {
    if (total < 2 || typeof onChangePackage !== "function") return;
    const next = (index + delta + total) % total;
    setDragX(0);
    setDragging(false);
    onChangePackage(packages[next]);
  };
  goRef.current = goToPackage;

  useEffect(() => {
    const el = dialogRef.current;
    if (!el || total < 2) return undefined;

    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let tracking = false;
    let horizontal = false;

    const onStart = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.target.closest("a, button, .package-gallery")) return;
      startX = lastX = event.clientX;
      startY = event.clientY;
      tracking = true;
      horizontal = false;
      try {
        el.setPointerCapture(event.pointerId);
      } catch (error) {
        // Some browsers reject capture until the pointer is active.
      }
    };

    const onMove = (event) => {
      if (!tracking) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!horizontal) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        horizontal = Math.abs(dx) > Math.abs(dy);
        if (!horizontal) {
          tracking = false;
          return;
        }
      }
      lastX = event.clientX;
      setDragging(true);
      setDragX(Math.max(-160, Math.min(160, dx)));
    };

    const onEnd = () => {
      if (!tracking) return;
      const dx = lastX - startX;
      tracking = false;
      setDragging(false);
      setDragX(0);
      if (horizontal && Math.abs(dx) > 64) goRef.current(dx < 0 ? 1 : -1);
    };

    el.addEventListener("pointerdown", onStart);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onEnd);
    el.addEventListener("pointercancel", onEnd);
    return () => {
      el.removeEventListener("pointerdown", onStart);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onEnd);
      el.removeEventListener("pointercancel", onEnd);
    };
  }, [total, pkg.id]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goRef.current(1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goRef.current(-1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, index, total, packages]);

  useEffect(() => {
    if (dialogRef.current) dialogRef.current.scrollTop = 0;
  }, [pkg.id]);

  if (!pkg) return null;

  const gallery = pkg.gallery?.length ? pkg.gallery : [pkg.image, null, null];
  const spanishTitle = String(pkg.titleEs || pkg.title || "").replace(/\n/g, " ");
  const whatsappMessage = `Hola! Me gustaría recibir información sobre el paquete ${spanishTitle}`;
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
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="package-modal-title"
        className="relative bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-xl touch-pan-y"
        style={{
          transform: dragX ? `translateX(${dragX}px)` : undefined,
          transition: dragging ? "none" : "transform 200ms ease",
        }}
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
              key={`${pkg.id}-${gallery.filter(Boolean).join("|")}`}
              modules={[Pagination]}
              pagination={gallery.length > 1 ? { clickable: true } : false}
              grabCursor={gallery.length > 1}
              spaceBetween={0}
              slidesPerView={1}
              threshold={8}
              className="package-gallery w-full aspect-[4/5] bg-neutral-100 [&_.swiper-wrapper]:h-full [&_.swiper-slide]:h-full"
              onTouchStart={(swiper) => {
                galleryEdge.current = {
                  beginning: swiper.isBeginning,
                  end: swiper.isEnd,
                };
              }}
              onTouchEnd={(swiper) => {
                const diff = (swiper.touches?.currentX || 0) - (swiper.touches?.startX || 0);
                const edge = galleryEdge.current;
                if (edge.beginning && swiper.isBeginning && diff > 70) goToPackage(-1);
                else if (edge.end && swiper.isEnd && diff < -70) goToPackage(1);
              }}
            >
              {gallery.map((src, index) => (
                <SwiperSlide key={`${pkg.id}-${index}`}>
                  {src ? (
                    <img
                      src={src}
                      alt={pkg.title.replace("\n", " ")}
                      className="w-full h-full object-cover"
                      onError={(event) => {
                        const path = String(src).split("?")[0];
                        const at = path.indexOf("/images/");
                        const fallback =
                          pkg.mediaSha && at >= 0
                            ? `https://raw.githubusercontent.com/ivanabraz/laureles/${pkg.mediaSha}/public${path.slice(at)}`
                            : null;
                        if (fallback && event.currentTarget.dataset.fallback !== "1") {
                          event.currentTarget.dataset.fallback = "1";
                          event.currentTarget.src = fallback;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 text-sm tracking-wide">
                      {t("global.reference_photo")}
                    </div>
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="flex flex-col">
            <TitleLines
              id="package-modal-title"
              title={pkg.title}
              className="text-2xl md:text-3xl tracking-tight mb-5"
            />

            {pkg.description && (
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-6">
                {pkg.description}
              </p>
            )}

            {pkg.price && (
              <p className="mb-6">
                {pkg.priceLabel && (
                  <span className="block text-xs tracking-widest uppercase text-neutral-400 mb-1">
                    {pkg.priceLabel}
                  </span>
                )}
                <span className="text-xl md:text-2xl tracking-tight">{pkg.price}</span>
              </p>
            )}

            {pkg.intro && (
              <p className="text-[13px] md:text-sm font-light text-neutral-400 leading-relaxed mb-8">
                {pkg.intro}
              </p>
            )}

            {pkg.details.length > 0 && (
              <div className="mb-10">
                <p className="text-xs tracking-widest uppercase text-neutral-400 mb-3">
                  {pkg.includesLabel}
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

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToPackage(-1);
            }}
            aria-label={english ? "Previous package" : "Paquete anterior"}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-neutral-900 shadow-md hover:bg-neutral-100 transition"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToPackage(1);
            }}
            aria-label={english ? "Next package" : "Paquete siguiente"}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white text-neutral-900 shadow-md hover:bg-neutral-100 transition"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </>
      )}
    </div>
  );
};

export default PackageModal;
