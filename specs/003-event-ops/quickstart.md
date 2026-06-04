# Quickstart: Event Operations Workspace

## Objetivo del MVP

Operar un bracket local de poomsae con registro previo de atletas y resultados
persistentes dentro de la app actual, usando vistas separadas para reducir carga
operativa durante el torneo.

## Escenario rapido

1. Abrir la app.
2. Revisar la portada `Inicio` para ubicar el flujo general.
3. Entrar a `Crear evento`.
4. Configurar nombre del evento, sede, ring, ronda, categoria, modalidad y
   cantidad de jueces.
5. Registrar atletas con nombre, organizacion, pais, poomsae y ranking o
   siembra cuando aplique.
6. Cambiar a `Jueceo`.
7. Seleccionar al atleta activo.
8. Aplicar deducciones desde paneles de jueces.
9. Guardar el resultado confirmado del atleta.
10. Entrar a `Evento` para revisar posiciones y avance de la ronda.

## Verificaciones esperadas

- El evento sigue disponible despues de refrescar la app.
- Los atletas cargados permanecen en el orden configurado.
- El resultado guardado de cada atleta aparece en posiciones.
- Cambiar de evento no mezcla resultados ni roster.
- Los textos de tarjetas, tabs y paneles no se enciman ni se salen de su caja.
