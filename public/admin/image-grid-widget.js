/**
 * Decap custom widget: visual image grid with drag-reorder and hover delete.
 *
 * Modes:
 * - default / unified: [{ src, category?, style, text?, href? }]
 * - paths_only: ["path", ...]
 */
(function () {
  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  if (!CMS || !createClass || !h) {
    console.error("[image-grid] Decap CMS APIs missing");
    return;
  }

  var SITE = "https://laureles.netlify.app";
  var MAX_BYTES = 1024 * 1024;
  var CATEGORIES = [
    { value: "family", label: "Family" },
    { value: "brands", label: "Brands" },
    { value: "shelters", label: "Shelters" },
    { value: "specials", label: "Specials" },
  ];
  var STYLES = [
    { value: "studio", label: "Estudio" },
    { value: "outdoor", label: "Exterior" },
  ];

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

  function normalizeItem(item, pathsOnly, unified) {
    if (pathsOnly) {
      if (typeof item === "string") return item;
      return (item && (item.src || item.image || "")) || "";
    }
    if (typeof item === "string") {
      return {
        src: item,
        category: unified ? "family" : undefined,
        style: "studio",
        text: "",
        href: "",
      };
    }
    var next = {
      src: item.src || item.image || "",
      style: item.style || "studio",
      text: item.text || "",
      href: item.href || "",
    };
    if (unified) next.category = item.category || "family";
    return next;
  }

  function itemSrc(item, pathsOnly) {
    if (pathsOnly) return typeof item === "string" ? item : item && item.src;
    return item && item.src;
  }

  function categoryLabel(value) {
    var found = CATEGORIES.find(function (c) {
      return c.value === value;
    });
    return found ? found.label : value || "";
  }

  function styleLabel(value) {
    return value === "outdoor" ? "Exterior" : "Estudio";
  }

  var styleTagId = "laureles-image-grid-css";
  function ensureStyles() {
    if (document.getElementById(styleTagId)) return;
    var style = document.createElement("style");
    style.id = styleTagId;
    style.textContent = [
      ".ig-wrap{font-family:system-ui,-apple-system,sans-serif}",
      ".ig-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px;flex-wrap:wrap}",
      ".ig-hint{color:#666;font-size:13px;margin:0}",
      ".ig-btn{appearance:none;border:0;border-radius:999px;padding:10px 16px;font-size:14px;font-weight:600;cursor:pointer;background:#222;color:#fff}",
      ".ig-btn:hover{background:#000}",
      ".ig-filters{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:14px}",
      ".ig-filter{appearance:none;border:1px solid #ddd;background:#fff;border-radius:999px;padding:6px 12px;font-size:12px;cursor:pointer;color:#444}",
      ".ig-filter.is-on{background:#222;border-color:#222;color:#fff}",
      ".ig-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}",
      ".ig-card{position:relative;aspect-ratio:2/3;border-radius:10px;overflow:hidden;background:#eee;cursor:grab;user-select:none;box-shadow:0 1px 3px rgba(0,0,0,.12)}",
      ".ig-card:active{cursor:grabbing}",
      ".ig-card.is-dragging{opacity:.45}",
      ".ig-card.is-over{outline:3px solid #df4c8a;outline-offset:2px}",
      ".ig-card.is-selected{outline:3px solid #df4c8a;outline-offset:2px}",
      ".ig-card.is-hidden{display:none}",
      ".ig-card img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}",
      ".ig-card .ig-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;text-align:center;padding:8px}",
      ".ig-badges{position:absolute;left:8px;top:8px;display:flex;flex-direction:column;gap:4px;max-width:75%}",
      ".ig-badge{background:rgba(255,255,255,.92);border-radius:999px;padding:3px 8px;font-size:10px;font-weight:600;color:#222;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".ig-pill{position:absolute;left:8px;bottom:8px;background:rgba(255,255,255,.95);border-radius:999px;padding:4px 10px;font-size:11px;font-weight:600;color:#111;max-width:calc(100% - 16px);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
      ".ig-del{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:18px;line-height:1;cursor:pointer;opacity:0;transition:opacity .15s;display:flex;align-items:center;justify-content:center}",
      ".ig-card:hover .ig-del{opacity:1}",
      ".ig-del:hover{background:#c62828}",
      ".ig-meta{margin:0 0 16px;padding:16px;border:1px solid #e5e5e5;border-radius:12px;background:#fff;box-shadow:0 4px 16px rgba(0,0,0,.06);position:sticky;top:8px;z-index:5}",
      ".ig-meta h4{margin:0 0 6px;font-size:15px}",
      ".ig-meta .ig-meta-sub{margin:0 0 12px;font-size:12px;color:#666}",
      ".ig-meta label{display:block;font-size:12px;font-weight:600;margin:10px 0 4px}",
      ".ig-meta input{width:100%;padding:8px 10px;border:1px solid #ccc;border-radius:8px;font-size:14px;box-sizing:border-box}",
      ".ig-style-row{display:flex;gap:8px;flex-wrap:wrap}",
      ".ig-chip{appearance:none;border:1px solid #ccc;background:#fff;border-radius:999px;padding:8px 14px;font-size:13px;cursor:pointer}",
      ".ig-chip.is-on{background:#222;border-color:#222;color:#fff}",
      ".ig-meta-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}",
      ".ig-edit-btn{position:absolute;left:50%;bottom:40px;transform:translateX(-50%);appearance:none;border:0;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer;background:rgba(0,0,0,.7);color:#fff;opacity:0;transition:opacity .15s;white-space:nowrap;z-index:2}",
      ".ig-card:hover .ig-edit-btn{opacity:1}",
      ".ig-empty{padding:28px;border:2px dashed #ccc;border-radius:12px;text-align:center;color:#777}",
    ].join("");
    document.head.appendChild(style);
  }

  var ImageGridControl = createClass({
    getInitialState: function () {
      return {
        dragIndex: null,
        overIndex: null,
        editIndex: null,
        filterCategory: "all",
        filterStyle: "all",
        defaultCategory: "family",
        didDrag: false,
      };
    },

    componentDidMount: function () {
      ensureStyles();
      this._controlID = "ig-" + Math.random().toString(36).slice(2);
    },

    componentDidUpdate: function (prevProps) {
      var paths = this.props.mediaPaths;
      if (!paths || typeof paths.get !== "function") return;
      var mediaPath = paths.get(this._controlID);
      if (!mediaPath) return;
      var prevPath = prevProps.mediaPaths && prevProps.mediaPaths.get(this._controlID);
      if (mediaPath === prevPath) return;

      var incoming = Array.isArray(mediaPath) ? mediaPath : [mediaPath];
      var pathsOnly = this.isPathsOnly();
      var unified = this.isUnified();
      var items = this.getItems();
      var changed = false;
      var cat = this.state.defaultCategory || "family";

      incoming.forEach(function (p) {
        if (!p) return;
        var exists = items.some(function (it) {
          return itemSrc(it, pathsOnly) === p;
        });
        if (exists) return;
        if (pathsOnly) items.push(p);
        else {
          var row = { src: p, style: "studio", text: "", href: "" };
          if (unified) row.category = cat;
          items.push(row);
        }
        changed = true;
      });

      if (changed) this.commit(items);
      if (this.props.onRemoveInsertedMedia) {
        this.props.onRemoveInsertedMedia(this._controlID);
      }
    },

    isPathsOnly: function () {
      var field = this.props.field;
      return !!(field && field.get && field.get("paths_only"));
    },

    isUnified: function () {
      var field = this.props.field;
      return !!(field && field.get && field.get("unified"));
    },

    getItems: function () {
      var pathsOnly = this.isPathsOnly();
      var unified = this.isUnified();
      return asArray(this.props.value).map(function (item) {
        return normalizeItem(item, pathsOnly, unified);
      });
    },

    commit: function (items) {
      this.props.onChange(items);
    },

    visibleIndexes: function () {
      var items = this.getItems();
      var unified = this.isUnified();
      var fc = this.state.filterCategory;
      var fs = this.state.filterStyle;
      var out = [];
      items.forEach(function (item, index) {
        if (!unified) {
          out.push(index);
          return;
        }
        var catOk = fc === "all" || item.category === fc;
        var styleOk = fs === "all" || item.style === fs;
        if (catOk && styleOk) out.push(index);
      });
      return out;
    },

    handleAdd: function () {
      if (this.isUnified() && this.state.filterCategory !== "all") {
        this.setState({ defaultCategory: this.state.filterCategory });
      }
      if (typeof this.props.onOpenMediaLibrary === "function") {
        this.props.onOpenMediaLibrary({
          controlID: this._controlID,
          forImage: true,
          allowMultiple: true,
          field: this.props.field,
        });
        return;
      }
      if (this._fileInput) this._fileInput.click();
    },

    handleLocalFiles: function (e) {
      e.target.value = "";
      window.alert(
        "No se pudo abrir la biblioteca de medios. Guardá, publicá, y volvé a intentar."
      );
    },

    handleDelete: function (index, e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!window.confirm("¿Borrar esta foto?")) return;
      var items = this.getItems();
      items.splice(index, 1);
      this.commit(items);
      if (this.state.editIndex === index) this.setState({ editIndex: null });
    },

    handleDragStart: function (index, e) {
      this.setState({ dragIndex: index, didDrag: false });
      try {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
      } catch (err) {}
    },

    handleDragOver: function (index, e) {
      e.preventDefault();
      if (this.state.dragIndex != null && this.state.dragIndex !== index) {
        this.setState({ didDrag: true });
      }
      if (this.state.overIndex !== index) this.setState({ overIndex: index });
    },

    handleDrop: function (index, e) {
      e.preventDefault();
      var from = this.state.dragIndex;
      this.setState({ dragIndex: null, overIndex: null, didDrag: true });
      if (from == null || from === index) return;
      var items = this.getItems();
      var moved = items.splice(from, 1)[0];
      items.splice(index, 0, moved);
      this.commit(items);
    },

    handleDragEnd: function () {
      this.setState({ dragIndex: null, overIndex: null });
    },

    handleCardClick: function (index) {
      if (this.isPathsOnly()) return;
      if (this.state.didDrag) {
        this.setState({ didDrag: false });
        return;
      }
      this.setState({ editIndex: index });
    },

    updateItem: function (index, patch) {
      var items = this.getItems();
      if (this.isPathsOnly()) return;
      items[index] = Object.assign({}, items[index], patch);
      this.commit(items);
      if (patch.category) this.setState({ defaultCategory: patch.category });
    },

    renderFilters: function () {
      if (!this.isUnified()) return null;
      var self = this;
      var fc = this.state.filterCategory;
      var fs = this.state.filterStyle;

      var chips = [{ value: "all", label: "Todas" }].concat(CATEGORIES);
      var styleChips = [{ value: "all", label: "Todos los lugares" }].concat(STYLES);

      return h(
        "div",
        {},
        h(
          "div",
          { className: "ig-filters" },
          chips.map(function (c) {
            return h(
              "button",
              {
                key: "cat-" + c.value,
                type: "button",
                className: "ig-filter" + (fc === c.value ? " is-on" : ""),
                onClick: function () {
                  self.setState({
                    filterCategory: c.value,
                    defaultCategory: c.value === "all" ? self.state.defaultCategory : c.value,
                  });
                },
              },
              c.label
            );
          })
        ),
        h(
          "div",
          { className: "ig-filters" },
          styleChips.map(function (c) {
            return h(
              "button",
              {
                key: "st-" + c.value,
                type: "button",
                className: "ig-filter" + (fs === c.value ? " is-on" : ""),
                onClick: function () {
                  self.setState({ filterStyle: c.value });
                },
              },
              c.label
            );
          })
        )
      );
    },

    renderCard: function (item, index, visible) {
      var self = this;
      var pathsOnly = this.isPathsOnly();
      var unified = this.isUnified();
      var src = itemSrc(item, pathsOnly);
      var url = toPublicUrl(src);
      var style = pathsOnly ? "" : item.style || "studio";
      var pill = !pathsOnly && item.text ? item.text : "";
      var category = unified ? item.category || "family" : "";
      var dragging = this.state.dragIndex === index;
      var over = this.state.overIndex === index && this.state.dragIndex != null;
      var selected = this.state.editIndex === index;

      return h(
        "div",
        {
          key: (src || "empty") + "-" + index,
          className:
            "ig-card" +
            (dragging ? " is-dragging" : "") +
            (over ? " is-over" : "") +
            (selected ? " is-selected" : "") +
            (visible ? "" : " is-hidden"),
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
            self.handleCardClick(index);
          },
        },
        url
          ? h("img", {
              src: url,
              alt: "",
              loading: "lazy",
              onError: function (ev) {
                ev.target.style.display = "none";
                if (ev.target.nextSibling) ev.target.nextSibling.style.display = "flex";
              },
            })
          : null,
        h(
          "div",
          { className: "ig-ph", style: { display: url ? "none" : "flex" } },
          "Sin imagen"
        ),
        h(
          "div",
          { className: "ig-badges" },
          category
            ? h("span", { className: "ig-badge" }, categoryLabel(category))
            : null,
          style ? h("span", { className: "ig-badge" }, styleLabel(style)) : null
        ),
        pill ? h("span", { className: "ig-pill" }, pill) : null,
        !pathsOnly
          ? h(
              "button",
              {
                type: "button",
                className: "ig-edit-btn",
                onClick: function (e) {
                  e.preventDefault();
                  e.stopPropagation();
                  self.setState({ editIndex: index, didDrag: false });
                },
              },
              "Editar tags"
            )
          : null,
        h(
          "button",
          {
            type: "button",
            className: "ig-del",
            title: "Borrar",
            onClick: function (e) {
              self.handleDelete(index, e);
            },
          },
          "×"
        )
      );
    },

    renderEditor: function () {
      var index = this.state.editIndex;
      if (index == null) return null;
      var items = this.getItems();
      var item = items[index];
      if (!item || this.isPathsOnly()) return null;
      var self = this;
      var unified = this.isUnified();
      var style = item.style || "studio";
      var category = item.category || "family";
      var thumb = toPublicUrl(item.src);

      return h(
        "div",
        { className: "ig-meta" },
        h("h4", {}, "Editar tags"),
        h(
          "p",
          { className: "ig-meta-sub" },
          "Foto seleccionada" +
            (item.src ? " · " + item.src.split("/").pop() : "") +
            ". Cambiá categoría, lugar o pastilla y después Publish."
        ),
        thumb
          ? h("img", {
              src: thumb,
              alt: "",
              style: {
                width: "72px",
                height: "108px",
                objectFit: "cover",
                borderRadius: "8px",
                marginBottom: "8px",
              },
            })
          : null,
        unified
          ? h(
              "div",
              {},
              h("label", {}, "Categoría"),
              h(
                "div",
                { className: "ig-style-row" },
                CATEGORIES.map(function (c) {
                  return h(
                    "button",
                    {
                      key: c.value,
                      type: "button",
                      className: "ig-chip" + (category === c.value ? " is-on" : ""),
                      onClick: function () {
                        self.updateItem(index, { category: c.value });
                      },
                    },
                    c.label
                  );
                })
              )
            )
          : null,
        h("label", {}, "Lugar"),
        h(
          "div",
          { className: "ig-style-row" },
          STYLES.map(function (s) {
            return h(
              "button",
              {
                key: s.value,
                type: "button",
                className: "ig-chip" + (style === s.value ? " is-on" : ""),
                onClick: function () {
                  self.updateItem(index, { style: s.value });
                },
              },
              s.label
            );
          })
        ),
        h("label", {}, "Pastilla (nombre)"),
        h("input", {
          type: "text",
          value: item.text || "",
          placeholder: "Ej. CATdopciones, 3organicspets…",
          onChange: function (e) {
            self.updateItem(index, { text: e.target.value });
          },
        }),
        h("label", {}, "Pastilla (link)"),
        h("input", {
          type: "url",
          value: item.href || "",
          placeholder: "https://instagram.com/…",
          onChange: function (e) {
            self.updateItem(index, { href: e.target.value });
          },
        }),
        h(
          "div",
          { className: "ig-meta-actions" },
          h(
            "button",
            {
              type: "button",
              className: "ig-chip",
              onClick: function () {
                self.setState({ editIndex: null });
              },
            },
            "Cerrar"
          )
        )
      );
    },

    render: function () {
      ensureStyles();
      var self = this;
      var items = this.getItems();
      var visible = this.visibleIndexes();
      var visibleSet = {};
      visible.forEach(function (i) {
        visibleSet[i] = true;
      });

      return h(
        "div",
        { className: "ig-wrap " + (this.props.classNameWrapper || "") },
        h(
          "div",
          { className: "ig-toolbar" },
          h(
            "p",
            { className: "ig-hint" },
            visible.length +
              " de " +
              items.length +
              " · Hover “Editar tags” o click en la foto · Arrastrá = orden · × = borrar"
          ),
          h(
            "button",
            {
              type: "button",
              className: "ig-btn",
              onClick: function () {
                self.handleAdd();
              },
            },
            "Agregar fotos"
          )
        ),
        this.renderFilters(),
        this.renderEditor(),
        h("input", {
          type: "file",
          accept: "image/*",
          multiple: true,
          style: { display: "none" },
          ref: function (el) {
            self._fileInput = el;
          },
          onChange: function (e) {
            self.handleLocalFiles(e);
          },
        }),
        items.length
          ? h(
              "div",
              { className: "ig-grid" },
              items.map(function (item, index) {
                return self.renderCard(item, index, !!visibleSet[index]);
              })
            )
          : h(
              "div",
              { className: "ig-empty" },
              "Todavía no hay fotos. Tocá “Agregar fotos”."
            ),
        visible.length === 0 && items.length > 0
          ? h(
              "div",
              { className: "ig-empty" },
              "No hay fotos con esos filtros."
            )
          : null
      );
    },
  });

  CMS.registerWidget("image-grid", ImageGridControl);
  console.info("[image-grid] widget registered (unified ready)");
})();
