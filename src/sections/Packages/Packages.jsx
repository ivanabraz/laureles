import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useTranslation } from "react-i18next";
import {
  faBone,
  faCamera,
  faClock,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import PackageModal from "./PackageModal";
import packagesContent from "../../data/packages.json";

const infoText = (info, field, lang) => {
  const side = info?.[field];
  if (!side || typeof side !== "object") return "";
  return String(side[lang] || "").trim();
};

const packageDetails = (info, lang, treatsLabel) => {
  const details = [];
  const duration = infoText(info, "duration", lang);
  const photos = infoText(info, "photos", lang);
  const place =
    info?.place === "studio" || info?.place === "outdoor"
      ? infoText(info, "placeText", lang)
      : "";
  if (duration) details.push({ icon: faClock, text: duration });
  if (photos) details.push({ icon: faCamera, text: photos });
  if (info?.treats && treatsLabel) details.push({ icon: faBone, text: treatsLabel });
  if (place) details.push({ icon: faLocationDot, text: place });
  return details;
};

const siteLang = (language) =>
  String(language || "").toLowerCase().startsWith("en") ? "en" : "es";

const packageCopy = (pkg, lang) => {
  const copy = pkg?.copy || {};
  return copy[lang] || copy.es || {};
};

const withPublicUrl = (src) => {
  if (!src) return null;
  if (src.startsWith("http") || src.startsWith(process.env.PUBLIC_URL || "")) {
    return src;
  }
  return `${process.env.PUBLIC_URL || ""}${src.startsWith("/") ? src : `/${src}`}`;
};

const normalizeGallery = (gallery, cover) => {
  const items = (gallery || [])
    .map((item) => (typeof item === "string" ? item : item?.src || item?.image))
    .filter(Boolean)
    .map(withPublicUrl);
  if (items.length === 0 && cover) return [withPublicUrl(cover)];
  return items;
};

const Packages = () => {
  const { t, i18n } = useTranslation();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packagesData = useMemo(() => {
    const lang = siteLang(i18n.language);
    const phrases =
      packagesContent.includes?.[lang] || packagesContent.includes?.es || {};
    const list = packagesContent.packages || [];
    return list
      .map((pkg) => {
        if (!pkg?.id || !pkg.cover) return null;
        const copy = packageCopy(pkg, lang);
        const cover = withPublicUrl(pkg.cover);
        return {
          id: pkg.id,
          title: String(copy.title || ""),
          titleEs: String(packageCopy(pkg, "es").title || ""),
          description: String(copy.description || ""),
          includesLabel: phrases.includes || "",
          details: packageDetails(pkg.info, lang, phrases.treats || ""),
          image: cover,
          gallery: normalizeGallery(pkg.gallery, pkg.cover),
          titleColor: pkg.titleColor || "text-white",
        };
      })
      .filter(Boolean);
  }, [i18n.language]);

  return (
    <div id="packages" className="w-full bg-white pt-10 pb-14 text-black flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="w-full"
      >
        <p className="christmas-accent font-medium text-xl mb-10 pl-6 md:pl-10">{t("global.packages")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="w-full min-w-0 max-w-full overflow-x-clip"
      >
        <Swiper
          spaceBetween={20}
          slidesPerView={1.5}
          slidesOffsetBefore={24}
          breakpoints={{
            768: { slidesPerView: 2.5, slidesOffsetBefore: 40 },
            1024: { slidesPerView: 3.5, slidesOffsetBefore: 40 },
            1280: { slidesPerView: 4.5, slidesOffsetBefore: 40 },
          }}
          className="!overflow-visible !py-5"
        >
          {packagesData.map((pkg, index) => (
            <SwiperSlide key={pkg.id || index} className="!overflow-visible hover:z-10">
              <button
                type="button"
                onClick={() => setSelectedPackage(pkg)}
                className="group w-full text-left bg-transparent p-0 border-0 cursor-pointer"
              >
                <div
                  className="aspect-[10/16] tracking-tight rounded-[40px] overflow-hidden relative bg-cover bg-center flex flex-col p-6 transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.04]"
                  style={{ backgroundImage: `url(${pkg.image})` }}
                >
                  <h3 className={`relative z-10 text-xl md:text-2xl lg:text-2xl ${pkg.titleColor}`}>
                    {String(pkg.title || "").split("\n").map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </h3>

                  <span
                    className="absolute z-10 left-1/2 -translate-x-1/2 bottom-8 px-5 py-2 rounded-full text-sm text-white bg-white/30 backdrop-blur-sm border border-white/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                  >
                    {t("global.see_more")}
                  </span>
                </div>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {selectedPackage && (
        <PackageModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
      )}
    </div>
  );
};

export default Packages;
