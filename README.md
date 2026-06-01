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

## Modo escritorio

Esta base ya incluye el scaffold de `Tauri` para convertir el ring host en app
de escritorio Windows.

Antes de usarlo, revisa
[docs/desktop/windows-setup.md](/C:/Users/ramon/Documents/TKD/docs/desktop/windows-setup.md)
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

## Cuentas recomendadas

Hoy no necesitas registrar nada para correr el prototipo local.

Cuando pasemos a despliegue real, las cuentas que conviene preparar son:

- GitHub para repositorio, CI y revisiones
- Cloudflare para endpoints, sincronizacion y dashboards externos
- proveedor de analitica u observabilidad cuando abramos trafico publico

## Estado actual

La base actual ya cubre el flujo central del scoring y la calidad del repo.
Bluetooth, pairing de remotos, pantalla externa separada, sincronizacion con
registro oficial de atletas y despliegue productivo quedan descritos como
siguientes fases. El shell de escritorio ya esta preparado a nivel de
estructura, pero en esta maquina aun falta instalar el toolchain de Rust para
ejecutarlo completo.
