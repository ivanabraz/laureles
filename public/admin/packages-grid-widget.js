/**
 * Decap widget for packages: visual cards (cover) + edit cover/gallery/titleColor.
 * Value: [{ id, cover, gallery: string[], titleColor }]
 */
(function () {
  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  if (!CMS || !createClass || !h) {
    console.error("[packages-grid] Decap CMS APIs missing");
    return;
  }

  var SITE = "https://laureles.netlify.app";
  var MAX_BYTES = 1024 * 1024;

  var PACKAGE_LABELS = {
    chihuahua: "Chihuahua",
    galgo: "Galgo",
    akita: "Akita",
    pug: "Pug",
    mestizo: "Mestizo",
    dogo: "Dogo",
    gift_card: "Gift card",
  };

  var PACKAGE_IDS = Object.keys(PACKAGE_LABELS);

  function toPublicUrl(src) {
    if (!src) return "";
    if (/^https?:\/\//i.test(src)) return src;
    return SITE + (src.charAt(0) === "/" ? src : "/" + src);
  }

  function asArray(value) {
    if (!value) return [];
    if (typeof value.toJS === "function") return value.toJS();
    return Array.isArray(value) ? value.slice() : [];
  }

  function normalizePkg(pkg) {
    var gallery = asArray(pkg.gallery).map(function (g) {
      return typeof g === "string" ? g : g && (g.src || g.image) || "";
    }).filter(Boolean);
    return {
      id: pkg.id || "chihuahua",
      cover: pkg.cover || gallery[0] || "",
      gallery: gallery.length ? gallery : pkg.cover ? [pkg.cover] : [],
      titleColor: pkg.titleColor || "text-white",
    };
  }

  var styleTagId = "laureles-packages-grid-css";
  function ensureStyles() {
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
      ".pg-panel .pg-sub{margin:0 0 14px;font-size:12px;color:#666}",
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
    ].join("");
    document.head.appendChild(style);
  }

  var PackagesGridControl = createClass({
    getInitialState: function () {
      return {
        editIndex: null,
        dragIndex: null,
        overIndex: null,
        gDragIndex: null,
        gOverIndex: null,
        mediaTarget: null, // 'cover' | 'gallery'
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

      var incoming = Array.isArray(mediaPath) ? mediaPath : [mediaPath];
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
      this.props.onChange(items);
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
    },

    handleDragEnd: function () {
      this.setState({ dragIndex: null, overIndex: null });
    },

    updatePkg: function (index, patch) {
      var items = this.getItems();
      items[index] = Object.assign({}, items[index], patch);
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

    addMissingPackages: function () {
      var items = this.getItems();
      var have = {};
      items.forEach(function (p) {
        have[p.id] = true;
      });
      var added = false;
      PACKAGE_IDS.forEach(function (id) {
        if (!have[id]) {
          items.push({
            id: id,
            cover: "",
            gallery: [],
            titleColor: id === "chihuahua" || id === "galgo" || id === "akita" ? "text-black" : "text-white",
          });
          added = true;
        }
      });
      if (added) this.commit(items);
      else window.alert("Ya están los 7 paquetes.");
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
          ? h("img", { src: url, alt: "", loading: "lazy" })
          : h("div", { className: "pg-ph" }, "Sin cover"),
        h("span", { className: "pg-name" }, PACKAGE_LABELS[pkg.id] || pkg.id),
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

      return h(
        "div",
        { className: "pg-panel" },
        h("h4", {}, PACKAGE_LABELS[pkg.id] || pkg.id),
        h(
          "p",
          { className: "pg-sub" },
          "Los textos del paquete se editan en el Google Sheet. Acá solo fotos y color del título."
        ),

        h("label", {}, "Foto de la card (cover)"),
        h(
          "div",
          { className: "pg-cover-row" },
          h(
            "div",
            { className: "pg-cover-preview" },
            coverUrl
              ? h("img", { src: coverUrl, alt: "" })
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
                  url ? h("img", { src: url, alt: "" }) : null,
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
              " paquetes · Click = editar cover/galería · Arrastrá = orden en el sitio"
          ),
          h(
            "button",
            {
              type: "button",
              className: "pg-btn",
              onClick: function () {
                self.addMissingPackages();
              },
            },
            "Completar paquetes faltantes"
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
              "No hay paquetes. Tocá “Completar paquetes faltantes”."
            ),
        this.renderEditor()
      );
    },
  });

  CMS.registerWidget("packages-grid", PackagesGridControl);
  console.info("[packages-grid] widget registered");
})();
