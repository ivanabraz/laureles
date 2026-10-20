# Fotos del sitio — guía rápida (Laura)

Hay **dos lugares** para editar Laureles:

| Qué | Dónde |
|-----|--------|
| Textos (ES / EN) | [Google Sheet](./README.md) |
| Fotos (portfolio y paquetes) | [Admin](https://laureles.netlify.app/admin/) |

## Entrar al admin

1. Abrí: https://laureles.netlify.app/admin/
2. **Login with GitHub**
3. La primera vez GitHub te pide autorizar la app.

## Portfolio (todas las fotos juntas)

Menú → **Portfolio** → **Todas las fotos**.

Vas a ver una **grilla** con todas las imágenes (Family, Brands, Shelters, Specials).

**Filtros** arriba: Todas / Family / Brands / Shelters / Specials, y Estudio / Exterior.

**Agregar**

1. (Opcional) Activá el filtro de la categoría donde van las fotos nuevas.
2. **Agregar fotos** → elegí una o varias (máx. 1 MB).
3. Si hace falta, **click** en la card y asigná la **categoría**.

**Editar tags (click en una card)**

- **Categoría:** Family / Brands / Shelters / Specials  
- **Lugar:** Estudio / Exterior  
- **Pastilla:** mini nombre + link (ej. CATdopciones). Opcional; vacío = sin pastilla en el sitio.

**Ordenar / borrar**

- Arrastrá una card para reordenar.  
- Hover → **×** para borrar.

Guardá y **Publish**. Esperá el deploy de Netlify (1–3 min) y refrescá la web.

## Paquetes

1. Menú → **Paquetes** → **Imagenes de paquetes**.
2. Vas a ver **cards** (como en el sitio): Chihuahua, Galgo, etc.
3. **Click** en un paquete →
   - **Cambiar cover** (foto de la card)
   - **Galería del modal**: agregar, ordenar (drag), borrar (hover ×)
   - Click en una foto de la galería = usarla como cover
   - Color del título (Negro / Blanco)
   - **Incluye**: chips de duración / fotos / premios / lugar (textos que ya existen en el Sheet)
4. Arrastrá las cards de paquetes para cambiar el orden en el carrusel.
5. Guardá y **Publish**.

### Paquete nuevo

El admin **no escribe en Google Sheets** (solo en GitHub). Flujo:

1. En el admin → **Agregar paquete** → poné un id (ej. `beagle`).
2. Subí cover + galería, elegí color e “Incluye”.
3. En el panel aparecen **2 keys** para el Sheet. Agregá esas filas en el Google Sheet:

| key | es | en |
|-----|----|----|
| `packages_description.session_beagle` | Sesión Beagle… | Beagle session… |
| `packages_description.desc_beagle` | Descripción… | Description… |

4. Publish en el admin + filas en el Sheet → el paquete aparece en el sitio.

Los ítems de “Incluye” (60 min, 5 fotos, etc.) **no** necesitan filas nuevas: se reusan keys que ya están en el Sheet.

## Importante

- Máximo **1 MB** por imagen ([Squoosh](https://squoosh.app) si pesa más).
