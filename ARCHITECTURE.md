# Arquitectura Objetivo

## Principios

### 1. El ring no depende de internet

La competencia debe poder iniciar, puntuar, recalcular y publicar resultados
solo con el equipo del area de competencia.

### 2. Una sola verdad por ring

Cada ring debe tener un host autoritativo que concentre:

- atleta activo
- jueces conectados
- bitacora de deducciones
- score publicado

### 3. La nube replica, no decide

Los servicios remotos deben recibir eventos y respaldos cuando haya
conectividad, pero no bloquear el scoring del momento.

### 4. Todo evento deja rastro auditable

Cada deduccion, reconexion, reinicio de round y publicacion de resultado debe
quedar registrada con timestamp y origen.

## Implementacion actual

Hoy el repo incluye:

- un prototipo de consola del operador en `React + TypeScript + Vite`
- un scaffold inicial de `Tauri` para volver el host instalable en Windows
- un motor de scoring desacoplado en `src/domain/ring/model/scoring.ts`
- persistencia local en navegador
- un workspace de eventos locales con roster y resultados guardados
- especificaciones `speckit` para scoring, shell desktop y operacion de evento

Esto permite validar el flujo de competencia sin comprometer aun la arquitectura
productiva final. La fase actual empieza a tender el puente hacia un host de
escritorio real, sin mover todavia la verdad del ring a servicios remotos.

## Arquitectura objetivo por fases

### Fase 1. Consola local del ring

- UI del operador
- evento local con roster y configuracion propia
- puntuacion de jueces
- resultados guardados por atleta
- tabla de posiciones del evento
- pantalla de resultados embebida
- soporte de teclado como fallback

### Fase 2. Red local del evento

- host de ring en laptop o mini PC
- remotos de jueces via navegador en tablets o telefonos
- pairing por QR o PIN corto
- transporte por WebSocket sobre LAN
- pantalla externa en monitor, TV o proyector

### Fase 3. Persistencia confiable

- almacenamiento local transaccional
- cola de eventos append-only
- snapshots de sesion
- rehidratacion tras cierre inesperado

### Fase 4. Sincronizacion y nube

- replica asincrona de resultados
- consolidacion de atletas, ramas, categorias y formas
- panel de torneo multi-ring
- observabilidad y respaldo remoto

## Componentes propuestos para produccion

### Ring Host

Aplicacion de escritorio o contenedor local que coordina la sesion del ring.
Debe funcionar incluso si la WAN falla.

### Judge Remote

Cliente muy ligero que muestra pocas acciones, estado de conexion y feedback
claro. Debe reconectar rapido y evitar errores por toque accidental.

### Arena Display

Vista solo lectura con:

- nombre del atleta
- club o pais
- categoria y forma
- score en vivo o score final
- estado del round

### Sync Gateway

Proceso encargado de publicar resultados y descargar catalogos cuando haya
conectividad segura.

## Riesgos operativos que esta arquitectura atiende

- caidas de internet del recinto
- perdida momentanea de Wi-Fi
- reconexion tardia de un juez
- duplicacion de eventos desde un remoto
- reinicio del equipo durante una categoria
- necesidad de operar varios rings a la vez

## Recomendacion de lenguaje y stack

- `TypeScript` estricto para el dominio compartido, UI operativa y tooling
- `Tauri + Rust` como opcion preferida para el host local del ring
- `SQLite` o equivalente embebido para almacenamiento transaccional local
- `WebSocket` para remotos y pantalla en tiempo real
- `Cloudflare Durable Objects + D1` como opcion fuerte para sincronizacion y
  coordinacion remota posterior, no como dependencia del ring

`Electron` sigue siendo una alternativa valida, pero no es la recomendacion
principal para este proyecto mientras buscamos un host mas ligero y una ruta mas
clara a componentes locales criticos fuera del renderer.

## Skills y herramientas sugeridas

- `speckit-*` para especificacion, plan, tareas y ejecucion
- `Browser` para verificar interfaces y flujo local
- `GitHub` para PRs y CI
- `CodeRabbit` para revisiones de riesgo
- `Cloudflare` cuando pasemos a despliegue y sincronizacion
- `design-taste-frontend` para pantallas visibles al operador y al publico
