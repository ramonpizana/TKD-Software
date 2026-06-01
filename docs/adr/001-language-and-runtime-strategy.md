# ADR 001 - Language and Runtime Strategy

## Status

Accepted

## Context

`TKD-Software` busca operar un ring de poomsae con prioridad absoluta en:

- continuidad sin internet
- estabilidad bajo presion de torneo
- UI rapida para operador y jueces
- evolucion posterior a host de escritorio y remotos LAN

La decision de lenguaje no debe optimizar solo por velocidad de prototipo, sino
por una ruta creible hacia una app de escritorio con recuperacion, red local y
posible puente a hardware.

## Decision

Usar **TypeScript estricto** como lenguaje primario del repositorio en esta fase
para:

- UI del operador
- modelo de dominio
- reglas de scoring
- validacion de datos
- tooling de build, test y CI

Usar **Rust** como lenguaje objetivo del host de escritorio cuando entremos a la
fase de:

- shell nativo de escritorio
- pairing con dispositivos
- acceso a sistema local
- recuperacion fuerte
- almacenamiento y servicios criticos del ring

El runtime objetivo de escritorio recomendado es **Tauri + Rust**, manteniendo
la UI web en TypeScript.

## Why

### Por que TypeScript ahora

- La app actual es principalmente una interfaz operativa con reglas de dominio y
  feedback inmediato.
- TypeScript permite iterar rapido sin perder tipado fuerte en modelos como
  `RingSnapshot`, `JudgeRecord` y deducciones.
- La base actual ya usa React, Vite y Zod, lo que reduce friccion y mantiene el
  producto en movimiento.

### Por que Rust despues

- La documentacion oficial de Tauri posiciona el stack como una forma de crear
  binarios pequenos y rapidos, integrando frontend web con backend en Rust.
- Para el host autoritativo del ring, Rust encaja mejor que JavaScript puro en
  componentes donde importan recuperacion, concurrencia y control mas cercano
  del runtime.

### Por que no Electron como primera opcion

- Electron sigue siendo una opcion valida, pero su propio modelo oficial deja
  claro que el entorno se divide entre procesos `main` y `renderer` con una
  superficie adicional de seguridad e IPC que no necesitamos priorizar hoy.
- Para este proyecto, el objetivo es reducir peso operativo del host y dejar la
  logica critica fuera del renderer lo antes posible.

## Consequences

- El repositorio se organiza por capas de producto y dominio en TypeScript.
- No se forzara Rust en esta fase porque el entorno actual ni siquiera lo tiene
  instalado y hacerlo ahora frenaria el avance del producto.
- La proxima fase arquitectonica debe considerar instalar:
  - Rust toolchain
  - Tauri CLI
  - SQLite embebido

## Sources

- Tauri docs: [What is Tauri?](https://v2.tauri.app/start/)
- Tauri docs: [Calling Rust from the Frontend](https://v2.tauri.app/develop/calling-rust/)
- Electron docs: [Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model)
- Cloudflare docs: [Durable Objects Overview](https://developers.cloudflare.com/durable-objects/)

