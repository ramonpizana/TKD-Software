# SQLite local con Tauri

## Objetivo

Mover la persistencia del host del ring desde `localStorage` hacia una base
local transaccional dentro de `Tauri`, manteniendo el flujo `offline-first`.

## Estado actual del proyecto

Hoy la app guarda el workspace de eventos en:

- [src/domain/tournament/model/persistence.ts](/C:/Users/ramon/Documents/TKD/src/domain/tournament/model/persistence.ts)

Ese archivo usa `localStorage`, lo cual es util para el prototipo web, pero no
es la solucion final para un host de ring en competencia.

## La ruta recomendada

1. Mantener `localStorage` solo como fallback web.
2. Preparar el shell `Tauri` con el plugin oficial de SQL.
3. Crear una capa de almacenamiento para que la UI no dependa del motor.
4. Migrar eventos, atletas y resultados a `SQLite`.
5. Conservar migraciones versionadas para no romper torneos ya guardados.

## Paso 1. Instalar el plugin oficial

Referencia oficial de Tauri:

- [Tauri SQL plugin](https://v2.tauri.app/fr/plugin/sql/)
- [Tauri SQL JavaScript reference](https://v2.tauri.app/es/reference/javascript/sql/)

Desde la raiz del repo:

```bash
npm install @tauri-apps/plugin-sql
```

Desde `src-tauri/`:

```bash
cargo add tauri-plugin-sql --features sqlite
```

La documentacion oficial indica que tambien puede hacerse con `npm run tauri add sql`,
pero para este repo es mas claro controlar cada paso manualmente.

## Paso 2. Registrar el plugin en Rust

En [src-tauri/src/lib.rs](/C:/Users/ramon/Documents/TKD/src-tauri/src/lib.rs)
agrega el plugin:

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

## Paso 3. Abrir permisos del capability

La guia oficial de Tauri explica que por defecto los comandos peligrosos del
plugin quedan bloqueados y se habilitan desde `capabilities`.

En [src-tauri/capabilities/default.json](/C:/Users/ramon/Documents/TKD/src-tauri/capabilities/default.json)
la base minima recomendada es:

```json
{
  "identifier": "main-capability",
  "description": "Capability for the main ring host window.",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "sql:default",
    "sql:allow-execute"
  ]
}
```

`sql:default` ya incluye `load`, `close` y `select`. Solo agregamos
`sql:allow-execute` para escrituras.

## Paso 4. Crear el archivo de base local

La documentacion oficial indica que la ruta de SQLite debe empezar con
`sqlite:` y es relativa al directorio de app.

Ejemplo:

```ts
import Database from "@tauri-apps/plugin-sql";

const db = await Database.load("sqlite:tkd-software.db");
```

## Paso 5. Agregar migraciones

Tauri SQL soporta migraciones versionadas. Para este proyecto conviene crear al
menos:

1. tabla `events`
2. tabla `athletes`
3. tabla `saved_results`
4. tabla `judge_breakdown`
5. indices por `event_id`, `athlete_id` y `saved_at`

La propia documentacion de Tauri recomienda que las migraciones:

- tengan version unica
- sean seguras al re-ejecutarse
- se prueben antes de usarse en datos reales

## Paso 6. Separar la capa de almacenamiento

Antes de migrar el hook principal, la estructura recomendada es esta:

```text
src/domain/tournament/model/
|- persistence.ts              # facade
|- persistence.local.ts        # fallback web con localStorage
`- persistence.tauri-sql.ts    # host desktop con SQLite
```

La UI seguiria llamando a una sola interfaz de almacenamiento, mientras la
implementacion decide si corre en web o en `Tauri`.

## Paso 7. Migracion segura en este proyecto

El orden practico que yo recomiendo para `TKD-Software` es:

1. dejar instalado el plugin
2. crear el schema inicial de SQLite
3. leer y escribir un evento demo desde `Tauri`
4. migrar solo `EventWorkspace`
5. despues migrar bitacora de jueces y auditoria detallada

## Lo que necesito de tu lado cuando quieras que lo implemente

1. Confirmar que quieres que ya integremos el plugin en `src-tauri/`
2. Tener `rustc` y `cargo` funcionando en una terminal abierta desde el repo
3. Poder correr:

```bash
npm run desktop:doctor
npm run desktop:dev
```

## Lo que sigue despues

Cuando me digas que procedamos, el siguiente sprint ideal es:

1. instalar el plugin en el repo
2. registrar permisos y builder
3. crear migracion `v1`
4. mover `EventWorkspace` a `SQLite`
5. dejar `localStorage` solo para la version web
