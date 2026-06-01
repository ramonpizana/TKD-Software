# TKD-Software

Software de scoring para competencias de taekwondo poomsae pensado para jueces,
organizadores y pantallas de arena. El objetivo del proyecto es reducir
retrasos por desconexiones, errores manuales y dependencia innecesaria del
internet del recinto.

## Lo que ya deja esta base

- flujo `speckit` integrado para especificar, planear y ejecutar cambios
- constitucion del repositorio con gates de calidad y seguridad
- prototipo funcional de scoring en `React + TypeScript + Vite`
- motor de puntuacion probado con reglas de descarte y deducciones
- persistencia local para modo offline
- CI con validacion, CodeQL y escaneo de secretos

## Direccion tecnica

La direccion elegida para este repositorio es **local-first**:

1. el ring debe seguir operando aunque no haya internet
2. la red local del evento sirve para conectar remotos y pantalla
3. la nube solo replica y consolida resultados cuando exista conectividad

La implementacion actual es un prototipo web del operador. La arquitectura
objetivo esta documentada en [ARCHITECTURE.md](/C:/Users/ramon/Documents/TKD/ARCHITECTURE.md)
y contempla un host del ring, remotos de jueces, pantalla publica y
sincronizacion posterior.

## Inicio rapido

```bash
npm install
npm run dev
```

Luego abre la URL local que imprima Vite.

## Scripts

- `npm run dev`: entorno local
- `npm run build`: build de produccion
- `npm run lint`: validaciones de ESLint
- `npm run typecheck`: chequeo estricto de TypeScript
- `npm run test`: pruebas unitarias con Vitest
- `npm run validate`: gate completo del repositorio

## Workflow con Speckit

- especificacion activa: [specs/001-ring-scoring-foundation/spec.md](/C:/Users/ramon/Documents/TKD/specs/001-ring-scoring-foundation/spec.md)
- plan tecnico: [specs/001-ring-scoring-foundation/plan.md](/C:/Users/ramon/Documents/TKD/specs/001-ring-scoring-foundation/plan.md)
- tareas iniciales: [specs/001-ring-scoring-foundation/tasks.md](/C:/Users/ramon/Documents/TKD/specs/001-ring-scoring-foundation/tasks.md)

## Cuentas recomendadas

Hoy no necesitas registrar nada para correr el prototipo local.

Cuando pasemos a despliegue real, las cuentas que conviene preparar son:

- GitHub para repositorio, CI y revisiones
- Cloudflare para endpoints, sincronizacion y dashboards externos
- proveedor de analitica/observabilidad cuando abramos trafico publico

## Estado actual

Esta primera base prioriza el flujo central del scoring y la calidad del repo.
Bluetooth, pairing de remotos, pantalla externa separada, sincronizacion con
registro oficial de atletas y despliegue productivo quedan descritos como
siguientes fases en la especificacion y el plan.

