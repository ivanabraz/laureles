/**
 * Bilingual text fields for one site section.
 * Value: { es: { ... }, en: { ... } }
 * The field config sets `section` to pick which fields to show.
 */
(function () {
  var h = window.h;
  var createClass = window.createClass;
  var CMS = window.CMS;

  if (!CMS || !createClass || !h) {
    console.error("[section-copy] Decap CMS APIs missing");
    return;
  }

  var SECTIONS = {
    home: {
      intro: "Frase del inicio. Las fotos están arriba.",
      fields: [
        {
          path: "tagline",
          label: "Frase principal",
          multiline: true,
          rows: 3,
          hint: "Para subrayar una palabra: <u>palabra</u>",
        },
        { path: "multispecies", label: "Texto que se mueve (marquee)" },
      ],
    },
    about: {
      intro: "Texto de la sección Sobre mí.",
      fields: [
        { path: "about-text", label: "Texto", multiline: true, rows: 8 },
      ],
    },
    portfolio: {
      intro: "Nombres de filtros y mensajes. Las fotos están arriba.",
      fields: [
        { path: "family", label: "Familia" },
        { path: "brands", label: "Marcas" },
        { path: "shelters", label: "Refugios" },
        { path: "specials", label: "Fechas especiales" },
        { path: "studio", label: "Estudio" },
        { path: "outdoor", label: "Exteriores" },
        { path: "see_more", label: "Ver más" },
        { path: "reference_photo", label: "Foto de referencia" },
        { path: "no_results", label: "Sin resultados", multiline: true, rows: 2 },
      ],
    },
    contact: {
      intro: "Textos de contacto y el botón de consultar de los paquetes.",
      fields: [
        { path: "talk", label: "Título" },
        { path: "requestinfo", label: "Botón de consultar" },
        { path: "contact_invite", label: "Invitación" },
        { path: "brand_message", label: "Mensaje para marcas", multiline: true, rows: 3 },
      ],
    },
    promo: {
      intro: "La pastilla “Ambos idiomas” se guarda igual en español y en inglés.",
      fields: [
        { path: "announcement_show", label: "Barra de arriba", type: "toggle", shared: true },
        {
          path: "announcement_text",
          label: "Texto de la barra",
          multiline: true,
          rows: 2,
          hint: "El link va así: <link>Reservá tu sesión</link>",
        },
        { path: "announcement_url", label: "Link de la barra" },
        { path: "announcement_close", label: "Cerrar la barra" },
        {
          path: "announcement_bg",
          label: "Color de fondo",
          shared: true,
          hint: "Ej. #000000, negro, rosa",
        },
        {
          path: "announcement_color",
          label: "Color del texto",
          shared: true,
          hint: "Ej. #ffffff o blanco",
        },
        { path: "promo_show", label: "Ventana emergente", type: "toggle", shared: true },
        {
          path: "promo_text",
          label: "Texto de la promo",
          multiline: true,
          rows: 3,
          hint: "Enter para bajar de línea.",
        },
        { path: "promo_cta", label: "Botón" },
        { path: "promo_url", label: "Link del botón" },
        {
          path: "promo_image",
          label: "Imagen",
          shared: true,
          hint: "Ruta, ej. /images/packages/image-07.jpg",
        },
        { path: "promo_close", label: "Cerrar la promo" },
        { path: "christmas_hint", label: "Texto del botón de Navidad" },
      ],
    },
    nav: {
      intro: "Menú, pie y palabras que se repiten en varias secciones.",
      fields: [
        { path: "about", label: "Sobre" },
        { path: "portfolio", label: "Portfolio" },
        { path: "packages", label: "Paquetes" },
        { path: "press", label: "Prensa" },
        { path: "contact", label: "Contacto" },
        { path: "testimony", label: "Testimonios" },
        { path: "readnote", label: "Ver nota" },
        { path: "loading", label: "Cargando" },
        { path: "back", label: "Volver" },
        { path: "backtotop", label: "Volver arriba" },
        { path: "sections", label: "Secciones (pie)" },
        { path: "language", label: "Idioma (pie)" },
        { path: "followus", label: "Sígueme en redes" },
        { path: "rights", label: "Derechos" },
      ],
    },
    includes: {
      intro: "Estas dos frases valen para todos los paquetes. Duración, fotos y lugar se editan en cada card.",
      fields: [
        { path: "includes", label: "Título “Incluye”" },
        { path: "treats", label: "Premios comestibles" },
      ],
    },
  };

  function asPlain(value) {
    if (value == null) return null;
    if (typeof value.toJS === "function") return value.toJS();
    if (typeof value === "object") return value;
    return null;
  }

  function fieldOption(field, key) {
    if (!field) return "";
    if (typeof field.get === "function") {
      var value = field.get(key);
      return value == null ? "" : value;
    }
    return field[key] == null ? "" : field[key];
  }

  function cloneLocale(locale) {
    var next = {};
    var source = locale && typeof locale === "object" ? locale : {};
    Object.keys(source).forEach(function (key) {
      var value = source[key];
      if (value != null && typeof value === "object") return;
      next[key] = value == null ? "" : String(value);
    });
    return next;
  }

  function isOn(value) {
    return ["true", "1", "yes", "si", "sí", "verdadero"].indexOf(
      String(value || "").trim().toLowerCase()
    ) >= 0;
  }

  var styleTagId = "laureles-section-copy-css";
  function ensureStyles() {
    if (document.getElementById(styleTagId)) return;
    var style = document.createElement("style");
    style.id = styleTagId;
    style.textContent = [
      ".sc-wrap{font-family:system-ui,-apple-system,sans-serif;color:#161616;margin-top:8px}",
      ".sc-intro{margin:0 0 14px;color:#555;font-size:13px;line-height:1.45}",
      ".sc-tabs{position:sticky;top:0;z-index:4;display:flex;gap:8px;padding:4px 0 12px;background:#fff}",
      ".sc-tab{appearance:none;border:1px solid #ddd;background:#f6f6f6;color:#222;border-radius:999px;padding:8px 16px;font-size:14px;font-weight:650;cursor:pointer}",
      ".sc-tab.is-on{background:#161616;border-color:#161616;color:#fff}",
      ".sc-field{margin:0 0 12px}",
      ".sc-field label{display:flex;align-items:center;gap:8px;font-size:12px;font-weight:650;margin:0 0 6px}",
      ".sc-badge{font-size:10px;font-weight:650;letter-spacing:.02em;color:#666;background:#f3f3f3;border-radius:999px;padding:2px 7px}",
      ".sc-hint{margin:0 0 6px;color:#777;font-size:12px;line-height:1.4}",
      ".sc-input,.sc-area{width:100%;box-sizing:border-box;border:1px solid #ddd;border-radius:10px;padding:10px 12px;font:inherit;font-size:14px;line-height:1.4;background:#fff}",
      ".sc-area{resize:vertical;min-height:72px}",
      ".sc-input:focus,.sc-area:focus{outline:2px solid #111;border-color:#111}",
      ".sc-chips{display:flex;gap:8px;flex-wrap:wrap}",
      ".sc-chip{appearance:none;border:1px solid #ccc;background:#fff;border-radius:999px;padding:8px 14px;font-size:13px;cursor:pointer}",
      ".sc-chip.is-on{background:#161616;border-color:#161616;color:#fff}",
    ].join("");
    document.head.appendChild(style);
  }

  var SectionCopyControl = createClass({
    getInitialState: function () {
      return { lang: "es" };
    },

    componentDidMount: function () {
      ensureStyles();
    },

    sectionId: function () {
      return String(fieldOption(this.props.field, "section") || "");
    },

    getLocales: function () {
      var plain = asPlain(this.props.value) || {};
      return {
        es: cloneLocale(plain.es),
        en: cloneLocale(plain.en),
      };
    },

    commitPath: function (path, text, shared) {
      var current = this.getLocales();
      var targets = shared ? ["es", "en"] : [this.state.lang];
      var next = { es: current.es, en: current.en };
      targets.forEach(function (lng) {
        var locale = Object.assign({}, current[lng]);
        locale[path] = text;
        next[lng] = locale;
      });
      this.props.onChange(next);
    },

    renderField: function (field) {
      var lang = this.state.lang;
      var value = this.getLocales()[lang][field.path];
      if (value == null) value = "";
      var self = this;
      var control;

      if (field.type === "toggle") {
        var on = isOn(value);
        control = h(
          "div",
          { className: "sc-chips" },
          h(
            "button",
            {
              type: "button",
              className: "sc-chip" + (on ? " is-on" : ""),
              onClick: function () {
                self.commitPath(field.path, "true", !!field.shared);
              },
            },
            "Visible"
          ),
          h(
            "button",
            {
              type: "button",
              className: "sc-chip" + (!on ? " is-on" : ""),
              onClick: function () {
                self.commitPath(field.path, "false", !!field.shared);
              },
            },
            "Oculto"
          )
        );
      } else if (field.multiline) {
        control = h("textarea", {
          className: "sc-area",
          rows: field.rows || 4,
          value: value,
          spellCheck: true,
          onChange: function (event) {
            self.commitPath(field.path, event.target.value, !!field.shared);
          },
        });
      } else {
        control = h("input", {
          className: "sc-input",
          type: "text",
          value: value,
          spellCheck: true,
          autoComplete: "off",
          onChange: function (event) {
            self.commitPath(field.path, event.target.value, !!field.shared);
          },
        });
      }

      return h(
        "div",
        { className: "sc-field", key: field.path },
        h(
          "label",
          {},
          field.label,
          field.shared ? h("span", { className: "sc-badge" }, "Ambos idiomas") : null
        ),
        field.hint ? h("p", { className: "sc-hint" }, field.hint) : null,
        control
      );
    },

    render: function () {
      var self = this;
      var section = SECTIONS[this.sectionId()];
      var lang = this.state.lang;

      if (!section) {
        return h(
          "p",
          { className: "sc-intro" },
          "Falta la sección de textos en la config del admin."
        );
      }

      return h(
        "div",
        { className: "sc-wrap" },
        h("p", { className: "sc-intro" }, section.intro),
        h(
          "div",
          { className: "sc-tabs" },
          h(
            "button",
            {
              type: "button",
              className: "sc-tab" + (lang === "es" ? " is-on" : ""),
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
              className: "sc-tab" + (lang === "en" ? " is-on" : ""),
              onClick: function () {
                self.setState({ lang: "en" });
              },
            },
            "English"
          )
        ),
        section.fields.map(function (field) {
          return self.renderField(field);
        })
      );
    },
  });

  CMS.registerWidget("section-copy", SectionCopyControl);
  console.info("[section-copy] widget registered");
})();
