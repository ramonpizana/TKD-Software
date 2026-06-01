# Research: Desktop Shell Foundation

## Decision 1: Usar Tauri como shell nativo

**Decision**: Adoptar `Tauri v2` como la base del host de escritorio.

**Rationale**:

- Encaja con la ADR ya aprobada del proyecto.
- Permite conservar la UI actual en `React + TypeScript`.
- Da una ruta clara a un producto Windows instalable sin mover el scoring
  critico a la nube.

**Alternatives considered**:

- `Electron`: valido, pero mas pesado para la meta actual de host local liviano.
- Solo navegador: rapido para prototipo, insuficiente para software entregable.

## Decision 2: Windows-first para la primera entrega de escritorio

**Decision**: Preparar primero el shell para Windows.

**Rationale**:

- El uso esperado en torneos locales apunta principalmente a laptops Windows.
- Los prerequisitos y la documentacion oficial de Tauri para Windows estan
  claros y suficientes para una primera ruta estable.

**Alternatives considered**:

- Multiplataforma simultanea: agrega dispersion demasiado temprano.
- Linux o macOS primero: menos alineado con el contexto operativo esperado.

## Decision 3: Mantener el flujo web actual y envolverlo

**Decision**: Mantener una sola UI y una sola logica de scoring, reutilizada
por web y por desktop.

**Rationale**:

- Evita divergencia funcional.
- Permite seguir desarrollando rapido con `npm run dev`.
- Reduce el riesgo de regresion sobre el flujo central del ring.

**Alternatives considered**:

- UI separada para desktop: aumenta complejidad sin valor inmediato.

## Decision 4: Usar NSIS como target inicial de Windows

**Decision**: Configurar el bundle inicial hacia `NSIS`.

**Rationale**:

- Produce un `setup.exe`, que encaja bien con la expectativa del usuario final.
- Evita arrancar con el camino de `MSI`, que tiene requisitos adicionales en
  algunos Windows.

**Alternatives considered**:

- `MSI`: util a futuro, pero no es el target inicial mas simple para esta fase.

## Decision 5: Mantener Cloudflare fuera del camino critico del ring

**Decision**: No mover el scoring del ring a Cloudflare en esta fase.

**Rationale**:

- El problema principal del producto es la confiabilidad en eventos sin internet.
- La nube sigue siendo valiosa para sync posterior, dashboards y consolidacion,
  pero no debe decidir el score en vivo.

**Alternatives considered**:

- Cloud-first: contradice el principio local-first del repositorio.
