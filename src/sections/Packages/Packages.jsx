import React, { useEffect, useMemo, useState } from "react";
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
  const chosen = copy[lang] || {};
  const fallback = copy.es || {};
  return {
    title: String(chosen.title || fallback.title || ""),
    description: String(chosen.description || fallback.description || ""),
  };
};

const shownPrice = (value) => {
  const price = String(value || "").trim();
  if (!price || price.replace(/\s/g, "") === "$00.000") return "";
  return price;
};

const publishedImage = (src, sha) => {
  if (!sha) return null;
  const path = sitePath(src);
  if (!path || !path.startsWith("/images/")) return null;
  return `https://raw.githubusercontent.com/ivanabraz/laureles/${sha}/public${path}`;
};

const sitePath = (src) => {
  if (!src) return null;
  let path = String(src).split("?")[0];
  const imagesAt = path.indexOf("/images/");
  if (imagesAt >= 0) return path.slice(imagesAt);
  if (/^https?:/i.test(path)) return path;
  path = path.replace(/^\/?src\/data\/public\//, "/").replace(/^\/?public\//, "/");
  if (!path.startsWith("/")) path = `/${path}`;
  return path;
};

const withPublicUrl = (src) => {
  const path = sitePath(src);
  if (!path) return null;
  if (/^https?:/i.test(path)) return path;
  const prefix = process.env.PUBLIC_URL || "";
  if (prefix && path.startsWith(prefix)) return path;
  return `${prefix}${path}`;
};

const mergePublished = (local, remote) => {
  const mergeLang = (lang) => ({
    ...(local.includes?.[lang] || {}),
    ...(remote.includes?.[lang] || {}),
  });
  return {
    ...remote,
    packages: remote.packages,
    includes: {
      es: mergeLang("es"),
      en: mergeLang("en"),
    },
  };
};

const PackageCover = ({ src, sha, className, children }) => {
  const local = withPublicUrl(src);
  const remote = publishedImage(src, sha);
  const [image, setImage] = useState(local);

  useEffect(() => {
    setImage(local);
    if (!remote || remote === local) return undefined;
    let cancelled = false;
    const probe = new Image();
    probe.onload = () => {
      if (!cancelled) setImage(local);
    };
    probe.onerror = () => {
      if (!cancelled) setImage(remote);
    };
    probe.src = local;
    return () => {
      cancelled = true;
    };
  }, [local, remote]);

  return (
    <div className={className} style={{ backgroundImage: image ? `url(${image})` : undefined }}>
      {children}
    </div>
  );
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
  const [content, setContent] = useState(packagesContent);
  const [mediaSha, setMediaSha] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadPublished = async () => {
      try {
        const commitRes = await fetch("https://api.github.com/repos/ivanabraz/laureles/commits/main", {
          headers: { Accept: "application/vnd.github+json" },
        });
        if (!commitRes.ok) return;
        const commit = await commitRes.json();
        const sha = commit?.sha;
        if (!sha) return;
        const dataRes = await fetch(
          `https://raw.githubusercontent.com/ivanabraz/laureles/${sha}/src/data/packages.json`
        );
        if (!dataRes.ok) return;
        const remote = await dataRes.json();
        if (cancelled || !Array.isArray(remote?.packages)) return;
        setMediaSha(sha);
        setContent(mergePublished(packagesContent, remote));
      } catch (error) {
        void error;
      }
    };

    loadPublished();
    const onVisible = () => {
      if (document.visibilityState === "visible") loadPublished();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const packagesData = useMemo(() => {
    const lang = siteLang(i18n.language);
    const phrases = content.includes?.[lang] || content.includes?.es || {};
    const list = content.packages || [];
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
          intro: String(phrases.intro || ""),
          price: shownPrice(pkg.info?.price),
          priceLabel: String(phrases.price_label || ""),
          includesLabel: phrases.includes || "",
          details: packageDetails(pkg.info, lang, phrases.treats || ""),
          image: cover,
          gallery: normalizeGallery(pkg.gallery, pkg.cover),
          mediaSha,
          titleColor: pkg.titleColor || "text-white",
        };
      })
      .filter(Boolean);
  }, [content, i18n.language, mediaSha]);

  useEffect(() => {
    setSelectedPackage((current) => {
      if (!current) return current;
      return packagesData.find((item) => item.id === current.id) || current;
    });
  }, [packagesData]);

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
                <PackageCover
                  src={pkg.image}
                  sha={pkg.mediaSha}
                  className="aspect-[10/16] tracking-tight rounded-[40px] overflow-hidden relative bg-cover bg-center flex flex-col p-6 transition-transform duration-300 ease-out will-change-transform group-hover:scale-[1.04]"
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
                </PackageCover>
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {selectedPackage && (
        <PackageModal
          pkg={selectedPackage}
          packages={packagesData}
          onChangePackage={setSelectedPackage}
          onClose={() => setSelectedPackage(null)}
        />
      )}
    </div>
  );
};

export default Packages;
