# AGENTS

## Mision del repositorio

Construir un software de scoring para competencias oficiales y semi-oficiales
de taekwondo poomsae que sea rapido, entendible y resiliente ante fallas de red.

## Flujo obligatorio

1. Usa `speckit` para cambios de alcance real.
2. Mantiene la especificacion en `specs/`.
3. Pasa `npm run validate` antes de considerar una entrega lista.
4. No comprometas secretos ni dependas del internet del evento para el flujo del
   ring.

## Skills y herramientas recomendadas

- `speckit-specify`, `speckit-plan`, `speckit-tasks`, `speckit-implement`
- `Browser` para revisar la UI local despues de cambios grandes
- `GitHub` para PRs, issues y automatizaciones
- `CodeRabbit` para revisiones de seguridad, regresiones y mantenibilidad
- `Cloudflare` para investigar sincronizacion, Workers, Durable Objects y D1
- `design-taste-frontend` para interfaces de operador y pantalla publica

## Criterios no negociables

- offline-first para el ring
- una sola fuente de verdad por ring
- score auditable por juez y por evento
- UI clara aun bajo presion de torneo
- documentacion al dia cuando cambie arquitectura o despliegue

<!-- SPECKIT START -->
## Feature activo

- plan actual: `specs/003-event-ops/plan.md`
<!-- SPECKIT END -->
