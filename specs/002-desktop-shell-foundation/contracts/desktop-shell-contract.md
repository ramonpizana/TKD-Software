# Desktop Shell Contract

## Purpose

Definir el contrato operativo minimo para la fase de shell de escritorio.

## Commands

### `npm run desktop:doctor`

- Verifica si la maquina parece lista para la fase nativa
- Debe fallar si faltan `cargo` o `rustc`
- Debe imprimir advertencias claras si faltan prerequisitos probables de
  Windows

### `npm run desktop:dev`

- Ejecuta el chequeo de prerequisitos
- Si el entorno esta listo, intenta abrir el shell de Tauri en desarrollo
- Usa el frontend actual servido en `http://127.0.0.1:5173`

### `npm run desktop:build`

- Ejecuta el chequeo de prerequisitos
- Si el entorno esta listo, intenta generar el bundle de Windows
- Usa el build web ya existente como `frontendDist`

## Runtime Identity

- `productName`: `TKD-Software`
- `identifier`: `com.ramonpizana.tkdsoftware`
- `window label`: `main`
- `window title`: `TKD-Software`

## Permissions Boundary

- La ventana principal usa un capability unico
- El capability inicial otorga `core:default`
- No se agregan permisos extra de filesystem, shell o procesos en esta fase
