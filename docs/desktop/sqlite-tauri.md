# SQLite local con Tauri

## Que significa en este proyecto

`Tauri` es el shell de escritorio. `SQLite` es la base de datos local embebida.
No es una plataforma externa ni requiere cuenta, servidor o internet.

Cuando `TKD-Software` corre dentro de `Tauri`, la intencion es que el workspace
del torneo viva en un archivo local `.db` del equipo del ring. Cuando corre en
modo web, el fallback sigue siendo `localStorage`.

## Estado actual del repo

Hoy el repositorio ya tiene:

- plugin oficial de SQL instalado
- migracion inicial registrada en `Rust`
- fachada de persistencia runtime-aware
- diagnostico visible en la UI para saber que storage esta activo

Archivos clave:

- [src/domain/tournament/model/persistence.runtime.ts](/C:/Users/ramon/Documents/TKD/src/domain/tournament/model/persistence.runtime.ts)
- [src/domain/tournament/model/persistence.tauri-sql.ts](/C:/Users/ramon/Documents/TKD/src/domain/tournament/model/persistence.tauri-sql.ts)
- [src/domain/tournament/model/persistence.ts](/C:/Users/ramon/Documents/TKD/src/domain/tournament/model/persistence.ts)
- [src-tauri/src/lib.rs](/C:/Users/ramon/Documents/TKD/src-tauri/src/lib.rs)
- [src-tauri/tauri.conf.json](/C:/Users/ramon/Documents/TKD/src-tauri/tauri.conf.json)

## Donde queda guardada la informacion

La app usa:

- `Web`: `localStorage` del navegador o webview
- `Desktop Tauri`: `sqlite:tkd-software.db`

La documentacion oficial de Tauri indica que la ruta `sqlite:...` es relativa
al directorio `AppConfig`. Con el identificador actual del proyecto
`com.ramonpizana.tkdsoftware`, en Windows la ruta esperada del archivo local es:

```text
C:\Users\<tu-usuario>\AppData\Roaming\com.ramonpizana.tkdsoftware\tkd-software.db
```

En la UI de la portada ahora se muestra el storage activo y la ubicacion
esperada para que no tengas que adivinarlo.

## Como confirmar que esta usando SQLite

1. Arranca la app en desktop con:

```bash
npm run desktop:dev
```

2. En `Inicio`, revisa la tarjeta `Storage activo`.
3. Si el shell desktop arranco bien, deberia decir `SQLite local`.
4. Si el shell no pudo usar SQLite, veras un estado de `Fallback`.

## Que guarda hoy

La migracion inicial crea una tabla minima para snapshot del workspace:

- `workspace_state`

Por ahora el sistema guarda el workspace completo del torneo como snapshot
serializado. Eso incluye:

- eventos
- atletas
- jueces
- resultados

Esto deja lista una persistencia local real sin obligarnos todavia a normalizar
todo en tablas separadas.

## Migracion inicial

La migracion se registra en:

- [src-tauri/src/lib.rs](/C:/Users/ramon/Documents/TKD/src-tauri/src/lib.rs)

Y crea:

```sql
CREATE TABLE IF NOT EXISTS workspace_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  version INTEGER NOT NULL,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## Fallback y migracion inicial

La estrategia actual es:

1. si corre en web, usa `localStorage`
2. si corre en desktop, intenta usar `SQLite`
3. si `SQLite` esta vacio y existe un workspace previo en `localStorage`,
   migra ese snapshot a la base local
4. si `SQLite` falla durante desarrollo, la app cae a `localStorage` con
   mensaje de diagnostico

## Setup minimo

Desde la raiz:

```bash
npm install @tauri-apps/plugin-sql
```

Desde `src-tauri/`:

```bash
cargo add tauri-plugin-sql --features sqlite
```

## Verificaciones utiles

```bash
npm run desktop:doctor
npm run desktop:dev
```

Si `desktop:dev` falla antes de abrir ventana, el problema no es la base de
datos; es el shell desktop o su pipeline de build.

## Limites de esta fase

- El desktop shell de Windows sigue sensible al bug actual de Tauri ACL si el
  ecosistema vuelve a romper el build.
- El modelo aun no normaliza eventos, atletas y resultados en tablas separadas.
- La siguiente fase natural es abrir tablas de auditoria y consultas directas
  por atleta, evento y desglose de jueces.
