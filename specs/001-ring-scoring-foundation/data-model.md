# Data Model - Ring Scoring Foundation

## Athlete

Representa a la persona que compite en el ring actual.

### Campos

- `id`
- `name`
- `club`
- `countryCode`
- `division`
- `category`
- `ageBand`
- `poomsae`
- `order`

## JudgeRecord

Estado vigente del juez para el atleta activo.

### Campos

- `id`
- `name`
- `technical`
- `presentation`
- `connected`
- `deductions[]`

## Deduction Event

Evento atómico de scoring que reduce una de las categorias del juez.

### Campos

- `id`
- `actionId`
- `bucket`
- `amount`
- `label`
- `appliedAt`

## RingSnapshot

Snapshot autoritativo local del ring usado para rehidratacion basica.

### Campos

- `meta`
- `athletes[]`
- `activeAthleteId`
- `focusedJudgeId`
- `judges[]`

## Meta del torneo

- `eventName`
- `ringName`
- `mode`
- `judgeCount`
- `updatedAt`

