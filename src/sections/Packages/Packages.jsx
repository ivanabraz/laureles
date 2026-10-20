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

const DETAIL_ICONS = {
  session_60min: faClock,
  session_60_90min: faClock,
  session_5_photos: faCamera,
  session_10_photos: faCamera,
  session_16_photos: faCamera,
  treats: faBone,
  location_studio: faLocationDot,
  location_outdoor_1: faLocationDot,
  location_outdoor_2: faLocationDot,
};

const packageTitleKey = (id) =>
  id === "gift_card"
    ? "global.packages_description.gift_card"
    : `global.packages_description.session_${id}`;

const packageDescriptionKey = (id) =>
  `global.packages_description.desc_${id}`;

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
  const { t } = useTranslation();
  const [selectedPackage, setSelectedPackage] = useState(null);

  const packagesData = useMemo(() => {
    const list = packagesContent.packages || [];
    return list
      .map((pkg) => {
        if (!pkg?.id) return null;
        const titleKey = packageTitleKey(pkg.id);
        const descriptionKey = packageDescriptionKey(pkg.id);
        const cover = withPublicUrl(pkg.cover);
        const detailIds = Array.isArray(pkg.details) ? pkg.details : [];
        return {
          id: pkg.id,
          titleKey,
          title: t(titleKey),
          description: t(descriptionKey),
          details: detailIds
            .map((detailId) => {
              const icon = DETAIL_ICONS[detailId];
              if (!icon) return null;
              return {
                icon,
                text: t(`global.packages_description.${detailId}`),
              };
            })
            .filter(Boolean),
          image: cover,
          gallery: normalizeGallery(pkg.gallery, pkg.cover),
          titleColor: pkg.titleColor || "text-white",
        };
      })
      .filter(Boolean);
  }, [t]);

  return (
    <div id="packages" className="w-full text-black flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="w-full"
      >
        <p className="font-medium text-xl mb-10 pl-6 md:pl-10">{t("global.packages")}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeInOut" }}
        viewport={{ once: true }}
        className="w-full px-6 md:px-10"
      >
        <Swiper
          spaceBetween={20}
          slidesPerView={1.5}
          breakpoints={{
            768: { slidesPerView: 2.5 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.5 },
          }}
          className="!overflow-visible py-3"
        >
          {packagesData.map((pkg, index) => (
            <SwiperSlide key={pkg.id || index} className="!overflow-visible">
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
                    {pkg.title.split("\n").map((line, i) => (
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
