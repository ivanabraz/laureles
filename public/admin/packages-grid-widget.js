/**
 * Decap widget for packages: visual cards + cover/gallery/titleColor/copy/info.
 * Value: [{ id, cover, gallery, titleColor, copy, info }]
 *
 * Each card stores cover, gallery, title color, bilingual copy, and includes.
 */
(function () {
  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  if (!CMS || !createClass || !h) {
    console.error("[packages-grid] Decap CMS APIs missing");
    return;
  }

  var SITE_HOSTS = [
    "https://laureles.netlify.app",
    "https://www.laureles.netlify.app",
    "https://laurelesaudiovisual.com",
    "https://www.laurelesaudiovisual.com",
    "https://ivanabraz.github.io/laureles",
  ];

  var KNOWN_LABELS = {
    chihuahua: "Chihuahua",
    galgo: "Galgo",
    akita: "Akita",
    pug: "Pug",
    mestizo: "Mestizo",
    dogo: "Dogo",
    gift_card: "Gift card",
  };

  function mediaSrc(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value.toJS === "function") return mediaSrc(value.toJS());
    if (typeof value === "object") return value.path || value.src || value.url || "";
    return "";
  }

  function asMediaList(mediaPath) {
    if (mediaPath == null || mediaPath === "") return [];
    if (typeof mediaPath.toJS === "function") {
      var js = mediaPath.toJS();
      return asMediaList(js);
    }
    var list = Array.isArray(mediaPath) ? mediaPath : [mediaPath];
    return list.map(mediaSrc).filter(Boolean);
  }

  function sitePath(src) {
    src = mediaSrc(src);
    if (!src || /^(blob:|data:)/i.test(src)) return "";
    var i;
    for (i = 0; i < SITE_HOSTS.length; i++) {
      if (src.indexOf(SITE_HOSTS[i]) === 0) {
        return src.slice(SITE_HOSTS[i].length) || "/";
      }
    }
    if (/^https?:\/\//i.test(src)) return "";
    return src.charAt(0) === "/" ? src : "/" + src;
  }

  function toPublicUrl(src) {
    src = mediaSrc(src);
    if (!src) return "";
    if (/^(blob:|data:)/i.test(src)) return src;
    var path = sitePath(src);
    if (!path) return src;
    return window.location.origin + path;
  }

  function repoRawUrl(src) {
    var path = sitePath(src);
    if (!path) return "";
    var rel = path.replace(/^\//, "");
    if (rel.indexOf("public/") !== 0) rel = "public/" + rel;
    return "https://raw.githubusercontent.com/ivanabraz/laureles/main/" + rel;
  }

  function draftAssetUrl(getAsset, field, src) {
    if (typeof getAsset !== "function") return "";
    var path = sitePath(src);
    if (!path) return "";
    var name = path.split("/").filter(Boolean).pop();
    if (!name) return "";
    var asset;
    try {
      asset = getAsset("public/images/packages/" + name, field);
    } catch (err) {
      return "";
    }
    if (!asset || asset.path === "empty.svg") return "";
    var url = asset.url || "";
    if (/^(blob:|data:)/i.test(url)) return url;
    return "";
  }

  function previewImg(src, alt, getAsset, field) {
    var url = draftAssetUrl(getAsset, field, src) || toPublicUrl(src);
    var raw = repoRawUrl(src);
    return h("img", {
      src: url,
      alt: alt || "",
      "data-raw": raw && raw !== url ? raw : "",
      onError: function (ev) {
        var img = ev.target;
        if (!img || img.getAttribute("data-tried")) return;
        var fallback = img.getAttribute("data-raw");
        img.setAttribute("data-tried", "1");
        if (fallback) img.src = fallback;
      },
    });
  }

  function asArray(value) {
    if (!value) return [];
    if (typeof value.toJS === "function") return value.toJS();
    return Array.isArray(value) ? value.slice() : [];
  }

  function slugify(raw) {
    return String(raw || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40);
  }

  function packageLabel(id) {
    if (KNOWN_LABELS[id]) return KNOWN_LABELS[id];
    return String(id || "")
      .split("_")
      .map(function (w) {
        return w ? w.charAt(0).toUpperCase() + w.slice(1) : "";
      })
      .join(" ");
  }

  function emptyCopy() {
    return {
      es: { title: "", description: "" },
      en: { title: "", description: "" },
    };
  }

  function normalizeCopy(copy) {
    var plain = copy;
    if (plain && typeof plain.toJS === "function") plain = plain.toJS();
    plain = plain || {};
    function side(locale) {
      locale = locale || {};
      return {
        title: locale.title == null ? "" : String(locale.title),
        description: locale.description == null ? "" : String(locale.description),
      };
    }
    return {
      es: side(plain.es),
      en: side(plain.en),
    };
  }

  function cardName(pkg) {
    var title = pkg.copy && pkg.copy.es && pkg.copy.es.title;
    if (title) return String(title).split("\n")[0];
    return packageLabel(pkg.id);
  }

  function bilingual(value) {
    var plain = value;
    if (plain && typeof plain.toJS === "function") plain = plain.toJS();
    plain = plain || {};
    return {
      es: plain.es == null ? "" : String(plain.es),
      en: plain.en == null ? "" : String(plain.en),
    };
  }

  function emptyInfo() {
    return {
      duration: { es: "", en: "" },
      photos: { es: "", en: "" },
      treats: false,
      place: "",
      placeText: { es: "", en: "" },
    };
  }

  function defaultInfo(id) {
    if (id === "gift_card") return emptyInfo();
    return {
      duration: { es: "60 min", en: "60 min" },
      photos: {
        es: "5 fotos editadas digitales",
        en: "5 edited digital photos",
      },
      treats: true,
      place: "studio",
      placeText: { es: "Estudio (Recoleta)", en: "Studio (Recoleta)" },
    };
  }

  function normalizeInfo(info) {
    if (!info || typeof info !== "object") return emptyInfo();
    if (typeof info.toJS === "function") info = info.toJS();
    var place = info.place === "studio" || info.place === "outdoor" ? info.place : "";
    return {
      duration: bilingual(info.duration),
      photos: bilingual(info.photos),
      treats: info.treats === true || info.treats === "true",
      place: place,
      placeText: bilingual(info.placeText),
    };
  }

  function normalizePkg(pkg) {
    var gallery = asArray(pkg.gallery)
      .map(function (g) {
        return typeof g === "string" ? g : (g && (g.src || g.image)) || "";
      })
      .filter(Boolean);
    return {
      id: pkg.id || "nuevo",
      cover: pkg.cover || gallery[0] || "",
      gallery: gallery.length ? gallery : pkg.cover ? [pkg.cover] : [],
      titleColor: pkg.titleColor || "text-white",
      copy: normalizeCopy(pkg.copy),
      info: pkg.info ? normalizeInfo(pkg.info) : defaultInfo(pkg.id),
    };
  }

  var styleTagId = "laureles-packages-grid-css-v4";
  function ensureStyles() {
    ["laureles-packages-grid-css", "laureles-packages-grid-css-v2", "laureles-packages-grid-css-v3"].forEach(function (id) {
      var old = document.getElementById(id);
      if (old) old.parentNode.removeChild(old);
    });
    if (document.getElementById(styleTagId)) return;
    var style = document.createElement("style");
    style.id = styleTagId;
    style.textContent = [
      ".pg-wrap{font-family:system-ui,-apple-system,sans-serif}",
      ".pg-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap}",
      ".pg-hint{color:#666;font-size:13px;margin:0}",
      ".pg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px}",
      ".pg-card{position:relative;aspect-ratio:10/16;border-radius:16px;overflow:hidden;background:#eee;cursor:grab;box-shadow:0 2px 8px rgba(0,0,0,.12)}",
      ".pg-card:active{cursor:grabbing}",
      ".pg-card.is-dragging{opacity:.45}",
      ".pg-card.is-over,.pg-card.is-selected{outline:3px solid #df4c8a;outline-offset:2px}",
      ".pg-card img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}",
      ".pg-card .pg-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;padding:8px;text-align:center}",
      ".pg-name{position:absolute;left:10px;top:10px;background:rgba(255,255,255,.95);border-radius:999px;padding:4px 10px;font-size:12px;font-weight:700;color:#111}",
      ".pg-count{position:absolute;left:10px;bottom:10px;background:rgba(0,0,0,.55);color:#fff;border-radius:999px;padding:3px 8px;font-size:11px}",
      ".pg-panel{margin-top:18px;padding:16px;border:1px solid #e5e5e5;border-radius:14px;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.06)}",
      ".pg-panel h4{margin:0 0 4px;font-size:16px}",
      ".pg-panel .pg-sub{margin:0 0 14px;font-size:12px;color:#666;line-height:1.45}",
      ".pg-panel label{display:block;font-size:12px;font-weight:600;margin:12px 0 6px}",
      ".pg-cover-row{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}",
      ".pg-cover-preview{width:120px;aspect-ratio:10/16;border-radius:12px;overflow:hidden;background:#eee;flex-shrink:0}",
      ".pg-cover-preview img{width:100%;height:100%;object-fit:cover;display:block}",
      ".pg-btn{appearance:none;border:0;border-radius:999px;padding:9px 14px;font-size:13px;font-weight:600;cursor:pointer;background:#222;color:#fff}",
      ".pg-btn:hover{background:#000}",
      ".pg-btn.secondary{background:#f0f0f0;color:#222}",
      ".pg-chips{display:flex;gap:8px;flex-wrap:wrap}",
      ".pg-chip{appearance:none;border:1px solid #ccc;background:#fff;border-radius:999px;padding:8px 14px;font-size:13px;cursor:pointer}",
      ".pg-chip.is-on{background:#222;border-color:#222;color:#fff}",
      ".pg-ggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:10px;margin-top:8px}",
      ".pg-gcard{position:relative;aspect-ratio:2/3;border-radius:10px;overflow:hidden;background:#eee;cursor:grab}",
      ".pg-gcard.is-dragging{opacity:.45}",
      ".pg-gcard.is-over{outline:3px solid #df4c8a;outline-offset:2px}",
      ".pg-gcard img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}",
      ".pg-gdel{position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:16px;cursor:pointer;opacity:0;display:flex;align-items:center;justify-content:center}",
      ".pg-gcard:hover .pg-gdel{opacity:1}",
      ".pg-gdel:hover{background:#c62828}",
      ".pg-star{position:absolute;left:6px;bottom:6px;background:rgba(255,255,255,.95);border-radius:999px;padding:2px 7px;font-size:10px;font-weight:700}",
      ".pg-empty{padding:24px;border:2px dashed #ccc;border-radius:12px;text-align:center;color:#777}",
      ".pg-input{width:100%;max-width:280px;padding:8px 10px;border:1px solid #ccc;border-radius:8px;font-size:14px;box-sizing:border-box}",
      ".pg-line{width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:10px;padding:10px 12px;font:inherit;font-size:14px}",
      ".pg-check{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;margin:12px 0}",
      ".pg-check input{width:16px;height:16px}",
      ".pg-tabs{display:flex;gap:8px;margin:4px 0 12px}",
      ".pg-tab{appearance:none;border:1px solid #ddd;background:#f6f6f6;color:#222;border-radius:999px;padding:8px 14px;font-size:13px;font-weight:650;cursor:pointer}",
      ".pg-tab.is-on{background:#161616;border-color:#161616;color:#fff}",
      ".pg-area{width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:10px;padding:10px 12px;font:inherit;font-size:14px;line-height:1.4;resize:vertical;min-height:64px}",
    ].join("");
    document.head.appendChild(style);
  }

  var PackagesGridControl = createClass({
    getInitialState: function () {
      return {
        editIndex: null,
        lang: "es",
        dragIndex: null,
        overIndex: null,
        gDragIndex: null,
        gOverIndex: null,
        mediaTarget: null,
      };
    },

    componentDidMount: function () {
      ensureStyles();
      this._controlID = "pg-" + Math.random().toString(36).slice(2);
    },

    componentDidUpdate: function (prevProps) {
      var paths = this.props.mediaPaths;
      if (!paths || typeof paths.get !== "function") return;
      var mediaPath = paths.get(this._controlID);
      if (!mediaPath) return;
      var prevPath = prevProps.mediaPaths && prevProps.mediaPaths.get(this._controlID);
      if (mediaPath === prevPath) return;

      var incoming = asMediaList(mediaPath);
      var target = this.state.mediaTarget;
      var editIndex = this.state.editIndex;
      if (editIndex == null || !target) return;

      var items = this.getItems();
      var pkg = Object.assign({}, items[editIndex]);

      if (target === "cover") {
        var cover = incoming[0];
        if (cover) {
          pkg.cover = cover;
          if (!pkg.gallery.length) pkg.gallery = [cover];
        }
      } else if (target === "gallery") {
        incoming.forEach(function (p) {
          if (p && pkg.gallery.indexOf(p) === -1) pkg.gallery.push(p);
        });
        if (!pkg.cover && pkg.gallery[0]) pkg.cover = pkg.gallery[0];
      }

      items[editIndex] = pkg;
      this.commit(items);
      this.setState({ mediaTarget: null });
      if (this.props.onRemoveInsertedMedia) {
        this.props.onRemoveInsertedMedia(this._controlID);
      }
    },

    getItems: function () {
      return asArray(this.props.value).map(normalizePkg);
    },

    commit: function (items) {
      this.props.onChange(items.map(normalizePkg));
    },

    openMedia: function (target, allowMultiple) {
      var self = this;
      this.setState({ mediaTarget: target }, function () {
        if (typeof self.props.onOpenMediaLibrary === "function") {
          self.props.onOpenMediaLibrary({
            controlID: self._controlID,
            forImage: true,
            allowMultiple: !!allowMultiple,
            field: self.props.field,
          });
        } else {
          window.alert("No se pudo abrir la biblioteca de medios.");
        }
      });
    },

    handleAddPackage: function () {
      var raw = window.prompt(
        "Nombre interno del paquete nuevo (sin espacios, ej. beagle o golden_retriever):"
      );
      if (raw == null) return;
      var id = slugify(raw);
      if (!id) {
        window.alert("Nombre inválido.");
        return;
      }
      var items = this.getItems();
      if (
        items.some(function (p) {
          return p.id === id;
        })
      ) {
        window.alert("Ya existe un paquete con id “" + id + "”.");
        return;
      }

      items.push({
        id: id,
        cover: "",
        gallery: [],
        titleColor: "text-white",
        info: defaultInfo(id),
        copy: emptyCopy(),
      });
      this.commit(items);
      this.setState({ editIndex: items.length - 1, lang: "es" });

      window.alert(
        "Paquete “" +
          packageLabel(id) +
          "” creado.\n\nSubí las fotos y completá el título y la descripción en Español y en English, en esta misma card."
      );
    },

    handleDeletePackage: function (index, e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!window.confirm("¿Quitar este paquete de la lista?")) return;
      var items = this.getItems();
      items.splice(index, 1);
      this.commit(items);
      if (this.state.editIndex === index) this.setState({ editIndex: null });
      else if (this.state.editIndex > index) {
        this.setState({ editIndex: this.state.editIndex - 1 });
      }
    },

    handleDragStart: function (index, e) {
      this.setState({ dragIndex: index });
      try {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
      } catch (err) {}
    },

    handleDragOver: function (index, e) {
      e.preventDefault();
      if (this.state.overIndex !== index) this.setState({ overIndex: index });
    },

    handleDrop: function (index, e) {
      e.preventDefault();
      var from = this.state.dragIndex;
      this.setState({ dragIndex: null, overIndex: null });
      if (from == null || from === index) return;
      var items = this.getItems();
      var moved = items.splice(from, 1)[0];
      items.splice(index, 0, moved);
      this.commit(items);
      if (this.state.editIndex === from) this.setState({ editIndex: index });
    },

    handleDragEnd: function () {
      this.setState({ dragIndex: null, overIndex: null });
    },

    setCopy: function (index, lang, key, text) {
      var items = this.getItems();
      var pkg = Object.assign({}, items[index]);
      var copy = normalizeCopy(pkg.copy);
      copy[lang] = Object.assign({}, copy[lang]);
      copy[lang][key] = text;
      pkg.copy = copy;
      items[index] = pkg;
      this.commit(items);
    },

    updatePkg: function (index, patch) {
      var items = this.getItems();
      items[index] = Object.assign({}, items[index], patch);
      this.commit(items);
    },

    setInfoText: function (index, key, lang, text) {
      var items = this.getItems();
      var pkg = Object.assign({}, items[index]);
      var info = normalizeInfo(pkg.info);
      info[key] = Object.assign({}, info[key]);
      info[key][lang] = text;
      pkg.info = info;
      items[index] = pkg;
      this.commit(items);
    },

    setInfo: function (index, patch) {
      var items = this.getItems();
      var pkg = Object.assign({}, items[index]);
      pkg.info = Object.assign(normalizeInfo(pkg.info), patch);
      items[index] = pkg;
      this.commit(items);
    },

    setCoverFromGallery: function (pkgIndex, galleryIndex) {
      var items = this.getItems();
      var pkg = Object.assign({}, items[pkgIndex]);
      var src = pkg.gallery[galleryIndex];
      if (!src) return;
      pkg.cover = src;
      items[pkgIndex] = pkg;
      this.commit(items);
    },

    deleteGalleryItem: function (pkgIndex, galleryIndex, e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!window.confirm("¿Borrar esta foto de la galería?")) return;
      var items = this.getItems();
      var pkg = Object.assign({}, items[pkgIndex]);
      var gallery = pkg.gallery.slice();
      var removed = gallery.splice(galleryIndex, 1)[0];
      pkg.gallery = gallery;
      if (pkg.cover === removed) pkg.cover = gallery[0] || "";
      items[pkgIndex] = pkg;
      this.commit(items);
    },

    handleGDragStart: function (index, e) {
      this.setState({ gDragIndex: index });
      try {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
      } catch (err) {}
    },

    handleGDragOver: function (index, e) {
      e.preventDefault();
      if (this.state.gOverIndex !== index) this.setState({ gOverIndex: index });
    },

    handleGDrop: function (pkgIndex, index, e) {
      e.preventDefault();
      var from = this.state.gDragIndex;
      this.setState({ gDragIndex: null, gOverIndex: null });
      if (from == null || from === index) return;
      var items = this.getItems();
      var pkg = Object.assign({}, items[pkgIndex]);
      var gallery = pkg.gallery.slice();
      var moved = gallery.splice(from, 1)[0];
      gallery.splice(index, 0, moved);
      pkg.gallery = gallery;
      items[pkgIndex] = pkg;
      this.commit(items);
    },

    handleGDragEnd: function () {
      this.setState({ gDragIndex: null, gOverIndex: null });
    },

    renderPackageCard: function (pkg, index) {
      var self = this;
      var url = toPublicUrl(pkg.cover);
      var selected = this.state.editIndex === index;
      var dragging = this.state.dragIndex === index;
      var over = this.state.overIndex === index && this.state.dragIndex != null;

      return h(
        "div",
        {
          key: pkg.id + "-" + index,
          className:
            "pg-card" +
            (selected ? " is-selected" : "") +
            (dragging ? " is-dragging" : "") +
            (over ? " is-over" : ""),
          draggable: true,
          onDragStart: function (e) {
            self.handleDragStart(index, e);
          },
          onDragOver: function (e) {
            self.handleDragOver(index, e);
          },
          onDrop: function (e) {
            self.handleDrop(index, e);
          },
          onDragEnd: function () {
            self.handleDragEnd();
          },
          onClick: function () {
            self.setState({
              editIndex: self.state.editIndex === index ? null : index,
            });
          },
        },
        url
          ? previewImg(pkg.cover, "", self.props.getAsset, self.props.field)
          : h("div", { className: "pg-ph" }, "Sin cover"),
        h("span", { className: "pg-name" }, cardName(pkg)),
        h(
          "span",
          { className: "pg-count" },
          (pkg.gallery.length || 0) + " en galería"
        )
      );
    },

    renderEditor: function () {
      var index = this.state.editIndex;
      if (index == null) return null;
      var items = this.getItems();
      var pkg = items[index];
      if (!pkg) return null;
      var self = this;
      var coverUrl = toPublicUrl(pkg.cover);
      var lang = this.state.lang === "en" ? "en" : "es";
      var localeCopy = (pkg.copy && pkg.copy[lang]) || { title: "", description: "" };
      var info = pkg.info || emptyInfo();
      var place = info.place || "";

      return h(
        "div",
        { className: "pg-panel" },
        h("h4", {}, packageLabel(pkg.id)),
        h(
          "p",
          { className: "pg-sub" },
          "Título, descripción, duración, fotos y lugar siguen la pestaña de idioma. Enter en el título baja de línea."
        ),
        h(
          "div",
          { className: "pg-tabs" },
          h(
            "button",
            {
              type: "button",
              className: "pg-tab" + (lang === "es" ? " is-on" : ""),
              onClick: function () {
                self.setState({ lang: "es" });
              },
            },
            "Español"
          ),
          h(
            "button",
            {
              type: "button",
              className: "pg-tab" + (lang === "en" ? " is-on" : ""),
              onClick: function () {
                self.setState({ lang: "en" });
              },
            },
            "English"
          )
        ),
        h("label", {}, "Título"),
        h("textarea", {
          className: "pg-area",
          rows: 2,
          value: localeCopy.title || "",
          spellCheck: true,
          onChange: function (event) {
            self.setCopy(index, lang, "title", event.target.value);
          },
        }),
        h("label", {}, "Descripción"),
        h("textarea", {
          className: "pg-area",
          rows: 4,
          value: localeCopy.description || "",
          spellCheck: true,
          onChange: function (event) {
            self.setCopy(index, lang, "description", event.target.value);
          },
        }),
        h("label", {}, "Duración"),
        h("input", {
          className: "pg-line",
          type: "text",
          value: (info.duration && info.duration[lang]) || "",
          spellCheck: true,
          placeholder: lang === "en" ? "60 to 90 min" : "60 min",
          onChange: function (event) {
            self.setInfoText(index, "duration", lang, event.target.value);
          },
        }),
        h("label", {}, "Cantidad de fotos"),
        h("input", {
          className: "pg-line",
          type: "text",
          value: (info.photos && info.photos[lang]) || "",
          spellCheck: true,
          placeholder:
            lang === "en" ? "5 edited digital photos" : "5 fotos editadas digitales",
          onChange: function (event) {
            self.setInfoText(index, "photos", lang, event.target.value);
          },
        }),
        h(
          "label",
          { className: "pg-check" },
          h("input", {
            type: "checkbox",
            checked: !!info.treats,
            onChange: function (event) {
              self.setInfo(index, { treats: event.target.checked });
            },
          }),
          "Incluye premios comestibles"
        ),
        h("label", {}, "Lugar"),
        h(
          "div",
          { className: "pg-chips" },
          [
            { id: "", label: "Ninguno" },
            { id: "studio", label: "Estudio" },
            { id: "outdoor", label: "Exterior" },
          ].map(function (opt) {
            return h(
              "button",
              {
                key: opt.id || "none",
                type: "button",
                className: "pg-chip" + (place === opt.id ? " is-on" : ""),
                onClick: function () {
                  self.setInfo(index, { place: opt.id });
                },
              },
              opt.label
            );
          })
        ),
        place
          ? h("input", {
              className: "pg-line",
              type: "text",
              value: (info.placeText && info.placeText[lang]) || "",
              spellCheck: true,
              placeholder:
                place === "outdoor"
                  ? lang === "en"
                    ? "Outdoor, 1 location"
                    : "Exterior, 1 locación"
                  : lang === "en"
                    ? "Studio (Recoleta)"
                    : "Estudio (Recoleta)",
              onChange: function (event) {
                self.setInfoText(index, "placeText", lang, event.target.value);
              },
            })
          : null,

        h("label", {}, "Id interno"),
        h("input", {
          className: "pg-input",
          type: "text",
          value: pkg.id,
          onChange: function (e) {
            var next = slugify(e.target.value);
            if (!next) return;
            var clash = items.some(function (p, i) {
              return i !== index && p.id === next;
            });
            if (clash) return;
            self.updatePkg(index, { id: next });
          },
        }),

        h("label", {}, "Foto de la card (cover)"),
        h(
          "div",
          { className: "pg-cover-row" },
          h(
            "div",
            { className: "pg-cover-preview" },
            coverUrl
              ? previewImg(pkg.cover, "", self.props.getAsset, self.props.field)
              : h("div", { className: "pg-ph" }, "Sin cover")
          ),
          h(
            "div",
            {},
            h(
              "button",
              {
                type: "button",
                className: "pg-btn",
                onClick: function () {
                  self.openMedia("cover", false);
                },
              },
              "Cambiar cover"
            )
          )
        ),

        h("label", {}, "Color del título en la card"),
        h(
          "div",
          { className: "pg-chips" },
          h(
            "button",
            {
              type: "button",
              className:
                "pg-chip" + (pkg.titleColor === "text-black" ? " is-on" : ""),
              onClick: function () {
                self.updatePkg(index, { titleColor: "text-black" });
              },
            },
            "Negro"
          ),
          h(
            "button",
            {
              type: "button",
              className:
                "pg-chip" + (pkg.titleColor === "text-white" ? " is-on" : ""),
              onClick: function () {
                self.updatePkg(index, { titleColor: "text-white" });
              },
            },
            "Blanco"
          )
        ),

        h("label", {}, "Galería del modal"),
        h(
          "div",
          { className: "pg-chips", style: { marginBottom: "8px" } },
          h(
            "button",
            {
              type: "button",
              className: "pg-btn",
              onClick: function () {
                self.openMedia("gallery", true);
              },
            },
            "Agregar fotos a la galería"
          )
        ),
        pkg.gallery.length
          ? h(
              "div",
              { className: "pg-ggrid" },
              pkg.gallery.map(function (src, gIndex) {
                var url = toPublicUrl(src);
                var isCover = src === pkg.cover;
                var dragging = self.state.gDragIndex === gIndex;
                var over =
                  self.state.gOverIndex === gIndex && self.state.gDragIndex != null;
                return h(
                  "div",
                  {
                    key: src + "-" + gIndex,
                    className:
                      "pg-gcard" +
                      (dragging ? " is-dragging" : "") +
                      (over ? " is-over" : ""),
                    draggable: true,
                    onDragStart: function (e) {
                      self.handleGDragStart(gIndex, e);
                    },
                    onDragOver: function (e) {
                      self.handleGDragOver(gIndex, e);
                    },
                    onDrop: function (e) {
                      self.handleGDrop(index, gIndex, e);
                    },
                    onDragEnd: function () {
                      self.handleGDragEnd();
                    },
                    onClick: function (e) {
                      e.stopPropagation();
                      self.setCoverFromGallery(index, gIndex);
                    },
                    title: "Click = usar como cover",
                  },
                  url ? previewImg(src, "", self.props.getAsset, self.props.field) : null,
                  isCover ? h("span", { className: "pg-star" }, "Cover") : null,
                  h(
                    "button",
                    {
                      type: "button",
                      className: "pg-gdel",
                      onClick: function (e) {
                        self.deleteGalleryItem(index, gIndex, e);
                      },
                    },
                    "×"
                  )
                );
              })
            )
          : h(
              "div",
              { className: "pg-empty" },
              "Sin fotos en la galería. Agregá al menos una."
            ),

        h(
          "div",
          { style: { marginTop: "16px" } },
          h(
            "button",
            {
              type: "button",
              className: "pg-btn secondary",
              onClick: function () {
                self.handleDeletePackage(index);
              },
            },
            "Quitar paquete de la lista"
          )
        )
      );
    },

    render: function () {
      ensureStyles();
      var self = this;
      var items = this.getItems();

      return h(
        "div",
        { className: "pg-wrap " + (this.props.classNameWrapper || "") },
        h(
          "div",
          { className: "pg-toolbar" },
          h(
            "p",
            { className: "pg-hint" },
            items.length +
              " paquetes · Click = editar · Arrastrá = orden"
          ),
          h(
            "button",
            {
              type: "button",
              className: "pg-btn",
              onClick: function () {
                self.handleAddPackage();
              },
            },
            "Agregar paquete"
          )
        ),
        items.length
          ? h(
              "div",
              { className: "pg-grid" },
              items.map(function (pkg, index) {
                return self.renderPackageCard(pkg, index);
              })
            )
          : h(
              "div",
              { className: "pg-empty" },
              "No hay paquetes. Tocá “Agregar paquete”."
            ),
        this.renderEditor()
      );
    },
  });

  CMS.registerWidget("packages-grid", PackagesGridControl);
  console.info("[packages-grid] widget registered");
})();
