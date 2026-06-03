# Data Model: Event Operations Workspace

## EventWorkspace

- `version`: version del formato persistido localmente
- `activeEventId`: identificador del evento actualmente visible en el ring
- `events`: coleccion de eventos competitivos locales
- `updatedAt`: ultima modificacion global del workspace

## CompetitionEvent

- `eventId`: identificador unico del evento
- `meta`: configuracion visible del evento
- `athletes`: participantes registrados para ese evento
- `activeAthleteId`: atleta actualmente proyectado en el ring
- `focusedJudgeId`: juez que recibe eventos de teclado
- `judges`: estado vivo de jueces y deducciones para el atleta activo
- `results`: resultados guardados de atletas ya calificados

### State transitions

- `setup` -> evento recien creado, aun sin resultados
- `running` -> evento con al menos un resultado guardado
- `completed` -> reservada para una fase posterior cuando se cierre el bracket

## TournamentMeta

- `eventName`
- `venue`
- `ringName`
- `mode`
- `modality`
- `branch`
- `roundName`
- `categoryLabel`
- `eventDate`
- `judgeCount`
- `status`
- `updatedAt`

## AthleteEntry

- `id`
- `order`
- `name`
- `club` (usado como club, universidad o delegacion)
- `state`
- `countryCode`
- `division`
- `category`
- `ageBand`
- `poomsae`
- `seed`
- `rankingPoints`

### Validation rules

- `order` debe ser unico dentro del evento
- `countryCode` se guarda en formato ISO alfa-3 en mayusculas
- `seed` y `rankingPoints` son opcionales pero, si existen, no pueden ser negativos

## SavedResult

- `id`
- `athleteId`
- `athleteName`
- `order`
- `finalScore`
- `savedAt`
- `usedJudgeIds`
- `droppedJudgeIds`
- `judgeBreakdown`

### Behavior

- Cada atleta puede tener solo un resultado activo por evento en este MVP
- Guardar otra vez el mismo atleta reemplaza su resultado anterior
- Las posiciones se calculan ordenando por `finalScore` descendente, luego por
  `seed` ascendente cuando exista, y finalmente por `order`
