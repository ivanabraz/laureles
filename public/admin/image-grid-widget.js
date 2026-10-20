/**
 * Decap custom widget: visual image grid with drag-reorder and hover delete.
 * Value: [{ src, style, text?, href? }]  or  ["path", ...] if paths_only: true
 */
(function () {
  // Decap 3 exposes these on window (not CMS.*)
  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  if (!CMS || !createClass || !h) {
    console.error(
      "[image-grid] Decap CMS APIs missing. CMS:",
      !!CMS,
      "createClass:",
      !!createClass,
      "h:",
      !!h
    );
    return;
  }

  var SITE = "https://laureles.netlify.app";
  var MAX_BYTES = 1024 * 1024;

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

  function normalizeItem(item, pathsOnly) {
    if (pathsOnly) {
      if (typeof item === "string") return item;
      return item && (item.src || item.image || "") || "";
    }
    if (typeof item === "string") return { src: item, style: "studio" };
    return {
      src: item.src || item.image || "",
      style: item.style || "studio",
      text: item.text || "",
      href: item.href || "",
    };
  }

  function itemSrc(item, pathsOnly) {
    if (pathsOnly) return typeof item === "string" ? item : item && item.src;
    return item && item.src;
  }

  var styleTagId = "laureles-image-grid-css";
  function ensureStyles() {
    if (document.getElementById(styleTagId)) return;
    var style = document.createElement("style");
    style.id = styleTagId;
    style.textContent = [
      ".ig-wrap{font-family:system-ui,-apple-system,sans-serif}",
      ".ig-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap}",
      ".ig-hint{color:#666;font-size:13px;margin:0}",
      ".ig-btn{appearance:none;border:0;border-radius:999px;padding:10px 16px;font-size:14px;font-weight:600;cursor:pointer;background:#222;color:#fff}",
      ".ig-btn:hover{background:#000}",
      ".ig-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}",
      ".ig-card{position:relative;aspect-ratio:2/3;border-radius:10px;overflow:hidden;background:#eee;cursor:grab;user-select:none;box-shadow:0 1px 3px rgba(0,0,0,.12)}",
      ".ig-card:active{cursor:grabbing}",
      ".ig-card.is-dragging{opacity:.45}",
      ".ig-card.is-over{outline:3px solid #df4c8a;outline-offset:2px}",
      ".ig-card img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}",
      ".ig-card .ig-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;text-align:center;padding:8px}",
      ".ig-badge{position:absolute;left:8px;top:8px;background:rgba(255,255,255,.92);border-radius:999px;padding:3px 8px;font-size:11px;font-weight:600;color:#222}",
      ".ig-del{position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:18px;line-height:1;cursor:pointer;opacity:0;transition:opacity .15s;display:flex;align-items:center;justify-content:center}",
      ".ig-card:hover .ig-del{opacity:1}",
      ".ig-del:hover{background:#c62828}",
      ".ig-meta{margin-top:16px;padding:14px;border:1px solid #ddd;border-radius:10px;background:#fafafa}",
      ".ig-meta h4{margin:0 0 10px;font-size:14px}",
      ".ig-meta label{display:block;font-size:12px;font-weight:600;margin:8px 0 4px}",
      ".ig-meta select,.ig-meta input{width:100%;padding:8px 10px;border:1px solid #ccc;border-radius:8px;font-size:14px;box-sizing:border-box}",
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
      var items = this.getItems();
      var changed = false;

      incoming.forEach(function (p) {
        if (!p) return;
        var exists = items.some(function (it) {
          return itemSrc(it, pathsOnly) === p;
        });
        if (exists) return;
        if (pathsOnly) items.push(p);
        else items.push({ src: p, style: "studio", text: "", href: "" });
        changed = true;
      });

      if (changed) this.commit(items);
      if (this.props.onRemoveInsertedMedia) {
        this.props.onRemoveInsertedMedia(this._controlID);
      }
    },

    isPathsOnly: function () {
      var field = this.props.field;
      if (!field || typeof field.get !== "function") return false;
      return !!field.get("paths_only");
    },

    allowMeta: function () {
      var field = this.props.field;
      if (!field || typeof field.get !== "function") return false;
      return !!field.get("allow_meta");
    },

    getItems: function () {
      var pathsOnly = this.isPathsOnly();
      return asArray(this.props.value).map(function (item) {
        return normalizeItem(item, pathsOnly);
      });
    },

    commit: function (items) {
      this.props.onChange(items);
    },

    handleAdd: function () {
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
      var files = Array.from((e.target && e.target.files) || []);
      e.target.value = "";
      if (!files.length) return;

      var tooBig = files.filter(function (f) {
        return f.size > MAX_BYTES;
      });
      if (tooBig.length) {
        window.alert(
          "Alguna imagen supera 1 MB. Comprimila en https://squoosh.app e intenta de nuevo."
        );
        return;
      }

      window.alert(
        "No se pudo abrir la biblioteca de medios. Guardá, publicá, y volvé a intentar con Login with GitHub."
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

    handleCardClick: function (index) {
      if (!this.allowMeta() && this.isPathsOnly()) return;
      this.setState({ editIndex: this.state.editIndex === index ? null : index });
    },

    updateItem: function (index, patch) {
      var items = this.getItems();
      if (this.isPathsOnly()) return;
      items[index] = Object.assign({}, items[index], patch);
      this.commit(items);
    },

    renderCard: function (item, index) {
      var self = this;
      var pathsOnly = this.isPathsOnly();
      var src = itemSrc(item, pathsOnly);
      var url = toPublicUrl(src);
      var style = pathsOnly ? "" : item.style || "studio";
      var dragging = this.state.dragIndex === index;
      var over = this.state.overIndex === index && this.state.dragIndex != null;

      return h(
        "div",
        {
          key: (src || "empty") + "-" + index,
          className:
            "ig-card" + (dragging ? " is-dragging" : "") + (over ? " is-over" : ""),
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
          {
            className: "ig-ph",
            style: { display: url ? "none" : "flex" },
          },
          "Sin imagen"
        ),
        style
          ? h("span", { className: "ig-badge" }, style)
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
      var allowMeta = this.allowMeta();

      return h(
        "div",
        { className: "ig-meta" },
        h("h4", {}, "Editar foto #" + (index + 1)),
        h("label", {}, "Estilo"),
        h(
          "select",
          {
            value: item.style || "studio",
            onChange: function (e) {
              self.updateItem(index, { style: e.target.value });
            },
          },
          h("option", { value: "studio" }, "Studio"),
          h("option", { value: "outdoor" }, "Outdoor")
        ),
        allowMeta
          ? h(
              "div",
              {},
              h("label", {}, "Nombre en la pastilla"),
              h("input", {
                type: "text",
                value: item.text || "",
                placeholder: "Ej. 3organicspets",
                onChange: function (e) {
                  self.updateItem(index, { text: e.target.value });
                },
              }),
              h("label", {}, "Link de la pastilla"),
              h("input", {
                type: "url",
                value: item.href || "",
                placeholder: "https://...",
                onChange: function (e) {
                  self.updateItem(index, { href: e.target.value });
                },
              })
            )
          : null
      );
    },

    render: function () {
      ensureStyles();
      var self = this;
      var items = this.getItems();

      return h(
        "div",
        { className: "ig-wrap " + (this.props.classNameWrapper || "") },
        h(
          "div",
          { className: "ig-toolbar" },
          h(
            "p",
            { className: "ig-hint" },
            items.length +
              " foto" +
              (items.length === 1 ? "" : "s") +
              " · Arrastrá para ordenar · Hover para borrar · Max 1 MB"
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
                return self.renderCard(item, index);
              })
            )
          : h(
              "div",
              { className: "ig-empty" },
              "Todavía no hay fotos. Tocá “Agregar fotos”."
            ),
        this.renderEditor()
      );
    },
  });

  CMS.registerWidget("image-grid", ImageGridControl);
  console.info("[image-grid] widget registered");
})();
