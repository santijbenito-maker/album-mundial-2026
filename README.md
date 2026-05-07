# ⚽ Álbum Mundial 2026 — registro compartido

App web para llevar entre 3 personas (Yo, Facundo y Ángela) un único álbum
compartido de figuritas Panini del Mundial 2026. Funciona desde el celular
como PWA y sincroniza en tiempo real vía Supabase.

- **994 figuritas**: 20 FWC + 48 países × 20 + 14 CC.
- **Realtime**: lo que marca uno aparece en los teléfonos de los otros sin recargar.
- **Sin login**: todos los que abren el link editan el mismo álbum.
- **Mobile-first**, soporta light/dark, instalable en la pantalla de inicio.
- **Offline**: si te quedás sin internet, los cambios se guardan en cola y se mandan al volver la conexión.

---

## 1. Crear el proyecto en Supabase

1. Andá a [https://supabase.com](https://supabase.com) y creá una cuenta (con GitHub o email, **sin tarjeta de crédito**).
2. Hacé click en **"New project"**.
   - **Name**: `album-mundial-2026` (o lo que quieras).
   - **Database password**: elegí una y guardala (no la vas a usar para esta app, pero te la pide).
   - **Region**: la más cercana (South America — São Paulo si estás en Argentina).
   - **Pricing plan**: **Free**.
3. Esperá ~1 minuto a que el proyecto esté listo.

## 2. Crear la tabla `stickers`

1. En el panel izquierdo del proyecto, andá a **SQL Editor** → **New query**.
2. Pegá este bloque entero y apretá **Run**:

```sql
create table stickers (
  id text primary key,
  count int not null default 0,
  last_updated_by text,
  updated_at timestamptz default now()
);

alter table stickers enable row level security;

create policy "anyone can read"   on stickers for select using (true);
create policy "anyone can insert" on stickers for insert with check (true);
create policy "anyone can update" on stickers for update using (true);
create policy "anyone can delete" on stickers for delete using (true);

alter publication supabase_realtime add table stickers;
```

Debería decir algo como *"Success. No rows returned"*. Listo, ya tenés la tabla y Realtime habilitado.

> **Sobre las policies**: dejan que cualquiera con la **anon key** lea, escriba y borre.
> Para una app familiar con un link privado está bien. Si te preocupa, podés
> regenerar la anon key desde Supabase cuando quieras y volver a compartirla.

## 3. Copiar las credenciales a `index.html`

1. En Supabase, andá a **Project Settings** (rueda dentada abajo a la izquierda) → **API**.
2. Copiá:
   - **Project URL** (algo como `https://abcdefgh.supabase.co`)
   - **anon public** (un JWT largo que empieza con `eyJ...`)
3. Abrí `index.html` y buscá este bloque cerca del principio del `<script>`:

   ```js
   const SUPABASE_URL = "https://TU-PROYECTO.supabase.co";
   const SUPABASE_ANON_KEY = "TU-ANON-KEY";
   ```

4. Reemplazá esos dos strings con los que copiaste y guardá.

> ⚠️ La anon key va a quedar visible en el HTML. Es así por diseño en Supabase
> (no es una clave secreta). Lo que protege la base de datos son las **RLS
> policies**, que en este caso permiten a cualquiera con la URL leer/escribir.

## 4. Probar localmente (opcional)

Como el HTML carga el cliente de Supabase desde un CDN como módulo ES, conviene
servirlo por HTTP en vez de abrirlo con `file://`. Cualquiera de estas:

```bash
# Python 3
python3 -m http.server 8000

# o Node
npx serve .
```

Y abrí `http://localhost:8000`.

## 5. Deployar

### Opción A — Netlify Drop (más fácil, sin GitHub)

1. Asegurate de tener la carpeta con `index.html`, `manifest.json` y `README.md`.
2. Andá a [https://app.netlify.com/drop](https://app.netlify.com/drop).
3. Arrastrá la carpeta entera al recuadro.
4. Te da una URL del estilo `https://nombre-random.netlify.app`.
5. Si querés, en **Site settings → Change site name** ponele algo lindo
   (`album-mundial-benitez.netlify.app`).

### Opción B — GitHub Pages

1. Subí la carpeta a un repo de GitHub.
2. **Settings → Pages → Source: Deploy from a branch**, branch `main`, carpeta `/ (root)`.
3. Esperá 1–2 minutos. Tu URL queda `https://TU-USUARIO.github.io/album-mundial-2026/`.

### Opción C — Vercel

1. `npm i -g vercel` y `vercel` desde la carpeta. Aceptá los defaults. Listo.
2. O conectá el repo de GitHub desde [vercel.com/new](https://vercel.com/new).

## 6. Compartir con Facundo y Ángela

Mandales el link por WhatsApp y deciles que lo agreguen a la pantalla de inicio
para que se sienta como una app:

**iPhone (Safari)**
1. Abrir el link en Safari.
2. Tocar el botón **Compartir** (cuadradito con flecha hacia arriba).
3. **"Agregar a pantalla de inicio"** → **Agregar**.

**Android (Chrome)**
1. Abrir el link en Chrome.
2. Menú **⋮** arriba a la derecha.
3. **"Agregar a pantalla principal"** → **Agregar**.

La primera vez que abren la app les va a aparecer el modal **"¿Quién sos?"**.
Cada uno toca su nombre y listo — la elección queda guardada.

## 7. Cómo se usa

- **Tap** en una figurita: la marca como tenida. Si ya estaba tenida, suma una repetida (badge `+1`, `+2`…).
- **Long-press** (mantener apretado) en mobile, o **click derecho** en desktop: resta una.
- **Buscador**: filtrá por país (ej. `Argentina`), grupo (`Grupo J`) o sección (`FWC`, `CC`).
- **Pills**: `Todas`, `Faltantes`, `Tenidas`, `Con repes`, `Cargadas por mí`.
- **📋 Exportar**: copia al portapapeles una lista agrupada con repes y faltantes lista para pegar en WhatsApp.
- **👤 Cambiar usuario**: si te pasaron el celular o querés volver a elegir.
- **🗑️ Reiniciar**: borra TODO el álbum (afecta a los 3). Pide doble confirmación.

## 8. Flujo completo de punta a punta

1. **Vos**: creás cuenta en Supabase → nuevo proyecto → corrés el SQL del paso 2 → copiás URL + anon key.
2. **Vos**: pegás esas dos credenciales en `index.html`.
3. **Vos**: arrastrás la carpeta a Netlify Drop → te da `https://album-mundial-xxx.netlify.app`.
4. **Vos**: abrís ese link en tu celular, tocás "Yo" en el modal, marcás la primera figurita.
5. **Vos**: mandás el link por WhatsApp a Facundo y Ángela.
6. **Ángela**: abre el link, lo agrega a la pantalla de inicio, toca "Ángela", marca una figurita.
7. **Vos** (sin recargar): ves la figurita que marcó Ángela aparecer con una `A` rosa al lado. ✨
8. **Facundo**: idem, sin pisar a nadie. Si alguno está sin internet, los cambios se mandan solos al volver.

¡Listo! Ya están los tres llenando el mismo álbum en tiempo real desde el sillón.

---

## Estructura de IDs en la base

- `fwc-{0..19}` — FWC 00 a FWC 19.
- `t{0..47}-{0..19}` — `teamIdx` según el orden de la lista de países (Grupo A → L), `stickerIdx` 0–19.
- `cc-{0..13}` — CC 01 a CC 14.

## Troubleshooting

- **"Configurá SUPABASE_URL y SUPABASE_ANON_KEY"**: olvidaste reemplazar las credenciales en `index.html`.
- **No se ven los cambios en otro celu**: verificá que ejecutaste `alter publication supabase_realtime add table stickers;` en el SQL.
- **"new row violates row-level security policy"**: faltan las policies del paso 2. Volvé a correr el SQL.
- **Quiero resetear sin tocar nada**: tocá 🗑️ Reiniciar (borra todo). O desde Supabase, SQL editor: `delete from stickers;`.
