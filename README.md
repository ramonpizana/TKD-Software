# TKD-Software

Software de scoring para competencias de taekwondo poomsae pensado para
jueces, organizadores y pantallas de arena. El objetivo del proyecto es reducir
retrasos por desconexiones, errores manuales y dependencia innecesaria del
internet del recinto.

## Lo que ya deja esta base

- flujo `speckit` integrado para especificar, planear y ejecutar cambios
- constitucion del repositorio con gates de calidad y seguridad
- prototipo funcional de scoring en `React + TypeScript + Vite`
- scaffold de `Tauri` para evolucionar a app de escritorio instalable
- workspace local de eventos con multiples brackets y eventos activos
- registro de atletas con datos competitivos, siembra y ranking opcional
- guardado persistente de resultados por atleta y tabla de posiciones
- fachada de persistencia local que usa `SQLite` en `Tauri` y `localStorage` como fallback web
- navegacion separada para inicio, creacion de evento, jueceo y seguimiento del evento
- motor de puntuacion probado con reglas de descarte y deducciones
- persistencia local para modo offline
- CI con validacion, CodeQL y escaneo de secretos

## Estrategia de lenguaje

La estrategia elegida no es un solo lenguaje para todo, sino la mejor mezcla
para este tipo de software:

- `TypeScript` estricto para UI, modelo de dominio, reglas de scoring y flujos
  operativos del producto
- `Rust` como lenguaje objetivo del host de escritorio cuando avancemos a
  `Tauri`, pairing de dispositivos, servicios locales y persistencia mas fuerte

La decision completa quedo documentada en
[docs/adr/001-language-and-runtime-strategy.md](/C:/Users/ramon/Documents/TKD/docs/adr/001-language-and-runtime-strategy.md).

## Estructura del codigo

```text
src/
|- app/                     # entrada, runtime y estilos globales
|- pages/                   # composicion de pantallas
|- features/                # UI operativa reutilizable
|- domain/                  # reglas, estado y modelos del negocio
`- vite-env.d.ts

src-tauri/
|- capabilities/            # permisos del shell nativo
|- icons/                   # assets de iconos del bundle
|- src/                     # entrada Rust del host de escritorio
|- Cargo.toml
|- build.rs
`- tauri.conf.json
```

Hoy la pantalla principal vive en:

- [src/pages/ring-control/ui/RingControlPage.tsx](/C:/Users/ramon/Documents/TKD/src/pages/ring-control/ui/RingControlPage.tsx)
- [src/pages/ring-control/model/useRingControl.ts](/C:/Users/ramon/Documents/TKD/src/pages/ring-control/model/useRingControl.ts)
- [src/domain/ring/model/scoring.ts](/C:/Users/ramon/Documents/TKD/src/domain/ring/model/scoring.ts)
- [src/domain/tournament/model/workspace-state.ts](/C:/Users/ramon/Documents/TKD/src/domain/tournament/model/workspace-state.ts)

## Direccion tecnica

La direccion elegida para este repositorio es `local-first`:

1. el ring debe seguir operando aunque no haya internet
2. la red local del evento sirve para conectar remotos y pantalla
3. la nube solo replica y consolida resultados cuando exista conectividad

La arquitectura objetivo esta documentada en
[ARCHITECTURE.md](/C:/Users/ramon/Documents/TKD/ARCHITECTURE.md) y contempla
un host del ring, remotos de jueces, pantalla publica y sincronizacion
posterior.

## Inicio rapido web

```bash
npm install
npm run dev
```

Luego abre:

- `http://127.0.0.1:5173/`

Se fija `127.0.0.1` en la configuracion de Vite para evitar problemas de
resolucion con `localhost` e IPv6 en Windows y en navegadores embebidos.

Flujo actual recomendado:

1. abre `Inicio` para entender el flujo del operador
2. entra a `Crear evento` y configura sede, ring, ronda, categoria y jueces
3. registra atletas antes del inicio
4. cambia a `Jueceo` para seleccionar el atleta activo y puntuar
5. usa `Evento` para revisar guardados, posiciones y avance de la ronda

Atajos:

- `ArrowUp`: tecnica `-0.3`
- `ArrowDown`: tecnica `-0.1`
- `ArrowRight`: presentacion `-0.3`
- `ArrowLeft`: presentacion `-0.1`
- `R`: reinicia el round actual
- `N`: avanza al siguiente atleta
- `S`: guarda el resultado actual y avanza

## Modo escritorio

Esta base ya incluye el scaffold de `Tauri` para convertir el ring host en app
de escritorio Windows.

Antes de usarlo, revisa
[docs/desktop/windows-setup.md](/C:/Users/ramon/Documents/TKD/docs/desktop/windows-setup.md)
y la ruta de persistencia local en
[docs/desktop/sqlite-tauri.md](/C:/Users/ramon/Documents/TKD/docs/desktop/sqlite-tauri.md)
y ejecuta:

```bash
npm run desktop:doctor
```

Cuando los prerequisitos esten instalados:

```bash
npm run desktop:dev
```

Para bundle de Windows:

```bash
npm run desktop:build
```

## Scripts

- `npm run dev`: entorno local web
- `npm run build`: build web de produccion
- `npm run lint`: validaciones de ESLint
- `npm run typecheck`: chequeo estricto de TypeScript
- `npm run test`: pruebas unitarias con Vitest
- `npm run validate`: gate completo del repositorio
- `npm run desktop:doctor`: revisa prerequisitos del shell de escritorio
- `npm run desktop:dev`: abre la app en Tauri para desarrollo local
- `npm run desktop:build`: genera el bundle instalable de Windows

## Workflow con Speckit

- fundacion del scoring: [specs/001-ring-scoring-foundation/spec.md](/C:/Users/ramon/Documents/TKD/specs/001-ring-scoring-foundation/spec.md)
- fase de escritorio: [specs/002-desktop-shell-foundation/plan.md](/C:/Users/ramon/Documents/TKD/specs/002-desktop-shell-foundation/plan.md)
- fase de operacion de evento: [specs/003-event-ops/plan.md](/C:/Users/ramon/Documents/TKD/specs/003-event-ops/plan.md)

## Cuentas recomendadas

Hoy no necesitas registrar nada para correr el prototipo local.

Cuando pasemos a despliegue real, las cuentas que conviene preparar son:

- GitHub para repositorio, CI y revisiones
- Cloudflare para endpoints, sincronizacion y dashboards externos
- proveedor de analitica u observabilidad cuando abramos trafico publico

## Estado actual

La base actual ya cubre el scoring del ring, el registro manual previo de
atletas, la gestion local de eventos y el guardado de resultados con tabla de
 posiciones. La persistencia del runtime ya esta encaminada para usar `SQLite`
 en `Tauri` y `localStorage` en web. La siguiente ola natural es meter draws o
 ramas eliminatorias, importacion masiva de atletas y sincronizacion entre
 rings.

## Distribucion desktop

Para compartir una app real sin `localhost`, revisa:

- [docs/desktop/distribution.md](/C:/Users/ramon/Documents/TKD/docs/desktop/distribution.md)

Resumen rapido:

- `npm run desktop:build` genera el instalador de Windows
- `npm run desktop:artifacts` te dice donde quedo el `.exe`
- `.github/workflows/desktop-release.yml` compila desde GitHub y sube artifacts
- un usuario final debe instalar el `-setup.exe`, no correr `localhost`
